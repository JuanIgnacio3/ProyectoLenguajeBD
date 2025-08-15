-- 1. Cursor para listar mascotas disponibles
DECLARE
  CURSOR cur_mascotas_disponibles IS
    SELECT id, nombre, raza, edad FROM Mascotas WHERE estado = 'Disponible' ORDER BY nombre;
BEGIN
  FOR mascota IN cur_mascotas_disponibles LOOP
    DBMS_OUTPUT.PUT_LINE('Mascota: ' || mascota.nombre || ', Raza: ' || mascota.raza || ', Edad: ' || mascota.edad);
  END LOOP;
END;
/

-- 2. Cursor para obtener campanias activas y su objetivo
DECLARE
  CURSOR cur_campanias_activas IS
    SELECT id, nombre, objetivo FROM campanias WHERE estado = 'Activa';
BEGIN
  FOR campania IN cur_campanias_activas LOOP
    DBMS_OUTPUT.PUT_LINE('campania: ' || campania.nombre || ', Objetivo: ' || campania.objetivo);
  END LOOP;
END;
/

-- 3. Cursor para listar voluntarios activos con su correo
DECLARE
  CURSOR cur_voluntarios IS
    SELECT u.nombre, u.apellido, u.email FROM Voluntarios v JOIN Usuarios u ON v.usuario = u.id WHERE v.estado = 'Activo';
BEGIN
  FOR voluntario IN cur_voluntarios LOOP
    DBMS_OUTPUT.PUT_LINE('Voluntario: ' || voluntario.nombre || ' ' || voluntario.apellido || ', Email: ' || voluntario.email);
  END LOOP;
END;
/

-- 4. Cursor para listar eventos próximos
DECLARE
  CURSOR cur_eventos_proximos IS
    SELECT nombre, fecha FROM Eventos WHERE fecha >= TRUNC(SYSDATE) ORDER BY fecha;
BEGIN
  FOR evento IN cur_eventos_proximos LOOP
    DBMS_OUTPUT.PUT_LINE('Evento: ' || evento.nombre || ', Fecha: ' || TO_CHAR(evento.fecha, 'DD-MM-YYYY'));
  END LOOP;
END;
/

-- 5. Cursor para mascotas con historial médico activo
DECLARE
  CURSOR cur_historial_medico IS
    SELECT m.nombre AS mascota, h.fecha, h.diagnostico FROM Mascotas m
    JOIN HistorialMedico h ON m.id = h.mascota
    WHERE h.estado = 'Activo';
BEGIN
  FOR registro IN cur_historial_medico LOOP
    DBMS_OUTPUT.PUT_LINE('Mascota: ' || registro.mascota || ', Fecha: ' || TO_CHAR(registro.fecha, 'DD-MM-YYYY') || ', Diagnóstico: ' || registro.diagnostico);
  END LOOP;
END;
/

-- 6. Cursor para contar donaciones por campania
DECLARE
  CURSOR cur_donaciones_campania IS
    SELECT campania, COUNT(*) AS total_donaciones FROM Donacionescampanias GROUP BY campania;
BEGIN
  FOR registro IN cur_donaciones_campania LOOP
    DBMS_OUTPUT.PUT_LINE('campania ID: ' || registro.campania || ', Donaciones: ' || registro.total_donaciones);
  END LOOP;
END;
/

-- 7. Cursor para listar mascotas por usuario
DECLARE
  v_usuario_id NUMBER := 1; -- ejemplo
  CURSOR cur_mascotas_usuario IS
    SELECT nombre, estado FROM Mascotas WHERE usuario = v_usuario_id;
BEGIN
  FOR mascota IN cur_mascotas_usuario LOOP
    DBMS_OUTPUT.PUT_LINE('Mascota: ' || mascota.nombre || ', Estado: ' || mascota.estado);
  END LOOP;
END;
/

-- 8. Cursor para obtener voluntarios y sus horas trabajadas
DECLARE
  CURSOR cur_voluntarios_horas IS
    SELECT u.nombre || ' ' || u.apellido AS nombre, v.horas FROM Voluntarios v
    JOIN Usuarios u ON v.usuario = u.id WHERE v.estado = 'Activo';
BEGIN
  FOR voluntario IN cur_voluntarios_horas LOOP
    DBMS_OUTPUT.PUT_LINE('Voluntario: ' || voluntario.nombre || ', Horas: ' || voluntario.horas);
  END LOOP;
END;
/

-- 9. Cursor para listar campanias y porcentaje completado
DECLARE
  CURSOR cur_campanias_porcentaje IS
    SELECT c.id, c.nombre,
           ROUND(NVL(SUM(d.cantidad), 0) / c.objetivo * 100, 2) AS porcentaje
    FROM campanias c
    LEFT JOIN Donacionescampanias d ON c.id = d.campania
    WHERE c.estado = 'Activa'
    GROUP BY c.id, c.nombre, c.objetivo;
BEGIN
  FOR campania IN cur_campanias_porcentaje LOOP
    DBMS_OUTPUT.PUT_LINE('campania: ' || campania.nombre || ', Completado: ' || campania.porcentaje || '%');
  END LOOP;
END;
/

