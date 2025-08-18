
  --NUEVAS VISTAS

  CREATE OR REPLACE VIEW vista_mascotas AS
SELECT 
    m.id,
    m.nombre AS nombre_mascota,
    m.raza,
    m.edad,
    m.descripcion,
    m.foto,
    m.estado,
    u.nombre || ' ' || u.apellido AS usuario
FROM mascotas m
JOIN usuarios u ON m.usuario_id = u.id;

CREATE OR REPLACE VIEW vista_mascotas_disponibles AS
SELECT 
    m.id,
    m.nombre AS nombre_mascota,
    m.raza,
    m.edad,
    m.descripcion,
    m.foto,
    m.estado,
    u.nombre || ' ' || u.apellido AS usuario
FROM mascotas m
JOIN usuarios u ON m.usuario = u.id
WHERE LOWER(m.estado) = 'disponible';

CREATE OR REPLACE VIEW vista_mascotas_adoptadas AS
SELECT 
    m.id,
    m.nombre AS nombre_mascota,
    m.raza,
    m.edad,
    m.descripcion,
    m.foto,
    m.estado,
    u.nombre || ' ' || u.apellido AS usuario
FROM mascotas m
JOIN usuarios u ON m.usuario = u.id
WHERE LOWER(m.estado) = 'adoptado';



CREATE OR REPLACE VIEW vista_eventos AS
SELECT 
    e.nombre AS nombre_evento,
    e.descripcion,
    TO_CHAR(e.fecha, 'DD/MM/YYYY') AS fecha,
    e.ubicacion,
    u.nombre || ' ' || u.apellido AS responsable,
    e.tipo,
    e.estado
FROM eventos e
JOIN usuarios u ON e.responsable = u.id;

CREATE OR REPLACE VIEW vista_eventos_virtuales AS
SELECT 
    e.nombre AS nombre_evento,
    e.descripcion,
    TO_CHAR(e.fecha, 'DD/MM/YYYY') AS fecha,
    e.ubicacion,
    u.nombre || ' ' || u.apellido AS responsable,
    e.tipo,
    e.estado
FROM eventos e
JOIN usuarios u ON e.responsable = u.id
WHERE LOWER(e.tipo) = 'virtual';

CREATE OR REPLACE VIEW vista_eventos_presenciales AS
SELECT 
    e.nombre AS nombre_evento,
    e.descripcion,
    TO_CHAR(e.fecha, 'DD/MM/YYYY') AS fecha,
    e.ubicacion,
    u.nombre || ' ' || u.apellido AS responsable,
    e.tipo,
    e.estado
FROM eventos e
JOIN usuarios u ON e.responsable = u.id
WHERE LOWER(e.tipo) = 'presencial';


CREATE OR REPLACE VIEW vista_campanias AS
SELECT
    nombre AS "Nombre de la Campaña",
    fechainicio    AS "Fecha Inicio",
    fechafin       AS "Fecha Fin",
    descripcion     AS "Descripción"
FROM campanias;

CREATE OR REPLACE VIEW vista_campanias_activas AS
SELECT
    ID,
    NOMBRE AS "Nombre de la Campaña",
    FECHAINICIO AS "Fecha Inicio",
    FECHAFIN AS "Fecha Fin",
    DESCRIPCION AS "Descripción",
    OBJETIVO,
    USUARIO
FROM campanias
WHERE LOWER(ESTADO) = 'activa';

CREATE OR REPLACE VIEW vista_campanias_inactivas AS
SELECT
    ID,
    NOMBRE AS "Nombre de la Campaña",
    FECHAINICIO AS "Fecha Inicio",
    FECHAFIN AS "Fecha Fin",
    DESCRIPCION AS "Descripción",
    OBJETIVO,
    USUARIO
FROM campanias
WHERE LOWER(ESTADO) = 'inactiva';




CREATE OR REPLACE VIEW vista_inventarios AS
SELECT
    nombre        AS "Nombre del Producto",
    tipo          AS "Tipo",
    cantidad      AS "Cantidad",
    fechaingreso  AS "Fecha de Ingreso",
    fechacaducidad AS "Fecha de Caducidad",
    proveedor     AS "Proveedor",
    fuente        AS "Fuente"
FROM inventario;

CREATE OR REPLACE VIEW vista_inventarios_donacion AS
SELECT
    nombre        AS "Nombre del Producto",
    tipo          AS "Tipo",
    cantidad      AS "Cantidad",
    fechaingreso  AS "Fecha de Ingreso",
    fechacaducidad AS "Fecha de Caducidad",
    proveedor     AS "Proveedor",
    fuente        AS "Fuente"
FROM inventario
WHERE LOWER(fuente) = 'donacion';

CREATE OR REPLACE VIEW vista_inventarios_compra AS
SELECT
    nombre        AS "Nombre del Producto",
    tipo          AS "Tipo",
    cantidad      AS "Cantidad",
    fechaingreso  AS "Fecha de Ingreso",
    fechacaducidad AS "Fecha de Caducidad",
    proveedor     AS "Proveedor",
    fuente        AS "Fuente"
FROM inventario
WHERE LOWER(fuente) = 'compra';

CREATE OR REPLACE VIEW vista_inventarios_caducidad AS
SELECT
    id,
    nombre          AS "Nombre del Producto",
    tipo            AS "Tipo",
    cantidad        AS "Cantidad",
    fechaingreso    AS "Fecha de Ingreso",
    fechacaducidad  AS "Fecha de Caducidad",
    proveedor       AS "Proveedor",
    fuente          AS "Fuente",
    CASE 
        WHEN fechacaducidad < TRUNC(SYSDATE) THEN 'Vencido'
        ELSE 'Vigente'
    END AS "Estado"
FROM inventario;



CREATE OR REPLACE VIEW vista_voluntarios AS
SELECT 
    u.nombre || ' ' || u.apellido AS nombre_completo,
    TO_CHAR(v.fechainicio, 'DD/MM/YYYY') AS fecha_inicio,
    TO_CHAR(v.fechafin, 'DD/MM/YYYY') AS fecha_fin,
    v.horas,
    v.estado
FROM voluntarios v
JOIN usuarios u ON v.usuario = u.id;


CREATE OR REPLACE VIEW VistaUsuarios AS
SELECT id, nombre || ' ' || apellido AS nombre_completo
FROM usuarios;


CREATE OR REPLACE VIEW vista_usuarios AS
SELECT 
    id, 
    nombre, 
    apellido, 
    email, 
    password, 
    rol, 
    telefono
FROM Usuarios;

CREATE OR REPLACE VIEW vista_usuarios_roles AS
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.password,
    u.telefono,
    r.nombre AS nombre_rol
FROM Usuarios u
JOIN Roles r
    ON u.rol = r.id;
    

/*IDEAS 
Voluntarios
INVENTARIOS

TRIGGER O ALGO QUE CUANDO UN EVENTO LA FECHA PASE DE AYER, CAMBIE A INACTIVO
TRIGGER CREAR USUARIO EN BD 
TRIIGER ASIGNAR ROLES

