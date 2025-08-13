-- 1) Normaliza email a minúsculas y trim
CREATE OR REPLACE TRIGGER trg_usuarios_email_norm
BEFORE INSERT OR UPDATE OF email ON Usuarios
FOR EACH ROW
BEGIN
  :NEW.email := LOWER(TRIM(:NEW.email));
END;
/

-- 2) Al adoptar, marca mascota como 'Adoptado'
CREATE OR REPLACE TRIGGER trg_adopciones_mascota_estado
AFTER INSERT ON Adopciones
FOR EACH ROW
BEGIN
  UPDATE Mascotas SET estado='Adoptado' WHERE id=:NEW.mascota;
END;
/

-- 3) Evita adoptar mascota no disponible
CREATE OR REPLACE TRIGGER trg_adopciones_valida_disponible
BEFORE INSERT ON Adopciones
FOR EACH ROW
DECLARE v_estado VARCHAR2(20);
BEGIN
  SELECT estado INTO v_estado FROM Mascotas WHERE id=:NEW.mascota;
  IF v_estado <> 'Disponible' THEN
     RAISE_APPLICATION_ERROR(-22001,'La mascota no está disponible para adopción');
  END IF;
END;
/

-- 4) Normaliza fuente de inventario (primera mayúscula)
CREATE OR REPLACE TRIGGER trg_inventario_fuente_norm
BEFORE INSERT OR UPDATE OF fuente ON Inventario
FOR EACH ROW
BEGIN
  IF UPPER(:NEW.fuente) IN ('COMPRA','DONACIÓN','DONACION') THEN
     :NEW.fuente := CASE WHEN UPPER(:NEW.fuente)='COMPRA' THEN 'Compra' ELSE 'Donación' END;
  ELSE
     RAISE_APPLICATION_ERROR(-22002,'Fuente inválida');
  END IF;
END;
/

-- 5) Estado de evento por defecto según fecha si viene nulo
CREATE OR REPLACE TRIGGER trg_eventos_estado_default
BEFORE INSERT ON Eventos
FOR EACH ROW
BEGIN
  IF :NEW.estado IS NULL THEN
     IF :NEW.fecha > SYSDATE THEN :NEW.estado:='Planificado';
     ELSIF TRUNC(:NEW.fecha)=TRUNC(SYSDATE) THEN :NEW.estado:='En curso';
     ELSE :NEW.estado:='Finalizado';
     END IF;
  END IF;
END;
/