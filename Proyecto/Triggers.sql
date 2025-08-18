-- 1. Actualizar fecha de modificación en Mascotas
CREATE OR REPLACE TRIGGER trg_mascotas_update
BEFORE UPDATE ON Mascotas
FOR EACH ROW
BEGIN
  :NEW.FECHA_MODIFICACION := SYSDATE;
END;
/

-- 2. Evitar cambiar estado de Adoptado a Disponible
CREATE OR REPLACE TRIGGER trg_mascota_estado
BEFORE UPDATE OF estado ON Mascotas
FOR EACH ROW
BEGIN
  IF :OLD.ESTADO = 'Adoptado' AND :NEW.ESTADO = 'Disponible' THEN
    RAISE_APPLICATION_ERROR(-20001, 'No se puede cambiar el estado de Adoptado a Disponible');
  END IF;
END;
/

-- 3. Evitar que un voluntario activo sea eliminado
CREATE OR REPLACE TRIGGER trg_no_borrar_voluntarios_activos
BEFORE DELETE ON Voluntarios
FOR EACH ROW
BEGIN
  IF :OLD.ESTADO = 'Activo' THEN
    RAISE_APPLICATION_ERROR(-20002, 'No se puede eliminar un voluntario activo');
  END IF;
END;
/

-- 4. Registrar donaciones en log de campañas
CREATE OR REPLACE TRIGGER trg_log_donaciones_insert
AFTER INSERT ON Donacionescampanias
FOR EACH ROW
BEGIN
  INSERT INTO Reportes(fecha, usuario, detalles, provincia, canton, distrito, mascota)
  VALUES (:NEW.fecha, :NEW.usuario, 'Donación de ' || :NEW.cantidad || ' a campaña ' || :NEW.campania, 'N/A','N/A','N/A', NULL);
END;
/

-- 5. Actualizar estado de campaña cuando se cumpla objetivo
CREATE OR REPLACE TRIGGER trg_actualiza_estado_campania
AFTER INSERT OR UPDATE ON Donacionescampanias
FOR EACH ROW
DECLARE
  v_total NUMBER;
  v_objetivo NUMBER;
BEGIN
  SELECT NVL(SUM(CANTIDAD),0) INTO v_total
  FROM Donacionescampanias
  WHERE CAMPANIA = :NEW.campania;

  SELECT OBJETIVO INTO v_objetivo
  FROM campanias
  WHERE ID = :NEW.campania;

  IF v_total >= v_objetivo THEN
    UPDATE campanias
    SET ESTADO = 'Inactiva'
    WHERE ID = :NEW.campania;
  END IF;
END;
/

-- 6. Evitar que una mascota sea adoptada más de una vez
CREATE OR REPLACE TRIGGER trg_una_adopcion
BEFORE INSERT ON Adopciones
FOR EACH ROW
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM Adopciones
  WHERE MASCOTA = :NEW.mascota;

  IF v_count > 0 THEN
    RAISE_APPLICATION_ERROR(-20003, 'Esta mascota ya ha sido adoptada');
  END IF;
END;
/

-- 7. Marcar historial médico como inactivo cuando la mascota es eliminada
CREATE OR REPLACE TRIGGER trg_inactivar_historial_mascota
AFTER DELETE ON Mascotas
FOR EACH ROW
BEGIN
  UPDATE HistorialMedico
  SET ESTADO = 'Inactivo'
  WHERE MASCOTA = :OLD.id;
END;
/

CREATE OR REPLACE TRIGGER trg_mascotas_update
BEFORE UPDATE ON Mascotas
FOR EACH ROW
BEGIN
  :NEW.FECHA_MODIFICACION := SYSDATE;
END;
/
