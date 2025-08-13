--1. Procedimientos para Mascotas
-- Crear mascota con secuencia
CREATE OR REPLACE PROCEDURE crear_mascota (
    p_nombre      IN VARCHAR2,
    p_raza        IN VARCHAR2,
    p_edad        IN NUMBER,
    p_descripcion IN VARCHAR2,
    p_foto        IN VARCHAR2,
    p_estado      IN VARCHAR2,
    p_usuario     IN NUMBER,
    p_id OUT NUMBER
) AS
BEGIN
    -- Validar estado
    IF p_estado NOT IN ('Disponible', 'Adoptado') THEN
        RAISE_APPLICATION_ERROR(-20001, 'Estado de mascota no válido');
    END IF;
    
    -- Obtener siguiente ID de la secuencia
    SELECT seq_mascotas.NEXTVAL INTO p_id FROM dual;
    
    INSERT INTO Mascotas (id, nombre, raza, edad, descripcion, foto, estado, usuario)
    VALUES (p_id, p_nombre, p_raza, p_edad, p_descripcion, p_foto, p_estado, p_usuario);
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20002, 'Error al crear mascota: ' || SQLERRM);
END;
/

-- Leer mascotas con más detalles
CREATE OR REPLACE PROCEDURE listar_mascotas (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
    SELECT m.id, m.nombre, m.raza, m.edad, m.estado, u.nombre AS due�o
    FROM Mascotas m
    JOIN Usuarios u ON m.usuario = u.id
    ORDER BY m.nombre;
END;
/

-- Leer mascota específica
CREATE OR REPLACE PROCEDURE obtener_mascota (
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM Mascotas WHERE id = p_id;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20003, 'Mascota no encontrada');
    END IF;
END;
/

-- Actualizar mascota con validaciones
CREATE OR REPLACE PROCEDURE actualizar_mascota (
    p_id          IN NUMBER,
    p_nombre      IN VARCHAR2,
    p_raza        IN VARCHAR2,
    p_edad        IN NUMBER,
    p_descripcion IN VARCHAR2,
    p_foto        IN VARCHAR2,
    p_estado      IN VARCHAR2,
    p_usuario     IN NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que la mascota existe
    SELECT COUNT(*) INTO v_count FROM Mascotas WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Mascota no encontrada');
    END IF;
    
    -- Validar estado
    IF p_estado NOT IN ('Disponible', 'Adoptado') THEN
        RAISE_APPLICATION_ERROR(-20001, 'Estado de mascota no v�lido');
    END IF;
    
    UPDATE Mascotas
    SET nombre = p_nombre,
        raza = p_raza,
        edad = p_edad,
        descripcion = p_descripcion,
        foto = p_foto,
        estado = p_estado,
        usuario = p_usuario
    WHERE id = p_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 'No se actualiz� ning�n registro');
    END IF;
END;
/

-- Eliminar mascota con verificación
CREATE OR REPLACE PROCEDURE eliminar_mascota (
    p_id IN NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que la mascota existe
    SELECT COUNT(*) INTO v_count FROM Mascotas WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Mascota no encontrada');
    END IF;
    
    -- Verificar si la mascota está en adopciones
    SELECT COUNT(*) INTO v_count FROM Adopciones WHERE mascota = p_id;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'No se puede eliminar mascota con adopci�n registrada');
    END IF;
    
    -- Eliminar primero el historial médico si existe
    DELETE FROM HistorialMedico WHERE mascota = p_id;
    
    DELETE FROM Mascotas WHERE id = p_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20006, 'No se elimin� ning�n registro');
    END IF;
END;
/

--2. Procedimientos para Campañas
-- Crear campaña con secuencia
CREATE OR REPLACE PROCEDURE crear_campana (
    p_nombre       IN VARCHAR2,
    p_descripcion  IN VARCHAR2,
    p_fechainicio  IN DATE,
    p_fechafin     IN DATE,
    p_objetivo     IN NUMBER,
    p_estado       IN VARCHAR2,
    p_usuario      IN NUMBER,
    p_id OUT NUMBER
) AS
BEGIN
    -- Validar estado
    IF p_estado NOT IN ('Activa', 'Inactiva') THEN
        RAISE_APPLICATION_ERROR(-20011, 'Estado de campa�a no v�lido');
    END IF;
    
    -- Validar fechas
    IF p_fechainicio > p_fechafin THEN
        RAISE_APPLICATION_ERROR(-20012, 'Fecha de inicio no puede ser mayor que fecha de fin');
    END IF;
    
    -- Obtener siguiente ID de la secuencia
    SELECT seq_campa�as.NEXTVAL INTO p_id FROM dual;
    
    INSERT INTO Campa�as (id, nombre, descripcion, fechainicio, fechafin, objetivo, estado, usuario)
    VALUES (p_id, p_nombre, p_descripcion, p_fechainicio, p_fechafin, p_objetivo, p_estado, p_usuario);