-- 10. Cursor para listar mascotas por raza
DECLARE
  v_raza VARCHAR2(50) := 'Labrador'; -- ejemplo
  CURSOR cur_mascotas_raza IS
    SELECT nombre, edad FROM Mascotas WHERE raza = v_raza;
BEGIN
  FOR mascota IN cur_mascotas_raza LOOP
    DBMS_OUTPUT.PUT_LINE('Mascota: ' || mascota.nombre || ', Edad: ' || mascota.edad);
  END LOOP;
END;
/

-- 11. Cursor para eventos realizados el último mes
DECLARE
  CURSOR cur_eventos_mes IS
    SELECT nombre, fecha FROM Eventos WHERE fecha BETWEEN ADD_MONTHS(TRUNC(SYSDATE), -1) AND TRUNC(SYSDATE);
BEGIN
  FOR evento IN cur_eventos_mes LOOP
    DBMS_OUTPUT.PUT_LINE('Evento: ' || evento.nombre || ', Fecha: ' || TO_CHAR(evento.fecha, 'DD-MM-YYYY'));
  END LOOP;
END;
/

-- 12. Cursor para obtener actividades de voluntarios
DECLARE
  v_voluntario_id NUMBER := 1; -- ejemplo
  CURSOR cur_actividades IS
    SELECT actividad FROM VoluntariosActividades WHERE voluntario_id = v_voluntario_id;
BEGIN
  FOR actividad IN cur_actividades LOOP
    DBMS_OUTPUT.PUT_LINE('Actividad: ' || actividad.actividad);
  END LOOP;
END;
/

-- 13. Cursor para contar mascotas adoptadas
DECLARE
  v_cont NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_cont FROM Mascotas WHERE estado = 'Adoptada';
  DBMS_OUTPUT.PUT_LINE('Mascotas adoptadas: ' || v_cont);
END;
/

-- 14. Cursor para listar usuarios con mascotas
DECLARE
  CURSOR cur_usuarios_mascotas IS
    SELECT u.nombre, u.apellido, COUNT(m.id) AS total_mascotas
    FROM Usuarios u
    LEFT JOIN Mascotas m ON u.id = m.usuario
    GROUP BY u.nombre, u.apellido;
BEGIN
  FOR usuario IN cur_usuarios_mascotas LOOP
    DBMS_OUTPUT.PUT_LINE('Usuario: ' || usuario.nombre || ' ' || usuario.apellido || ', Mascotas: ' || usuario.total_mascotas);
  END LOOP;
END;
/

-- 15. Cursor para obtener mascotas con descripciones largas (más de 100 caracteres)
DECLARE
  CURSOR cur_mascotas_descripcion IS
    SELECT nombre, LENGTH(descripcion) AS largo FROM Mascotas WHERE LENGTH(descripcion) > 100;
BEGIN
  FOR mascota IN cur_mascotas_descripcion LOOP
    DBMS_OUTPUT.PUT_LINE('Mascota: ' || mascota.nombre || ', Longitud descripción: ' || mascota.largo);
  END LOOP;
END;
/

-- 16. Cursor para recorrer tabla usuarios y asignar roles


DECLARE
    -- Cursor para recorrer todos los usuarios de la tabla
    CURSOR cur_usuarios IS
        SELECT id, nombre, rol
        FROM Usuarios;

    v_profile VARCHAR2(50);
    v_sql     VARCHAR2(1000);

BEGIN
    FOR usr IN cur_usuarios LOOP
        -- Asignar perfil según el rol
        IF usr.rol = 1 THEN
            v_profile := 'perfil_admin_Proyecto';
        ELSIF usr.rol = 2 THEN
            v_profile := 'perfil_usuario_Proyecto';
        ELSIF usr.rol = 3 THEN
            v_profile := 'perfil_voluntario_Proyecto';
        ELSE
            v_profile := 'perfil_usuario_Proyecto'; -- Default
        END IF;

        -- Crear el usuario de Oracle con tablespace y contraseña temporal
        BEGIN
            v_sql := 'CREATE USER ' || usr.nombre || 
                     ' IDENTIFIED BY "TempPass123" ' ||
                     ' DEFAULT TABLESPACE dejandoHuella_ts ' ||
                     ' TEMPORARY TABLESPACE dejandoHuella_temp ' ||
                     ' QUOTA UNLIMITED ON dejandoHuella_ts';
            EXECUTE IMMEDIATE v_sql;
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Usuario ' || usr.nombre || ' ya existe o error: ' || SQLERRM);
        END;

        -- Otorgar privilegios CONNECT
        BEGIN
            v_sql := 'GRANT CONNECT TO ' || usr.nombre;
            EXECUTE IMMEDIATE v_sql;
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error otorgando CONNECT a ' || usr.nombre || ': ' || SQLERRM);
        END;

        -- Asignar perfil
        BEGIN
            v_sql := 'ALTER USER ' || usr.nombre || ' PROFILE ' || v_profile;
            EXECUTE IMMEDIATE v_sql;
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error asignando perfil a ' || usr.nombre || ': ' || SQLERRM);
        END;

        DBMS_OUTPUT.PUT_LINE('Usuario ' || usr.nombre || ' procesado.');
    END LOOP;
END;
/
