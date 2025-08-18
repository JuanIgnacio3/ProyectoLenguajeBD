-- =============================
-- PAQUETE MASCOTA
-- =============================
CREATE OR REPLACE PACKAGE pkg_mascota IS
  PROCEDURE sp_get_all_mascotas(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_create_mascota(
      p_nombre IN VARCHAR2, p_raza IN VARCHAR2, p_edad IN NUMBER,
      p_descripcion IN VARCHAR2, p_foto IN VARCHAR2, p_estado IN VARCHAR2,
      p_usuario IN NUMBER, p_id OUT NUMBER
  );
  PROCEDURE sp_get_mascota_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_update_mascota(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_raza IN VARCHAR2, p_edad IN NUMBER,
      p_descripcion IN VARCHAR2, p_foto IN VARCHAR2, p_estado IN VARCHAR2, p_usuario IN NUMBER
  );
  PROCEDURE sp_delete_mascota(p_id IN NUMBER);
  PROCEDURE sp_get_mascotas_disponibles(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_mascotas_adoptadas(p_cursor OUT SYS_REFCURSOR);

  FUNCTION fn_categoria_edad(p_edad NUMBER) RETURN VARCHAR2;
  FUNCTION fn_mascota_estado_texto(p_mascota_id NUMBER) RETURN VARCHAR2;
  FUNCTION fn_mascota_tiene_historial(p_mascota_id NUMBER) RETURN NUMBER;
  FUNCTION fn_total_mascotas_usuario(p_usuario_id NUMBER) RETURN NUMBER;
END pkg_mascota;
/

CREATE OR REPLACE PACKAGE BODY pkg_mascota IS
  PROCEDURE sp_get_all_mascotas(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT id, nombre, raza, edad, descripcion, foto, estado, usuario FROM Mascotas;
  END;

  PROCEDURE sp_create_mascota(
      p_nombre IN VARCHAR2, p_raza IN VARCHAR2, p_edad IN NUMBER,
      p_descripcion IN VARCHAR2, p_foto IN VARCHAR2, p_estado IN VARCHAR2,
      p_usuario IN NUMBER, p_id OUT NUMBER
  ) IS
  BEGIN
      SELECT seq_mascotas.NEXTVAL INTO p_id FROM dual;
      INSERT INTO Mascotas(id, nombre, raza, edad, descripcion, foto, estado, usuario)
      VALUES(p_id, p_nombre, p_raza, p_edad, p_descripcion, p_foto, p_estado, p_usuario);
      COMMIT;
  END;

  PROCEDURE sp_get_mascota_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR
      SELECT m.*, u.nombre AS dueno
      FROM Mascotas m
      LEFT JOIN Usuarios u ON m.usuario = u.id
      WHERE m.id = p_id;
  END;

  PROCEDURE sp_update_mascota(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_raza IN VARCHAR2, p_edad IN NUMBER,
      p_descripcion IN VARCHAR2, p_foto IN VARCHAR2, p_estado IN VARCHAR2, p_usuario IN NUMBER
  ) IS
  BEGIN
      UPDATE Mascotas
      SET nombre = p_nombre, raza = p_raza, edad = p_edad, descripcion = p_descripcion,
          foto = p_foto, estado = p_estado, usuario = p_usuario
      WHERE id = p_id;
      COMMIT;
  END;

  PROCEDURE sp_delete_mascota(p_id IN NUMBER) IS
  BEGIN
      DELETE FROM Mascotas WHERE id = p_id;
      COMMIT;
  END;

  PROCEDURE sp_get_mascotas_disponibles(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM vista_mascotas_disponibles;
  END;

  PROCEDURE sp_get_mascotas_adoptadas(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM vista_mascotas_adoptadas;
  END;

  FUNCTION fn_categoria_edad(p_edad NUMBER) RETURN VARCHAR2 IS
  BEGIN
      IF p_edad IS NULL THEN RETURN 'N/D';
      ELSIF p_edad < 1 THEN RETURN 'Cachorro';
      ELSIF p_edad <= 7 THEN RETURN 'Adulto';
      ELSE RETURN 'Senior';
      END IF;
  END;

  FUNCTION fn_mascota_estado_texto(p_mascota_id NUMBER) RETURN VARCHAR2 IS v_est VARCHAR2(20);
  BEGIN
      SELECT estado INTO v_est FROM Mascotas WHERE id=p_mascota_id;
      RETURN v_est;
  EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 'N/D';
  END;

  FUNCTION fn_mascota_tiene_historial(p_mascota_id NUMBER) RETURN NUMBER IS v NUMBER;
  BEGIN
      SELECT COUNT(*) INTO v FROM HistorialMedico WHERE mascota=p_mascota_id;
      RETURN CASE WHEN v>0 THEN 1 ELSE 0 END;
  END;

  FUNCTION fn_total_mascotas_usuario(p_usuario_id NUMBER) RETURN NUMBER IS v_cnt NUMBER;
  BEGIN
      SELECT COUNT(*) INTO v_cnt FROM Mascotas WHERE usuario=p_usuario_id;
      RETURN v_cnt;
  END;

END pkg_mascota;
/

-- =============================
-- PAQUETE VOLUNTARIO
-- =============================
CREATE OR REPLACE PACKAGE pkg_voluntario IS
  PROCEDURE sp_get_all_voluntarios(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_voluntario_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_search_voluntario_by_usuario(p_usuario IN NUMBER, p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_create_voluntario(
      p_usuario IN NUMBER, p_fechainicio IN DATE, p_fechafin IN DATE, p_horas IN NUMBER, p_estado IN VARCHAR2, p_id OUT NUMBER
  );
  PROCEDURE sp_update_voluntario(
      p_id IN NUMBER, p_usuario IN NUMBER, p_fechainicio IN DATE, p_fechafin IN DATE, p_horas IN NUMBER, p_estado IN VARCHAR2
  );
  PROCEDURE sp_delete_voluntario(p_id IN NUMBER);

  FUNCTION fn_voluntario_horas(p_voluntario_id NUMBER) RETURN NUMBER;
  FUNCTION fn_es_voluntario(p_usuario_id NUMBER) RETURN NUMBER;
END pkg_voluntario;
/

CREATE OR REPLACE PACKAGE BODY pkg_voluntario IS
  PROCEDURE sp_get_all_voluntarios(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT id, usuario, fechainicio, fechafin, horas, estado FROM Voluntarios ORDER BY fechainicio DESC;
  END;

  PROCEDURE sp_get_voluntario_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM Voluntarios WHERE id=p_id;
  END;

  PROCEDURE sp_search_voluntario_by_usuario(p_usuario IN NUMBER, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM Voluntarios WHERE usuario=p_usuario;
  END;

  PROCEDURE sp_create_voluntario(
      p_usuario IN NUMBER, p_fechainicio IN DATE, p_fechafin IN DATE, p_horas IN NUMBER, p_estado IN VARCHAR2, p_id OUT NUMBER
  ) IS
  BEGIN
      SELECT seq_voluntarios.NEXTVAL INTO p_id FROM dual;
      INSERT INTO Voluntarios(id, usuario, fechainicio, fechafin, horas, estado)
      VALUES(p_id, p_usuario, p_fechainicio, p_fechafin, p_horas, p_estado);
      COMMIT;
  END;

  PROCEDURE sp_update_voluntario(
      p_id IN NUMBER, p_usuario IN NUMBER, p_fechainicio IN DATE, p_fechafin IN DATE, p_horas IN NUMBER, p_estado IN VARCHAR2
  ) IS
  BEGIN
      UPDATE Voluntarios
      SET usuario=p_usuario, fechainicio=p_fechainicio, fechafin=p_fechafin, horas=p_horas, estado=p_estado
      WHERE id=p_id;
      COMMIT;
  END;

  PROCEDURE sp_delete_voluntario(p_id IN NUMBER) IS
  BEGIN
      DELETE FROM Voluntarios WHERE id=p_id;
      COMMIT;
  END;

  FUNCTION fn_voluntario_horas(p_voluntario_id NUMBER) RETURN NUMBER IS v NUMBER;
  BEGIN
      SELECT horas INTO v FROM Voluntarios WHERE id=p_voluntario_id;
      RETURN NVL(v,0);
  EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
  END;

  FUNCTION fn_es_voluntario(p_usuario_id NUMBER) RETURN NUMBER IS v NUMBER;
  BEGIN
      SELECT COUNT(*) INTO v FROM Voluntarios WHERE usuario=p_usuario_id AND estado='Activo';
      RETURN CASE WHEN v>0 THEN 1 ELSE 0 END;
  END;

END pkg_voluntario;
/

-- =============================
-- PAQUETE EVENTO
-- =============================
CREATE OR REPLACE PACKAGE pkg_evento IS
  PROCEDURE sp_get_all_eventos(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_eventos_virtuales(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_eventos_presenciales(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_create_evento(
      p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_fecha IN DATE, p_ubicacion IN VARCHAR2,
      p_responsable IN NUMBER, p_tipo IN VARCHAR2, p_estado IN VARCHAR2, p_id OUT NUMBER
  );
  PROCEDURE sp_get_evento_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_update_evento(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_fecha IN DATE,
      p_ubicacion IN VARCHAR2, p_responsable IN NUMBER, p_tipo IN VARCHAR2, p_estado IN VARCHAR2
  );
  PROCEDURE sp_delete_evento(p_id IN NUMBER);

  FUNCTION fn_evento_estado_texto(p_evento_id NUMBER) RETURN VARCHAR2;
  FUNCTION fn_evento_asistentes(p_evento_id NUMBER) RETURN NUMBER;
END pkg_evento;
/

CREATE OR REPLACE PACKAGE BODY pkg_evento IS
  PROCEDURE sp_get_all_eventos(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT id, nombre, descripcion, fecha, ubicacion, responsable, tipo, estado FROM Eventos ORDER BY fecha DESC;
  END;

  PROCEDURE sp_get_eventos_virtuales(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM vista_eventos_virtuales ORDER BY fecha DESC;
  END;

  PROCEDURE sp_get_eventos_presenciales(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM vista_eventos_presenciales ORDER BY fecha DESC;
  END;

  PROCEDURE sp_create_evento(
      p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_fecha IN DATE, p_ubicacion IN VARCHAR2,
      p_responsable IN NUMBER, p_tipo IN VARCHAR2, p_estado IN VARCHAR2, p_id OUT NUMBER
  ) IS
  BEGIN
      SELECT seq_eventos.NEXTVAL INTO p_id FROM dual;
      INSERT INTO Eventos(id, nombre, descripcion, fecha, ubicacion, responsable, tipo, estado)
      VALUES(p_id, p_nombre, p_descripcion, p_fecha, p_ubicacion, p_responsable, p_tipo, p_estado);
      COMMIT;
  END;

  PROCEDURE sp_get_evento_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR
      SELECT e.*, u.nombre AS responsable_nombre
      FROM Eventos e
      LEFT JOIN Usuarios u ON e.responsable = u.id
      WHERE e.id = p_id;
  END;

  PROCEDURE sp_update_evento(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_fecha IN DATE,
      p_ubicacion IN VARCHAR2, p_responsable IN NUMBER, p_tipo IN VARCHAR2, p_estado IN VARCHAR2
  ) IS
  BEGIN
      UPDATE Eventos
      SET nombre=p_nombre, descripcion=p_descripcion, fecha=p_fecha, ubicacion=p_ubicacion,
          responsable=p_responsable, tipo=p_tipo, estado=p_estado
      WHERE id=p_id;
      COMMIT;
  END;

  PROCEDURE sp_delete_evento(p_id IN NUMBER) IS
  BEGIN
      DELETE FROM Eventos WHERE id=p_id;
      COMMIT;
  END;

  FUNCTION fn_evento_estado_texto(p_evento_id NUMBER) RETURN VARCHAR2 IS v_fecha DATE;
  BEGIN
      SELECT fecha INTO v_fecha FROM Eventos WHERE id=p_evento_id;
      IF v_fecha > SYSDATE THEN RETURN 'Por realizarse';
      ELSIF TRUNC(v_fecha) = TRUNC(SYSDATE) THEN RETURN 'Hoy';
      ELSE RETURN 'Realizado';
      END IF;
  EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 'N/D';
  END;

  FUNCTION fn_evento_asistentes(p_evento_id NUMBER) RETURN NUMBER IS v NUMBER;
  BEGIN
      SELECT COUNT(*) INTO v FROM EventosAsistencia WHERE evento=p_evento_id;
      RETURN v;
  END;

END pkg_evento;
/

-- =============================
-- PAQUETE CAMPAÑAS
-- =============================
CREATE OR REPLACE PACKAGE pkg_campania IS
  PROCEDURE sp_get_all_campanias(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_campanias_activas(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_campanias_inactivas(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_campania_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_create_campania(
      p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_FECHAINICIO IN DATE,
      p_FECHAFIN IN DATE, p_objetivo IN NUMBER, p_estado IN VARCHAR2, p_usuario IN NUMBER, p_id OUT NUMBER
  );
  PROCEDURE sp_update_campania(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_FECHAINICIO IN DATE,
      p_FECHAFIN IN DATE, p_objetivo IN NUMBER, p_estado IN VARCHAR2, p_usuario IN NUMBER
  );
  PROCEDURE sp_delete_campania(p_id IN NUMBER);

  FUNCTION fn_campania_recaudado(p_campania_id NUMBER) RETURN NUMBER;
  FUNCTION fn_campania_porcentaje(p_campania_id NUMBER) RETURN NUMBER;
  FUNCTION fn_dias_restantes_campania(p_campania_id NUMBER) RETURN NUMBER;
END pkg_campania;
/

CREATE OR REPLACE PACKAGE BODY pkg_campania IS
  PROCEDURE sp_get_all_campanias(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT id, nombre, descripcion, FECHAINICIO, FECHAFIN, objetivo, estado, usuario FROM Campanias ORDER BY FECHAINICIO DESC;
  END;

  PROCEDURE sp_get_campanias_activas(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM vista_campanias_activas ORDER BY "Fecha Inicio" DESC;
  END;

  PROCEDURE sp_get_campanias_inactivas(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM vista_campanias_inactivas ORDER BY "Fecha Inicio" DESC;
  END;

  PROCEDURE sp_get_campania_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR
      SELECT c.*, u.nombre AS usuario_nombre
      FROM Campanias c
      LEFT JOIN Usuarios u ON c.usuario = u.id
      WHERE c.id = p_id;
  END;

  PROCEDURE sp_create_campania(
      p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_FECHAINICIO IN DATE,
      p_FECHAFIN IN DATE, p_objetivo IN NUMBER, p_estado IN VARCHAR2, p_usuario IN NUMBER, p_id OUT NUMBER
  ) IS
  BEGIN
      SELECT seq_campanias.NEXTVAL INTO p_id FROM dual;
      INSERT INTO Campanias(id, nombre, descripcion, FECHAINICIO, FECHAFIN, objetivo, estado, usuario)
      VALUES(p_id, p_nombre, p_descripcion, p_FECHAINICIO, p_FECHAFIN, p_objetivo, p_estado, p_usuario);
      COMMIT;
  END;

  PROCEDURE sp_update_campania(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_descripcion IN VARCHAR2, p_FECHAINICIO IN DATE,
      p_FECHAFIN IN DATE, p_objetivo IN NUMBER, p_estado IN VARCHAR2, p_usuario IN NUMBER
  ) IS
  BEGIN
      UPDATE Campanias
      SET nombre=p_nombre, descripcion=p_descripcion, FECHAINICIO=p_FECHAINICIO, FECHAFIN=p_FECHAFIN,
          objetivo=p_objetivo, estado=p_estado, usuario=p_usuario
      WHERE id=p_id;
      COMMIT;
  END;

  PROCEDURE sp_delete_campania(p_id IN NUMBER) IS
  BEGIN
      DELETE FROM Campanias WHERE id=p_id;
      COMMIT;
  END;

  FUNCTION fn_campania_recaudado(p_campania_id NUMBER) RETURN NUMBER IS v_total NUMBER;
  BEGIN
      SELECT NVL(SUM(cantidad),0) INTO v_total FROM Donacionescampanias WHERE campania=p_campania_id;
      RETURN v_total;
  END;

  FUNCTION fn_campania_porcentaje(p_campania_id NUMBER) RETURN NUMBER IS v_obj NUMBER; v_tot NUMBER;
  BEGIN
      SELECT objetivo INTO v_obj FROM campanias WHERE id=p_campania_id;
      v_tot := fn_campania_recaudado(p_campania_id);
      IF v_obj=0 THEN RETURN 0; END IF;
      RETURN ROUND((v_tot / v_obj) * 100, 2);
  EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
  END;

  FUNCTION fn_dias_restantes_campania(p_campania_id NUMBER) RETURN NUMBER IS v_fin DATE;
  BEGIN
      SELECT fechaFin INTO v_fin FROM campanias WHERE id=p_campania_id;
      RETURN GREATEST(TRUNC(v_fin)-TRUNC(SYSDATE),0);
  EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
  END;

END pkg_campania;
/

-- =============================
-- PAQUETE INVENTARIO
-- =============================
CREATE OR REPLACE PACKAGE pkg_inventario IS
  PROCEDURE sp_get_all_inventario(p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_get_inventario_by_tipo(p_tipo IN VARCHAR2, p_cursor OUT SYS_REFCURSOR);
  PROCEDURE sp_create_inventario(
      p_nombre IN VARCHAR2, p_tipo IN VARCHAR2, p_cantidad IN NUMBER, p_caducidad IN DATE, p_id OUT NUMBER
  );
  PROCEDURE sp_update_inventario(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_tipo IN VARCHAR2, p_cantidad IN NUMBER, p_caducidad IN DATE
  );
  PROCEDURE sp_delete_inventario(p_id IN NUMBER);

  FUNCTION fn_inventario_vencido(p_id NUMBER) RETURN NUMBER;
END pkg_inventario;
/

CREATE OR REPLACE PACKAGE BODY pkg_inventario IS
  PROCEDURE sp_get_all_inventario(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT id, nombre, tipo, cantidad, caducidad FROM Inventario ORDER BY nombre;
  END;

  PROCEDURE sp_get_inventario_by_tipo(p_tipo IN VARCHAR2, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR SELECT * FROM Inventario WHERE tipo=p_tipo ORDER BY nombre;
  END;

  PROCEDURE sp_create_inventario(
      p_nombre IN VARCHAR2, p_tipo IN VARCHAR2, p_cantidad IN NUMBER, p_caducidad IN DATE, p_id OUT NUMBER
  ) IS
  BEGIN
      SELECT seq_inventario.NEXTVAL INTO p_id FROM dual;
      INSERT INTO Inventario(id, nombre, tipo, cantidad, caducidad)
      VALUES(p_id, p_nombre, p_tipo, p_cantidad, p_caducidad);
      COMMIT;
  END;

  PROCEDURE sp_update_inventario(
      p_id IN NUMBER, p_nombre IN VARCHAR2, p_tipo IN VARCHAR2, p_cantidad IN NUMBER, p_caducidad IN DATE
  ) IS
  BEGIN
      UPDATE Inventario
      SET nombre=p_nombre, tipo=p_tipo, cantidad=p_cantidad, caducidad=p_caducidad
      WHERE id=p_id;
      COMMIT;
  END;

  PROCEDURE sp_delete_inventario(p_id IN NUMBER) IS
  BEGIN
      DELETE FROM Inventario WHERE id=p_id;
      COMMIT;
  END;

  FUNCTION fn_inventario_vencido(p_id NUMBER) RETURN NUMBER IS v_date DATE;
  BEGIN
      SELECT caducidad INTO v_date FROM Inventario WHERE id=p_id;
      RETURN CASE WHEN v_date < SYSDATE THEN 1 ELSE 0 END;
  EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
  END;

END pkg_inventario;
/
-- =============================
-- PAQUETE USUARIO
-- =============================
CREATE OR REPLACE PACKAGE pkg_usuario IS

  -- Traer todos los usuarios
  PROCEDURE sp_get_all_usuarios(p_cursor OUT SYS_REFCURSOR);

  -- Crear un usuario
  PROCEDURE sp_create_usuario(
      p_nombre IN VARCHAR2,
      p_apellido IN VARCHAR2,
      p_email IN VARCHAR2,
      p_password IN VARCHAR2,
      p_rol IN VARCHAR2,
      p_telefono IN VARCHAR2,
      p_id OUT NUMBER
  );

  -- Traer usuario por ID
  PROCEDURE sp_get_usuario_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR);

  -- Traer usuario por EMAIL
  PROCEDURE sp_get_usuario_by_email(p_email IN VARCHAR2, p_cursor OUT SYS_REFCURSOR);

  -- Actualizar usuario
  PROCEDURE sp_update_usuario(
      p_id IN NUMBER,
      p_nombre IN VARCHAR2,
      p_apellido IN VARCHAR2,
      p_email IN VARCHAR2,
      p_password IN VARCHAR2,
      p_rol IN VARCHAR2,
      p_telefono IN VARCHAR2
  );

  -- Eliminar usuario
  PROCEDURE sp_delete_usuario(p_id IN NUMBER);

  -- Contar total de usuarios
  FUNCTION fn_total_usuarios RETURN NUMBER;

  -- Obtener rol de usuario
  FUNCTION fn_usuario_rol(p_usuario_id NUMBER) RETURN VARCHAR2;

END pkg_usuario;
/
-- =============================
-- CUERPO DEL PAQUETE
-- =============================
CREATE OR REPLACE PACKAGE BODY pkg_usuario IS

  PROCEDURE sp_get_all_usuarios(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR
        SELECT u.id,
               u.nombre,
               u.apellido,
               u.email,
               u.telefono,
               CASE u.rol
                   WHEN 1 THEN 'Administrador'
                   WHEN 2 THEN 'Usuario'
                   WHEN 3 THEN 'Invitado'
                   ELSE 'N/D'
               END AS nombre_rol
        FROM Usuarios u
        ORDER BY u.nombre, u.apellido;
  END;

  PROCEDURE sp_create_usuario(
      p_nombre IN VARCHAR2,
      p_apellido IN VARCHAR2,
      p_email IN VARCHAR2,
      p_password IN VARCHAR2,
      p_rol IN VARCHAR2,
      p_telefono IN VARCHAR2,
      p_id OUT NUMBER
  ) IS
  BEGIN
      SELECT seq_usuarios.NEXTVAL INTO p_id FROM dual;
      INSERT INTO Usuarios(id, nombre, apellido, email, password, rol, telefono)
      VALUES(p_id, p_nombre, p_apellido, p_email, p_password, p_rol, p_telefono);
      COMMIT;
  END;

  PROCEDURE sp_get_usuario_by_id(p_id IN NUMBER, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR
        SELECT u.id,
               u.nombre,
               u.apellido,
               u.email,
               u.telefono,
               CASE u.rol
                   WHEN 1 THEN 'Administrador'
                   WHEN 2 THEN 'Usuario'
                   WHEN 3 THEN 'Invitado'
                   ELSE 'N/D'
               END AS nombre_rol
        FROM Usuarios u
        WHERE u.id = p_id;
  END;

  PROCEDURE sp_get_usuario_by_email(p_email IN VARCHAR2, p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
      OPEN p_cursor FOR
        SELECT u.id,
               u.nombre,
               u.apellido,
               u.email,
               u.password,
               u.telefono,
               CASE u.rol
                   WHEN 1 THEN 'Administrador'
                   WHEN 2 THEN 'Usuario'
                   WHEN 3 THEN 'Invitado'
                   ELSE 'N/D'
               END AS nombre_rol
        FROM Usuarios u
        WHERE u.email = p_email;
  END;

  PROCEDURE sp_update_usuario(
      p_id IN NUMBER,
      p_nombre IN VARCHAR2,
      p_apellido IN VARCHAR2,
      p_email IN VARCHAR2,
      p_password IN VARCHAR2,
      p_rol IN VARCHAR2,
      p_telefono IN VARCHAR2
  ) IS
  BEGIN
      UPDATE Usuarios u
      SET u.nombre   = NVL(p_nombre, u.nombre),
          u.apellido = NVL(p_apellido, u.apellido),
          u.email    = NVL(p_email, u.email),
          u.password = NVL(p_password, u.password),
          u.rol      = NVL(p_rol, u.rol),
          u.telefono = NVL(p_telefono, u.telefono)
      WHERE u.id = p_id;
      COMMIT;
  END;

  PROCEDURE sp_delete_usuario(p_id IN NUMBER) IS
  BEGIN
      DELETE FROM Usuarios u WHERE u.id = p_id;
      COMMIT;
  END;

  FUNCTION fn_total_usuarios RETURN NUMBER IS
      v_cnt NUMBER;
  BEGIN
      SELECT COUNT(*) INTO v_cnt FROM Usuarios u;
      RETURN v_cnt;
  END;

  FUNCTION fn_usuario_rol(p_usuario_id NUMBER) RETURN VARCHAR2 IS
      v_rol VARCHAR2(50);
  BEGIN
      SELECT CASE u.rol
                 WHEN 1 THEN 'Administrador'
                 WHEN 2 THEN 'Usuario'
                 WHEN 3 THEN 'Invitado'
                 ELSE 'N/D'
             END
      INTO v_rol
      FROM Usuarios u
      WHERE u.id = p_usuario_id;
      RETURN v_rol;
  EXCEPTION
      WHEN NO_DATA_FOUND THEN
          RETURN 'N/D';
  END;

END pkg_usuario;
/