END;
/

-- Listar campañas con cursor
CREATE OR REPLACE PROCEDURE listar_campanas (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
    SELECT c.id, c.nombre, c.estado, c.fechainicio, c.fechafin, 
           c.objetivo, u.nombre AS responsable,
           (SELECT NVL(SUM(d.cantidad), 0) FROM DonacionesCampañas d WHERE d.campaña = c.id) AS recaudado
    FROM Campañas c
    JOIN Usuarios u ON c.usuario = u.id
    ORDER BY c.fechainicio DESC;
END;
/

-- Actualizar campaña con validaciones
CREATE OR REPLACE PROCEDURE actualizar_campana (
    p_id           IN NUMBER,
    p_nombre       IN VARCHAR2,
    p_descripcion  IN VARCHAR2,
    p_fechainicio  IN DATE,
    p_fechafin     IN DATE,
    p_objetivo     IN NUMBER,
    p_estado       IN VARCHAR2,
    p_usuario      IN NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que la campaña existe
    SELECT COUNT(*) INTO v_count FROM Campañas WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20013, 'Campaña no encontrada');
    END IF;
    
    -- Validar estado
    IF p_estado NOT IN ('Activa', 'Inactiva') THEN
        RAISE_APPLICATION_ERROR(-20011, 'Estado de campaña no válido');
    END IF;
    
    -- Validar fechas
    IF p_fechainicio > p_fechafin THEN
        RAISE_APPLICATION_ERROR(-20012, 'Fecha de inicio no puede ser mayor que fecha de fin');
    END IF;
    
    UPDATE Campañas
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        fechainicio = p_fechainicio,
        fechafin = p_fechafin,
        objetivo = p_objetivo,
        estado = p_estado,
        usuario = p_usuario
    WHERE id = p_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20014, 'No se actualizó ningún registro');
    END IF;
END;
/

-- Eliminar campaña con verificación
CREATE OR REPLACE PROCEDURE eliminar_campana (
    p_id IN NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que la campaña existe
    SELECT COUNT(*) INTO v_count FROM Campañas WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20013, 'Campaña no encontrada');
    END IF;
    
    -- Verificar si tiene donaciones asociadas
    SELECT COUNT(*) INTO v_count FROM DonacionesCampañas WHERE campaña = p_id;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20015, 'No se puede eliminar campaña con donaciones registradas');
    END IF;
    
    DELETE FROM Campa�as WHERE id = p_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20016, 'No se eliminó ningún registro');
    END IF;
END;
/

--3. Procedimientos para Usuarios
-- Crear usuario con secuencia y validaciones
CREATE OR REPLACE PROCEDURE crear_usuario (
    p_nombre   IN VARCHAR2,
    p_apellido IN VARCHAR2,
    p_email    IN VARCHAR2,
    p_password IN VARCHAR2,
    p_telefono IN VARCHAR2,
    p_rol      IN NUMBER,
    p_id OUT NUMBER
) AS
    v_email_count NUMBER;
BEGIN
    -- Verificar si el email ya existe
    SELECT COUNT(*) INTO v_email_count FROM Usuarios WHERE email = p_email;
    IF v_email_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20021, 'El email ya está registrado');
    END IF;
    
    -- Validar rol
    IF p_rol NOT IN (1, 2, 3) THEN
        RAISE_APPLICATION_ERROR(-20022, 'Rol de usuario no válido');
    END IF;
    
    -- Obtener siguiente ID de la secuencia
    SELECT seq_usuarios.NEXTVAL INTO p_id FROM dual;
    
    INSERT INTO Usuarios (id, nombre, apellido, email, password, telefono, rol)
    VALUES (p_id, p_nombre, p_apellido, p_email, p_password, p_telefono, p_rol);
    
    -- Si es voluntario, crear registro en Voluntarios
    IF p_rol = 3 THEN
        INSERT INTO Voluntarios (id, usuario, fechaInicio, fechaFin, horas, estado)
        VALUES (seq_voluntarios.NEXTVAL, p_id, SYSDATE, NULL, 0, 'Activo');
    END IF;
