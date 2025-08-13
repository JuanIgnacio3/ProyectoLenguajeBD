-- 1) pkg_mascotas
CREATE OR REPLACE PACKAGE pkg_mascotas AS
  FUNCTION contar_disponibles RETURN NUMBER;
END pkg_mascotas;
/
CREATE OR REPLACE PACKAGE BODY pkg_mascotas AS
  FUNCTION contar_disponibles RETURN NUMBER IS v NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v FROM Mascotas WHERE estado='Disponible';
    RETURN v;
  END;
END pkg_mascotas;
/

-- 2) pkg_usuarios
CREATE OR REPLACE PACKAGE pkg_usuarios AS
  FUNCTION total_usuarios RETURN NUMBER;
END pkg_usuarios;
/
CREATE OR REPLACE PACKAGE BODY pkg_usuarios AS
  FUNCTION total_usuarios RETURN NUMBER IS v NUMBER;
  BEGIN SELECT COUNT(*) INTO v FROM Usuarios; RETURN v; END;
END pkg_usuarios;
/

-- 3) pkg_eventos
CREATE OR REPLACE PACKAGE pkg_eventos AS
  FUNCTION asistentes(p_evento NUMBER) RETURN NUMBER;
END pkg_eventos;
/
CREATE OR REPLACE PACKAGE BODY pkg_eventos AS
  FUNCTION asistentes(p_evento NUMBER) RETURN NUMBER IS
  BEGIN RETURN fn_evento_asistentes(p_evento); END;
END pkg_eventos;
/

-- 4) pkg_campanas
CREATE OR REPLACE PACKAGE pkg_campanas AS
  FUNCTION recaudado(p_id NUMBER) RETURN NUMBER;
END pkg_campanas;
/
CREATE OR REPLACE PACKAGE BODY pkg_campanas AS
  FUNCTION recaudado(p_id NUMBER) RETURN NUMBER IS
  BEGIN RETURN fn_campana_recaudado(p_id); END;
END pkg_campanas;
/

-- 5) pkg_inventario
CREATE OR REPLACE PACKAGE pkg_inventario AS
  FUNCTION por_vencer_en(p_dias NUMBER) RETURN NUMBER;
END pkg_inventario;
/
CREATE OR REPLACE PACKAGE BODY pkg_inventario AS
  FUNCTION por_vencer_en(p_dias NUMBER) RETURN NUMBER IS v NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v
      FROM Inventario
     WHERE fechaCaducidad IS NOT NULL
       AND fechaCaducidad <= TRUNC(SYSDATE)+p_dias;
    RETURN v;
  END;
END pkg_inventario;
/

-- 6) pkg_reportes
CREATE OR REPLACE PACKAGE pkg_reportes AS
  FUNCTION por_provincia(p_prov VARCHAR2) RETURN NUMBER;
END pkg_reportes;
/
CREATE OR REPLACE PACKAGE BODY pkg_reportes AS
  FUNCTION por_provincia(p_prov VARCHAR2) RETURN NUMBER IS v NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v FROM Reportes WHERE UPPER(provincia)=UPPER(p_prov);
    RETURN v;
  END;
END pkg_reportes;
/

-- 7) pkg_adopciones
CREATE OR REPLACE PACKAGE pkg_adopciones AS
  FUNCTION total_usuario(p_usuario NUMBER) RETURN NUMBER;
END pkg_adopciones;
/
CREATE OR REPLACE PACKAGE BODY pkg_adopciones AS
  FUNCTION total_usuario(p_usuario NUMBER) RETURN NUMBER IS v NUMBER;
  BEGIN SELECT COUNT(*) INTO v FROM Adopciones WHERE usuario=p_usuario; RETURN v; END;
END pkg_adopciones;
/

-- 8) pkg_voluntarios
CREATE OR REPLACE PACKAGE pkg_voluntarios AS
  FUNCTION horas(p_voluntario NUMBER) RETURN NUMBER;
END pkg_voluntarios;
/
CREATE OR REPLACE PACKAGE BODY pkg_voluntarios AS
  FUNCTION horas(p_voluntario NUMBER) RETURN NUMBER IS
  BEGIN RETURN fn_voluntario_horas(p_voluntario); END;
END pkg_voluntarios;
/

-- 9) pkg_donaciones
CREATE OR REPLACE PACKAGE pkg_donaciones AS
  FUNCTION total_usuario(p_usuario NUMBER) RETURN NUMBER;
END pkg_donaciones;
/
CREATE OR REPLACE PACKAGE BODY pkg_donaciones AS
  FUNCTION total_usuario(p_usuario NUMBER) RETURN NUMBER IS v NUMBER;
  BEGIN
    SELECT NVL(SUM(cantidad),0) INTO v FROM DonacionesCampanas WHERE usuario=p_usuario;
    RETURN v;
  END;
END pkg_donaciones;
/

-- 10) pkg_seguridad
CREATE OR REPLACE PACKAGE pkg_seguridad AS
  FUNCTION rol_usuario(p_usuario NUMBER) RETURN VARCHAR2;
END pkg_seguridad;
/
CREATE OR REPLACE PACKAGE BODY pkg_seguridad AS
  FUNCTION rol_usuario(p_usuario NUMBER) RETURN VARCHAR2 IS v VARCHAR2(50);
  BEGIN
    SELECT r.nombre INTO v
      FROM Usuarios u JOIN Roles r ON r.id=u.rol
     WHERE u.id=p_usuario;
    RETURN v;
  EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 'N/D';
  END;
END pkg_seguridad;
/