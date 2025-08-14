-- Vista de Mascotas Disponibles para Adopción
CREATE OR REPLACE VIEW vista_mascotas_disponibles AS
SELECT 
    m.id,
    m.nombre,
    m.raza,
    m.edad,
    m.descripcion,
    m.foto,
    u.nombre || ' ' || u.apellido AS contacto,
    u.telefono AS telefono_contacto
FROM 
    Mascotas m
JOIN 
    Usuarios u ON m.usuario = u.id
WHERE 
    m.estado = 'Disponible'
ORDER BY 
    m.nombre;
    
-- Vista de campanias Activas con Progreso
CREATE OR REPLACE VIEW vista_campanias_activas AS
SELECT 
    c.id,
    c.nombre,
    c.descripcion,
    c.fechaInicio,
    c.fechaFin,
    c.objetivo,
    NVL(SUM(d.cantidad), 0) AS recaudado,
    ROUND(NVL(SUM(d.cantidad), 0) / c.objetivo * 100, 2) AS porcentaje_completado,
    u.nombre || ' ' || u.apellido AS responsable,
    u.telefono AS telefono_contacto
FROM 
    campanias c
LEFT JOIN 
    Donacionescampanias d ON c.id = d.campania
JOIN 
    Usuarios u ON c.usuario = u.id
WHERE 
    c.estado = 'Activa'
GROUP BY 
    c.id, c.nombre, c.descripcion, c.fechaInicio, c.fechaFin, 
    c.objetivo, u.nombre, u.apellido, u.telefono
ORDER BY 
    c.fechaFin;
    
--Vista de Historial Médico Completo de Mascotas
CREATE OR REPLACE VIEW vista_historial_medico AS
SELECT 
    m.id AS mascota_id,
    m.nombre AS mascota_nombre,
    m.raza,
    m.edad,
    h.fecha,
    h.diagnostico,
    h.tratamiento,
    h.veterinario,
    h.observaciones,
    u.nombre || ' ' || u.apellido AS dueno,
    u.telefono AS telefono_dueno
FROM 
    Mascotas m
JOIN 
    HistorialMedico h ON m.id = h.mascota
JOIN 
    Usuarios u ON m.usuario = u.id
WHERE 
    h.estado = 'Activo'
ORDER BY 
    m.nombre, h.fecha DESC;
    
    
-- Vista de Voluntarios Activos con sus Actividades
CREATE OR REPLACE VIEW vista_voluntarios_activos AS
SELECT 
    v.id AS voluntario_id,
    u.nombre || ' ' || u.apellido AS nombre_voluntario,
    u.email,
    u.telefono,
    v.fechaInicio,
    v.horas,
    LISTAGG(va.actividad, ', ') WITHIN GROUP (ORDER BY va.actividad) AS actividades,
    CASE 
        WHEN v.fechaFin IS NULL THEN 'Activo'
        ELSE 'Inactivo'
    END AS estado
FROM 
    Voluntarios v
JOIN 
    Usuarios u ON v.usuario = u.id
LEFT JOIN 
    VoluntariosActividades va ON v.id = va.voluntario_id
WHERE 
    v.estado = 'Activo'
GROUP BY 
    v.id, u.nombre, u.apellido, u.email, u.telefono, 
    v.fechaInicio, v.fechaFin, v.horas, v.estado
ORDER BY 
    u.nombre, u.apellido;
    
--Vista de Eventos Próximos con Asistencia
CREATE OR REPLACE VIEW vista_eventos_proximos AS
SELECT 
    e.id AS evento_id,
    e.nombre AS evento,
    e.descripcion,
    e.fecha,
    e.ubicacion,
    e.tipo,
    u.nombre || ' ' || u.apellido AS responsable,
    (SELECT COUNT(*) FROM EventosAsistencia ea WHERE ea.evento = e.id) AS cantidad_asistentes,
    CASE 
        WHEN e.fecha > SYSDATE THEN 'Por realizarse'
        WHEN e.fecha = TRUNC(SYSDATE) THEN 'Hoy'
        ELSE 'Realizado'
    END AS estado_evento
FROM 
    Eventos e
JOIN 
    Usuarios u ON e.responsable = u.id
WHERE 
    e.fecha >= TRUNC(SYSDATE) - 7  -- Hace 7 dias y los futuros
ORDER BY 
    e.fecha;

-- Adopciones con detalle
CREATE OR REPLACE VIEW vista_adopciones_detalle AS
SELECT a.id AS adopcion_id,
       a.fecha,
       u.nombre||' '||u.apellido AS adoptante,
       m.nombre AS mascota,
       m.raza,
       m.edad
  FROM Adopciones a
  JOIN Usuarios u ON u.id = a.usuario
  JOIN Mascotas m ON m.id = a.mascota
 ORDER BY a.fecha DESC;

-- Mascotas con su última atención médica
CREATE OR REPLACE VIEW vista_mascotas_ultima_consulta AS
SELECT m.id AS mascota_id,
       m.nombre,
       m.raza,
       ( SELECT MAX(h.fecha) FROM HistorialMedico h WHERE h.mascota = m.id ) AS ultima_fecha
  FROM Mascotas m;

-- Donaciones por campania (resumen)
CREATE OR REPLACE VIEW vista_donaciones_por_campania AS
SELECT c.id AS campania_id,
       c.nombre,
       NVL(SUM(d.cantidad),0) AS total_recaudado,
       COUNT(d.id) AS cant_donaciones
  FROM campanias c
  LEFT JOIN Donacionescampanias d ON d.campania = c.id
 GROUP BY c.id, c.nombre;

-- Inventario por vencer (<= 30 días)
CREATE OR REPLACE VIEW vista_inventario_por_vencer AS
SELECT i.*
  FROM Inventario i
 WHERE i.fechaCaducidad IS NOT NULL
   AND i.fechaCaducidad <= TRUNC(SYSDATE)+30
 ORDER BY i.fechaCaducidad;

-- Resumen por usuario (mascotas, reportes, adopciones)
CREATE OR REPLACE VIEW vista_usuarios_resumen AS
SELECT u.id,
       u.nombre||' '||u.apellido AS usuario,
       (SELECT COUNT(*) FROM Mascotas  m WHERE m.usuario=u.id) AS mascotas_registradas,
       (SELECT COUNT(*) FROM Reportes  r WHERE r.usuario=u.id) AS reportes,
       (SELECT COUNT(*) FROM Adopciones a WHERE a.usuario=u.id) AS adopciones
  FROM Usuarios u;