END;
/

-- Listar usuarios con cursor
CREATE OR REPLACE PROCEDURE listar_usuarios (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
    SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, r.nombre AS rol
    FROM Usuarios u
    JOIN Roles r ON u.rol = r.id
    ORDER BY u.nombre, u.apellido;
END;
/

-- Obtener usuario específico
CREATE OR REPLACE PROCEDURE obtener_usuario (
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
    SELECT u.*, r.nombre AS nombre_rol
    FROM Usuarios u
    JOIN Roles r ON u.rol = r.id
    WHERE u.id = p_id;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20023, 'Usuario no encontrado');
    END IF;
END;
/

-- Actualizar usuario con validaciones
CREATE OR REPLACE PROCEDURE actualizar_usuario (
    p_id       IN NUMBER,
    p_nombre   IN VARCHAR2,
    p_apellido IN VARCHAR2,
    p_email    IN VARCHAR2,
    p_password IN VARCHAR2,
    p_telefono IN VARCHAR2,
    p_rol      IN NUMBER
) AS
    v_count NUMBER;
    v_old_rol NUMBER;
    v_email_count NUMBER;
BEGIN
    -- Verificar que el usuario existe
    SELECT COUNT(*) INTO v_count FROM Usuarios WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20023, 'Usuario no encontrado');
    END IF;
    
    -- Verificar si el email ya existe en otro usuario
    SELECT COUNT(*) INTO v_email_count 
    FROM Usuarios 
    WHERE email = p_email AND id != p_id;
    
    IF v_email_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20021, 'El email ya está registrado por otro usuario');
    END IF;
    
    -- Validar rol
    IF p_rol NOT IN (1, 2, 3) THEN
        RAISE_APPLICATION_ERROR(-20022, 'Rol de usuario no válido');
    END IF;
    
    -- Obtener rol actual para ver si cambia a/de voluntario
    SELECT rol INTO v_old_rol FROM Usuarios WHERE id = p_id;
    
    UPDATE Usuarios
    SET nombre = p_nombre,
        apellido = p_apellido,
        email = p_email,
        password = p_password,
        telefono = p_telefono,
        rol = p_rol
    WHERE id = p_id;
    
    -- Manejar cambio de rol a/de voluntario
    IF v_old_rol != p_rol THEN
        IF v_old_rol = 3 THEN
            -- Eliminar de voluntarios si ya no es voluntario
            DELETE FROM Voluntarios WHERE usuario = p_id;
        ELSIF p_rol = 3 THEN
            -- Agregar a voluntarios si ahora es voluntario
            INSERT INTO Voluntarios (id, usuario, fechaInicio, fechaFin, horas, estado)
            VALUES (seq_voluntarios.NEXTVAL, p_id, SYSDATE, NULL, 0, 'Activo');
        END IF;
    END IF;
END;
/

-- Eliminar usuario con verificación
CREATE OR REPLACE PROCEDURE eliminar_usuario (
    p_id IN NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que el usuario existe
    SELECT COUNT(*) INTO v_count FROM Usuarios WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20023, 'Usuario no encontrado');
    END IF;
    
    -- Verificar si tiene mascotas registradas
    SELECT COUNT(*) INTO v_count FROM Mascotas WHERE usuario = p_id;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20024, 'No se puede eliminar usuario con mascotas registradas');
    END IF;
    
    -- Verificar si tiene campañas creadas
    SELECT COUNT(*) INTO v_count FROM Campañas WHERE usuario = p_id;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20025, 'No se puede eliminar usuario con campañas creadas');
    END IF;
    
    -- Verificar si tiene adopciones
    SELECT COUNT(*) INTO v_count FROM Adopciones WHERE usuario = p_id;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20026, 'No se puede eliminar usuario con adopciones registradas');
    END IF;
    
    -- Eliminar registros relacionados primero
    DELETE FROM Voluntarios WHERE usuario = p_id;
    DELETE FROM EventosAsistencia WHERE usuario = p_id;
    DELETE FROM Reportes WHERE usuario = p_id;
    DELETE FROM DonacionesCampañas WHERE usuario = p_id;
    
    -- Finalmente eliminar el usuario
    DELETE FROM Usuarios WHERE id = p_id;
END;
/

