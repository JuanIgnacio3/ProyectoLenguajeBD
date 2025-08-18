--MASCOTAS
-- Procedimientos almacenados para la gestión de mascotas

CREATE OR REPLACE PROCEDURE sp_get_all_mascotas (p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT id, nombre, raza, edad, descripcion, foto, estado, usuario
    FROM Mascotas;
END;
/


CREATE OR REPLACE PROCEDURE sp_create_mascota (
    p_nombre IN VARCHAR2,
    p_raza IN VARCHAR2,
    p_edad IN NUMBER,
    p_descripcion IN VARCHAR2,
    p_foto IN VARCHAR2,
    p_estado IN VARCHAR2,
    p_usuario IN NUMBER,
    p_id OUT NUMBER
) IS
BEGIN
    SELECT seq_mascotas.NEXTVAL INTO p_id FROM dual;

    INSERT INTO Mascotas(id, nombre, raza, edad, descripcion, foto, estado, usuario)
    VALUES(p_id, p_nombre, p_raza, p_edad, p_descripcion, p_foto, p_estado, p_usuario);
    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE sp_get_mascota_by_id(
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
    SELECT m.*, u.nombre AS dueno
    FROM Mascotas m
    LEFT JOIN Usuarios u ON m.usuario = u.id
    WHERE m.id = p_id;
END;
/

CREATE OR REPLACE PROCEDURE sp_update_mascota(
    p_id IN NUMBER,
    p_nombre IN VARCHAR2,
    p_raza IN VARCHAR2,
    p_edad IN NUMBER,
    p_descripcion IN VARCHAR2,
    p_foto IN VARCHAR2,
    p_estado IN VARCHAR2,
    p_usuario IN NUMBER
) IS
BEGIN
    UPDATE Mascotas
    SET nombre = p_nombre,
        raza = p_raza,
        edad = p_edad,
        descripcion = p_descripcion,
        foto = p_foto,
        estado = p_estado,
        usuario = p_usuario
    WHERE id = p_id;
    COMMIT;
END;
/


CREATE OR REPLACE PROCEDURE sp_delete_mascota(p_id IN NUMBER) IS
BEGIN
    DELETE FROM Mascotas WHERE id = p_id;
    COMMIT;
END;
/

-- SP para mascotas disponibles
CREATE OR REPLACE PROCEDURE sp_get_mascotas_disponibles (p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM vista_mascotas_disponibles;
END;
/

-- SP para mascotas adoptadas
CREATE OR REPLACE PROCEDURE sp_get_mascotas_adoptadas (p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM vista_mascotas_adoptadas;
END;
/

--EVENTOS
-- Procedimientos almacenados para la gestión de eventos

-- EVENTOS
-- Procedimientos almacenados para la gestión de eventos

-- Obtener todos los eventos
CREATE OR REPLACE PROCEDURE sp_get_all_eventos (p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT id, nombre, descripcion, fecha, ubicacion, responsable, tipo, estado
    FROM Eventos
    ORDER BY fecha DESC;
END;
/

-- Obtener eventos virtuales
CREATE OR REPLACE PROCEDURE sp_get_eventos_virtuales (p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM vista_eventos_virtuales
    ORDER BY fecha DESC;
END;
/

-- Obtener eventos presenciales
CREATE OR REPLACE PROCEDURE sp_get_eventos_presenciales (p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM vista_eventos_presenciales
    ORDER BY fecha DESC;
END;
/

-- Crear un evento
CREATE OR REPLACE PROCEDURE sp_create_evento (
    p_nombre IN VARCHAR2,
    p_descripcion IN VARCHAR2,
    p_fecha IN DATE,
    p_ubicacion IN VARCHAR2,
    p_responsable IN NUMBER,
    p_tipo IN VARCHAR2,
    p_estado IN VARCHAR2,
    p_id OUT NUMBER
) IS
BEGIN
    SELECT seq_eventos.NEXTVAL INTO p_id FROM dual;

    INSERT INTO Eventos(id, nombre, descripcion, fecha, ubicacion, responsable, tipo, estado)
    VALUES(p_id, p_nombre, p_descripcion, p_fecha, p_ubicacion, p_responsable, p_tipo, p_estado);
    COMMIT;
END;
/

-- Obtener un evento por ID
CREATE OR REPLACE PROCEDURE sp_get_evento_by_id (
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
    SELECT e.*, u.nombre AS responsable_nombre
    FROM Eventos e
    LEFT JOIN Usuarios u ON e.responsable = u.id
    WHERE e.id = p_id;
END;
/

-- Actualizar un evento
CREATE OR REPLACE PROCEDURE sp_update_evento (
    p_id IN NUMBER,
    p_nombre IN VARCHAR2,
    p_descripcion IN VARCHAR2,
    p_fecha IN DATE,
    p_ubicacion IN VARCHAR2,
    p_responsable IN NUMBER,
    p_tipo IN VARCHAR2,
    p_estado IN VARCHAR2
) IS
BEGIN
    UPDATE Eventos
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        fecha = p_fecha,
        ubicacion = p_ubicacion,
        responsable = p_responsable,
        tipo = p_tipo,
        estado = p_estado
    WHERE id = p_id;
    COMMIT;
END;
/

-- Eliminar un evento
CREATE OR REPLACE PROCEDURE sp_delete_evento (p_id IN NUMBER) IS
BEGIN
    DELETE FROM Eventos WHERE id = p_id;
    COMMIT;
END;
/

--CAMPANIAS
-- Procedimientos almacenados para la gestión de campañas

-- Obtener todas las campañas
CREATE OR REPLACE PROCEDURE sp_get_all_campanias(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT id, nombre, descripcion, FECHAINICIO, FECHAFIN, objetivo, estado, usuario
    FROM Campanias
    ORDER BY FECHAINICIO DESC;
END;
/

-- Obtener campañas activas
-- Obtener campañas activas
CREATE OR REPLACE PROCEDURE sp_get_campanias_activas(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM vista_campanias_activas
    ORDER BY "Fecha Inicio" DESC;
END;
/
  
-- Obtener campañas inactivas
CREATE OR REPLACE PROCEDURE sp_get_campanias_inactivas(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM vista_campanias_inactivas
    ORDER BY "Fecha Inicio" DESC;
END;
/

-- Obtener campaña por ID
CREATE OR REPLACE PROCEDURE sp_get_campania_by_id(
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
    SELECT c.*, u.nombre AS usuario_nombre
    FROM Campanias c
    LEFT JOIN Usuarios u ON c.usuario = u.id
    WHERE c.id = p_id;
END;
/

-- Crear una campaña
CREATE OR REPLACE PROCEDURE sp_create_campania(
    p_nombre IN VARCHAR2,
    p_descripcion IN VARCHAR2,
    p_FECHAINICIO IN DATE,
    p_FECHAFIN IN DATE,
    p_objetivo IN NUMBER,
    p_estado IN VARCHAR2,
    p_usuario IN NUMBER,
    p_id OUT NUMBER
) IS
BEGIN
    SELECT seq_campanias.NEXTVAL INTO p_id FROM dual;

    INSERT INTO Campanias(id, nombre, descripcion, FECHAINICIO, FECHAFIN, objetivo, estado, usuario)
    VALUES(p_id, p_nombre, p_descripcion, p_FECHAINICIO, p_FECHAFIN, p_objetivo, p_estado, p_usuario);

    COMMIT;
END;
/

-- Actualizar campaña
CREATE OR REPLACE PROCEDURE sp_update_campania(
    p_id IN NUMBER,
    p_nombre IN VARCHAR2,
    p_descripcion IN VARCHAR2,
    p_FECHAINICIO IN DATE,
    p_FECHAFIN IN DATE,
    p_objetivo IN NUMBER,
    p_estado IN VARCHAR2,
    p_usuario IN NUMBER
) IS
BEGIN
    UPDATE Campanias
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        FECHAINICIO = p_FECHAINICIO,
        FECHAFIN = p_FECHAFIN,
        objetivo = p_objetivo,
        estado = p_estado,
        usuario = p_usuario
    WHERE id = p_id;

    COMMIT;
END;
/

-- Eliminar campaña
CREATE OR REPLACE PROCEDURE sp_delete_campania(p_id IN NUMBER) IS
BEGIN
    DELETE FROM Campanias WHERE id = p_id;
    COMMIT;
END;
/

--invenmtario
-- Procedimientos almacenados para la gestión de inventario

-- INVENTARIO
-- Procedimientos almacenados para la gestión de inventario

-- Obtener todos los registros de inventario
CREATE OR REPLACE PROCEDURE sp_get_all_inventario(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT id, nombre, tipo, cantidad, fechaingreso, fechacaducidad, proveedor, fuente
    FROM Inventario
    ORDER BY fechaingreso DESC;
END;
/
  
-- Obtener inventario por tipo "Compra"
CREATE OR REPLACE PROCEDURE sp_get_inventario_compra(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM vista_inventarios_compra
    ORDER BY "Fecha de Ingreso" DESC;
END;
/

-- Obtener inventario por tipo "Donación"
CREATE OR REPLACE PROCEDURE sp_get_inventario_donacion(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM vista_inventarios_donacion
    ORDER BY "Fecha de Ingreso" DESC;
END;
/

-- Obtener inventario caducado
CREATE OR REPLACE PROCEDURE sp_get_inventario_caducado(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM vista_inventarios_caducidad
    ORDER BY "Fecha de Caducidad" ASC;
END;
/

-- Obtener inventario por ID
CREATE OR REPLACE PROCEDURE sp_get_inventario_by_id(
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM Inventario
    WHERE id = p_id;
END;
/

-- Buscar inventario por nombre
CREATE OR REPLACE PROCEDURE sp_search_inventario_by_nombre(
    p_nombre IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM Inventario
    WHERE LOWER(nombre) LIKE '%' || LOWER(p_nombre) || '%';
END;
/

-- Crear un registro de inventario
CREATE OR REPLACE PROCEDURE sp_create_inventario(
    p_nombre IN VARCHAR2,
    p_tipo IN VARCHAR2,
    p_cantidad IN NUMBER,
    p_fechaingreso IN DATE,
    p_fechacaducidad IN DATE,
    p_proveedor IN VARCHAR2,
    p_fuente IN VARCHAR2,
    p_id OUT NUMBER
) IS
BEGIN
    SELECT seq_inventario.NEXTVAL INTO p_id FROM dual;

    INSERT INTO Inventario(id, nombre, tipo, cantidad, fechaingreso, fechacaducidad, proveedor, fuente)
    VALUES(p_id, p_nombre, p_tipo, p_cantidad, p_fechaingreso, p_fechacaducidad, p_proveedor, p_fuente);

    COMMIT;
END;
/

-- Actualizar un registro de inventario
CREATE OR REPLACE PROCEDURE sp_update_inventario(
    p_id IN NUMBER,
    p_nombre IN VARCHAR2,
    p_tipo IN VARCHAR2,
    p_cantidad IN NUMBER,
    p_fechaingreso IN DATE,
    p_fechacaducidad IN DATE,
    p_proveedor IN VARCHAR2,
    p_fuente IN VARCHAR2
) IS
BEGIN
    UPDATE Inventario
    SET nombre = p_nombre,
        tipo = p_tipo,
        cantidad = p_cantidad,
        fechaingreso = p_fechaingreso,
        fechacaducidad = p_fechacaducidad,
        proveedor = p_proveedor,
        fuente = p_fuente
    WHERE id = p_id;

    COMMIT;
END;
/

-- Eliminar un registro de inventario
CREATE OR REPLACE PROCEDURE sp_delete_inventario(p_id IN NUMBER) IS
BEGIN
    DELETE FROM Inventario WHERE id = p_id;
    COMMIT;
END;
/

--VOLUNTARIOS
-- Procedimientos almacenados para la gestión de voluntarios

-- VOLUNTARIOS
-- Procedimientos almacenados para la gestión de voluntarios

-- Obtener todos los voluntarios
CREATE OR REPLACE PROCEDURE sp_get_all_voluntarios(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_cursor FOR
    SELECT id, usuario, fechainicio, fechafin, horas, estado
    FROM Voluntarios
    ORDER BY fechainicio DESC;
END;
/
  
-- Obtener voluntario por ID
CREATE OR REPLACE PROCEDURE sp_get_voluntario_by_id(
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM Voluntarios
    WHERE id = p_id;
END;
/

-- Buscar voluntario por ID de usuario
CREATE OR REPLACE PROCEDURE sp_search_voluntario_by_usuario(
    p_usuario IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
    SELECT *
    FROM Voluntarios
    WHERE usuario = p_usuario;
END;
/

-- Crear un voluntario
CREATE OR REPLACE PROCEDURE sp_create_voluntario(
    p_usuario IN NUMBER,
    p_fechainicio IN DATE,
    p_fechafin IN DATE,
    p_horas IN NUMBER,
    p_estado IN VARCHAR2,
    p_id OUT NUMBER
) IS
BEGIN
    SELECT seq_voluntarios.NEXTVAL INTO p_id FROM dual;

    INSERT INTO Voluntarios(id, usuario, fechainicio, fechafin, horas, estado)
    VALUES(p_id, p_usuario, p_fechainicio, p_fechafin, p_horas, p_estado);

    COMMIT;
END;
/

-- Actualizar un voluntario
CREATE OR REPLACE PROCEDURE sp_update_voluntario(
    p_id IN NUMBER,
    p_usuario IN NUMBER,
    p_fechainicio IN DATE,
    p_fechafin IN DATE,
    p_horas IN NUMBER,
    p_estado IN VARCHAR2
) IS
BEGIN
    UPDATE Voluntarios
    SET usuario = p_usuario,
        fechainicio = p_fechainicio,
        fechafin = p_fechafin,
        horas = p_horas,
        estado = p_estado
    WHERE id = p_id;

    COMMIT;
END;
/

-- Eliminar un voluntario
CREATE OR REPLACE PROCEDURE sp_delete_voluntario(p_id IN NUMBER) IS
BEGIN
    DELETE FROM Voluntarios WHERE id = p_id;
    COMMIT;
END;
/



