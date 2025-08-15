--Trigger 1: Actualizar fecha de modificación en tabla Mascotas al actualizar

CREATE OR REPLACE TRIGGER trg_mascotas_update
BEFORE UPDATE ON Mascotas
FOR EACH ROW
BEGIN
  :NEW.fecha_modificacion := SYSDATE;
END;
/

--Trigger 2: Evitar cambiar el estado de una mascota adoptada a disponible

CREATE OR REPLACE TRIGGER trg_mascota_estado
BEFORE UPDATE OF estado ON Mascotas
FOR EACH ROW
BEGIN
  IF :OLD.estado = 'Adoptada' AND :NEW.estado = 'Disponible' THEN
    RAISE_APPLICATION_ERROR(-20001, 'No se puede cambiar estado de Adoptada a Disponible');
  END IF;
END;
/

--Trigger 3: Registrar inserciones en tabla Donacionescampanias en tabla LogDonaciones
CREATE OR REPLACE TRIGGER trg_log_donaciones_insert
AFTER INSERT ON Donacionescampanias
FOR EACH ROW
BEGIN
  INSERT INTO LogDonaciones (donacion_id, campania_id, cantidad, fecha)
  VALUES (:NEW.id, :NEW.campania, :NEW.cantidad, SYSDATE);
END;
/

--Trigger 4: Actualizar estado de campania a 'Completada' cuando se alcance el objetivo
CREATE OR REPLACE TRIGGER trg_actualiza_estado_campania
AFTER INSERT OR UPDATE ON Donacionescampanias
FOR EACH ROW
DECLARE
  v_total NUMBER;
  v_objetivo NUMBER;
BEGIN
  SELECT SUM(cantidad) INTO v_total FROM Donacionescampanias WHERE campania = :NEW.campania;
  SELECT objetivo INTO v_objetivo FROM campanias WHERE id = :NEW.campania;

  IF v_total >= v_objetivo THEN
    UPDATE campanias SET estado = 'Completada' WHERE id = :NEW.campania;
  END IF;
END;
/

--Trigger 5: No permitir borrar voluntarios activos
CREATE OR REPLACE TRIGGER trg_no_borrar_voluntarios_activos
BEFORE DELETE ON Voluntarios
FOR EACH ROW
BEGIN
  IF :OLD.estado = 'Activo' THEN
    RAISE_APPLICATION_ERROR(-20002, 'No se puede eliminar un voluntario activo');
  END IF;
END;
/
--Trigger 6: Asignar perfil a usuarios nuevos segun el rol
CREATE OR REPLACE TRIGGER trg_asignar_perfil
AFTER INSERT ON Usuarios
FOR EACH ROW
DECLARE
    v_perfil VARCHAR2(30);
BEGIN
    IF :NEW.rol = 1 THEN
        v_perfil := 'perfil_admin_Proyecto';
    ELSIF :NEW.rol = 2 THEN
        v_perfil := 'perfil_usuario_Proyecto';
    ELSIF :NEW.rol = 3 THEN
        v_perfil := 'perfil_voluntario_Proyecto';
    ELSE
        v_perfil := NULL; 
    END IF;

    IF v_perfil IS NOT NULL THEN
        EXECUTE IMMEDIATE 'ALTER USER ' || :NEW.nombre || ' PROFILE ' || v_perfil;
    END IF;
END;
/

--Trigger 7: Crear usuario
CREATE OR REPLACE TRIGGER trg_crear_usuario_oracle
AFTER INSERT ON Usuarios
FOR EACH ROW
DECLARE
    v_profile VARCHAR2(50);
    v_sql     VARCHAR2(1000);
BEGIN
    -- Asignar perfil según el rol
    IF :NEW.rol = 1 THEN
        v_profile := 'perfil_admin_Proyecto';
    ELSIF :NEW.rol = 2 THEN
        v_profile := 'perfil_usuario_Proyecto';
    ELSIF :NEW.rol = 3 THEN
        v_profile := 'perfil_voluntario_Proyecto';
    ELSE
        v_profile := 'perfil_usuario_Proyecto'; -- Default
    END IF;

    v_sql := 'CREATE USER ' || :NEW.nombre || ' IDENTIFIED BY "TempPass123"';
    EXECUTE IMMEDIATE v_sql;

    v_sql := 'GRANT CONNECT TO ' || :NEW.nombre;
    EXECUTE IMMEDIATE v_sql;

    v_sql := 'ALTER USER ' || :NEW.nombre || ' PROFILE ' || v_profile;
    EXECUTE IMMEDIATE v_sql;
END;
/