--4. Procedimientos para Eventos
-- Crear evento con secuencia
CREATE OR REPLACE PROCEDURE crear_evento (
    p_nombre       IN VARCHAR2,
    p_descripcion  IN VARCHAR2,
    p_fecha        IN DATE,
    p_ubicacion    IN VARCHAR2,
    p_responsable  IN NUMBER,
    p_tipo         IN VARCHAR2,
    p_estado       IN VARCHAR2,
    p_id OUT NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Validar tipo
    IF p_tipo NOT IN ('Presencial', 'Virtual') THEN
        RAISE_APPLICATION_ERROR(-20031, 'Tipo de evento no válido');
    END IF;
    
    -- Validar estado
    IF p_estado NOT IN ('En curso', 'Planificado', 'Finalizado') THEN
        RAISE_APPLICATION_ERROR(-20032, 'Estado de evento no válido');
    END IF;
    
    -- Verificar que el responsable existe
    SELECT COUNT(*) INTO v_count FROM Usuarios WHERE id = p_responsable;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20033, 'Responsable no encontrado');
    END IF;
    
    -- Obtener siguiente ID de la secuencia
    SELECT seq_eventos.NEXTVAL INTO p_id FROM dual;
    
    INSERT INTO Eventos (id, nombre, descripcion, fecha, ubicacion, responsable, tipo, estado)
    VALUES (p_id, p_nombre, p_descripcion, p_fecha, p_ubicacion, p_responsable, p_tipo, p_estado);
END;
/

-- Listar eventos con cursor
CREATE OR REPLACE PROCEDURE listar_eventos (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
    SELECT e.id, e.nombre, e.fecha, e.ubicacion, e.tipo, e.estado,
           u.nombre || ' ' || u.apellido AS responsable,
           (SELECT COUNT(*) FROM EventosAsistencia ea WHERE ea.evento = e.id) AS asistentes
    FROM Eventos e
    JOIN Usuarios u ON e.responsable = u.id
    ORDER BY e.fecha DESC;
END;
/

-- Obtener evento específico
CREATE OR REPLACE PROCEDURE obtener_evento (
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
    SELECT e.*, u.nombre || ' ' || u.apellido AS nombre_responsable
    FROM Eventos e
    JOIN Usuarios u ON e.responsable = u.id
    WHERE e.id = p_id;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20034, 'Evento no encontrado');
    END IF;
END;
/

-- Actualizar evento con validaciones
CREATE OR REPLACE PROCEDURE actualizar_evento (
    p_id           IN NUMBER,
    p_nombre       IN VARCHAR2,
    p_descripcion  IN VARCHAR2,
    p_fecha        IN DATE,
    p_ubicacion    IN VARCHAR2,
    p_responsable  IN NUMBER,
    p_tipo         IN VARCHAR2,
    p_estado       IN VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que el evento existe
    SELECT COUNT(*) INTO v_count FROM Eventos WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20034, 'Evento no encontrado');
    END IF;
    
    -- Validar tipo
    IF p_tipo NOT IN ('Presencial', 'Virtual') THEN
        RAISE_APPLICATION_ERROR(-20031, 'Tipo de evento no válido');
    END IF;
    
    -- Validar estado
    IF p_estado NOT IN ('En curso', 'Planificado', 'Finalizado') THEN
        RAISE_APPLICATION_ERROR(-20032, 'Estado de evento no válido');
    END IF;
    
    -- Verificar que el responsable existe
    SELECT COUNT(*) INTO v_count FROM Usuarios WHERE id = p_responsable;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20033, 'Responsable no encontrado');
    END IF;
    
    UPDATE Eventos
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        fecha = p_fecha,
        ubicacion = p_ubicacion,
        responsable = p_responsable,
        tipo = p_tipo,
        estado = p_estado
    WHERE id = p_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20035, 'No se actualizó ningún registro');
    END IF;
END;
/

-- Eliminar evento con verificación
CREATE OR REPLACE PROCEDURE eliminar_evento (
    p_id IN NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que el evento existe
    SELECT COUNT(*) INTO v_count FROM Eventos WHERE id = p_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20034, 'Evento no encontrado');
    END IF;
    
    -- Eliminar primero las asistencias
    DELETE FROM EventosAsistencia WHERE evento = p_id;
    
    DELETE FROM Eventos WHERE id = p_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20036, 'No se eliminó ningún registro');
    END IF;
END;
/

-- Registrar asistencia a evento
CREATE OR REPLACE PROCEDURE registrar_asistencia_evento (
    p_evento IN NUMBER,
    p_usuario IN NUMBER,
    p_id OUT NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Verificar que el evento existe
    SELECT COUNT(*) INTO v_count FROM Eventos WHERE id = p_evento;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20034, 'Evento no encontrado');
    END IF;
    
    -- Verificar que el usuario existe
    SELECT COUNT(*) INTO v_count FROM Usuarios WHERE id = p_usuario;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20023, 'Usuario no encontrado');
    END IF;
    
    -- Verificar si ya est� registrado
    SELECT COUNT(*) INTO v_count 
    FROM EventosAsistencia 
    WHERE evento = p_evento AND usuario = p_usuario;
    
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20037, 'El usuario ya está registrado en este evento');
    END IF;
    
    -- Obtener siguiente ID de la secuencia
    SELECT seq_asistencias.NEXTVAL INTO p_id FROM dual;
    
    INSERT INTO EventosAsistencia (id, evento, usuario)
    VALUES (p_id, p_evento, p_usuario);
END;
/

--5. Inventario
--Crear ítem de inventario
CREATE OR REPLACE PROCEDURE crear_inventario_item (
    p_nombre        IN VARCHAR2,
    p_tipo          IN VARCHAR2,
    p_cantidad      IN NUMBER,
    p_fechaIngreso  IN DATE,
    p_fechaCad      IN DATE,
    p_proveedor     IN VARCHAR2,
    p_fuente        IN VARCHAR2,
    p_id            OUT NUMBER
) AS
BEGIN
    IF p_fuente NOT IN ('Compra','Donación') THEN
        RAISE_APPLICATION_ERROR(-21001,'Fuente inválida');
    END IF;
    SELECT seq_inventario.NEXTVAL INTO p_id FROM dual;
    INSERT INTO Inventario(id,nombre,tipo,cantidad,fechaIngreso,fechaCaducidad,proveedor,fuente)
    VALUES (p_id,p_nombre,p_tipo,p_cantidad,p_fechaIngreso,p_fechaCad,p_proveedor,p_fuente);
END;
/

-- Actualizar ítem de inventario
CREATE OR REPLACE PROCEDURE actualizar_inventario_item(
    p_id            IN NUMBER,
    p_nombre        IN VARCHAR2,
    p_tipo          IN VARCHAR2,
    p_cantidad      IN NUMBER,
    p_fechaIngreso  IN DATE,
    p_fechaCad      IN DATE,
    p_proveedor     IN VARCHAR2,
    p_fuente        IN VARCHAR2
) AS
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM Inventario WHERE id = p_id;
    IF v_exists=0 THEN RAISE_APPLICATION_ERROR(-21002,'Ítem no existe'); END IF;
    IF p_fuente NOT IN ('Compra','Donación') THEN
        RAISE_APPLICATION_ERROR(-21001,'Fuente inválida');
    END IF;
    UPDATE Inventario
       SET nombre=p_nombre, tipo=p_tipo, cantidad=p_cantidad,
           fechaIngreso=p_fechaIngreso, fechaCaducidad=p_fechaCad,
           proveedor=p_proveedor, fuente=p_fuente
     WHERE id=p_id;
END;
/

-- Eliminar ítem de inventario
CREATE OR REPLACE PROCEDURE eliminar_inventario_item(p_id IN NUMBER) AS
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM Inventario WHERE id = p_id;
    IF v_exists=0 THEN RAISE_APPLICATION_ERROR(-21002,'Ítem no existe'); END IF;
    DELETE FROM Inventario WHERE id=p_id;
END;
/

--6. Voluntario
-- Asignar actividad a voluntario
CREATE OR REPLACE PROCEDURE asignar_actividad_voluntario(
    p_voluntario_id IN NUMBER,
    p_actividad     IN VARCHAR2
) AS
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM Voluntarios WHERE id = p_voluntario_id;
    IF v_exists=0 THEN RAISE_APPLICATION_ERROR(-21010,'Voluntario no existe'); END IF;

    INSERT INTO VoluntariosActividades(voluntario_id,actividad)
    VALUES(p_voluntario_id, p_actividad);
END;
/

-- Quitar actividad a voluntario
CREATE OR REPLACE PROCEDURE quitar_actividad_voluntario(
    p_voluntario_id IN NUMBER,
    p_actividad     IN VARCHAR2
) AS
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists
      FROM VoluntariosActividades
     WHERE voluntario_id=p_voluntario_id AND actividad=p_actividad;
    IF v_exists=0 THEN RAISE_APPLICATION_ERROR(-21011,'Actividad no asignada'); END IF;

    DELETE FROM VoluntariosActividades
     WHERE voluntario_id=p_voluntario_id AND actividad=p_actividad;
END;
/