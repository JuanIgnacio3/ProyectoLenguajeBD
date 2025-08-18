-- =============================
-- 1️⃣ FUNCIONES MASCOTA
-- =============================

-- Categoriza edad de mascota
CREATE OR REPLACE FUNCTION fn_categoria_edad(p_edad NUMBER)
RETURN VARCHAR2 IS
BEGIN
  IF p_edad IS NULL THEN RETURN 'N/D';
  ELSIF p_edad < 1 THEN RETURN 'Cachorro';
  ELSIF p_edad <= 7 THEN RETURN 'Adulto';
  ELSE RETURN 'Senior';
  END IF;
END;
/

-- Estado textual de mascota
CREATE OR REPLACE FUNCTION fn_mascota_estado_texto(p_mascota_id NUMBER)
RETURN VARCHAR2 IS v_est VARCHAR2(20);
BEGIN
  SELECT estado INTO v_est FROM Mascotas WHERE id=p_mascota_id;
  RETURN v_est;
EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 'N/D';
END;
/

-- ¿Mascota tiene historial? (1/0)
CREATE OR REPLACE FUNCTION fn_mascota_tiene_historial(p_mascota_id NUMBER)
RETURN NUMBER IS v NUMBER;
BEGIN
  SELECT COUNT(*) INTO v FROM HistorialMedico WHERE mascota=p_mascota_id;
  RETURN CASE WHEN v>0 THEN 1 ELSE 0 END;
END;
/

-- Total de mascotas de un usuario
CREATE OR REPLACE FUNCTION fn_total_mascotas_usuario(p_usuario_id NUMBER)
RETURN NUMBER IS v_cnt NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_cnt FROM Mascotas WHERE usuario=p_usuario_id;
  RETURN v_cnt;
END;
/

-- =============================
-- 2️⃣ FUNCIONES VOLUNTARIO
-- =============================

-- Horas acumuladas de voluntario
CREATE OR REPLACE FUNCTION fn_voluntario_horas(p_voluntario_id NUMBER)
RETURN NUMBER IS v NUMBER;
BEGIN
  SELECT horas INTO v FROM Voluntarios WHERE id=p_voluntario_id;
  RETURN NVL(v,0);
EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
END;
/

-- ¿Usuario es voluntario? (1/0)
CREATE OR REPLACE FUNCTION fn_es_voluntario(p_usuario_id NUMBER)
RETURN NUMBER IS v NUMBER;
BEGIN
  SELECT COUNT(*) INTO v FROM Voluntarios WHERE usuario=p_usuario_id AND estado='Activo';
  RETURN CASE WHEN v>0 THEN 1 ELSE 0 END;
END;
/

-- =============================
-- 3️⃣ FUNCIONES CAMPAÑA
-- =============================

-- Total recaudado de una campaña
CREATE OR REPLACE FUNCTION fn_campania_recaudado(p_campania_id NUMBER)
RETURN NUMBER IS v_total NUMBER;
BEGIN
  SELECT NVL(SUM(cantidad),0) INTO v_total
    FROM Donacionescampanias
   WHERE campania = p_campania_id;
  RETURN v_total;
END;
/

-- % de avance de campaña
CREATE OR REPLACE FUNCTION fn_campania_porcentaje(p_campania_id NUMBER)
RETURN NUMBER IS v_obj NUMBER; v_tot NUMBER;
BEGIN
  SELECT objetivo INTO v_obj FROM campanias WHERE id=p_campania_id;
  v_tot := fn_campania_recaudado(p_campania_id);
  IF v_obj=0 THEN RETURN 0; END IF;
  RETURN ROUND( (v_tot / v_obj) * 100, 2 );
EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
END;
/

-- Días restantes de campaña
CREATE OR REPLACE FUNCTION fn_dias_restantes_campania(p_campania_id NUMBER)
RETURN NUMBER IS v_fin DATE;
BEGIN
  SELECT fechaFin INTO v_fin FROM campanias WHERE id=p_campania_id;
  RETURN GREATEST(TRUNC(v_fin)-TRUNC(SYSDATE),0);
EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
END;
/

-- =============================
-- 4️⃣ FUNCIONES USUARIO
-- =============================

-- Nombre completo de usuario
CREATE OR REPLACE FUNCTION fn_usuario_nombre_completo(p_usuario_id NUMBER)
RETURN VARCHAR2 IS v_nom VARCHAR2(200);
BEGIN
  SELECT nombre||' '||apellido INTO v_nom FROM Usuarios WHERE id=p_usuario_id;
  RETURN v_nom;
EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 'N/D';
END;
/

-- Email válido (1/0)
CREATE OR REPLACE FUNCTION fn_email_valido(p_email VARCHAR2)
RETURN NUMBER IS
BEGIN
  IF REGEXP_LIKE(p_email,'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') THEN
     RETURN 1;
  ELSE
     RETURN 0;
  END IF;
END;
/

-- Normalizar teléfono (solo dígitos)
CREATE OR REPLACE FUNCTION fn_normalizar_telefono(p_tel VARCHAR2)
RETURN VARCHAR2 IS
BEGIN
  RETURN REGEXP_REPLACE(NVL(p_tel,''),'[^0-9]','');
END;
/

-- =============================
-- 5️⃣ FUNCIONES EVENTO
-- =============================

-- Estado textual de evento (según fecha)
CREATE OR REPLACE FUNCTION fn_evento_estado_texto(p_evento_id NUMBER)
RETURN VARCHAR2 IS v_fecha DATE;
BEGIN
  SELECT fecha INTO v_fecha FROM Eventos WHERE id=p_evento_id;
  IF v_fecha > SYSDATE THEN RETURN 'Por realizarse';
  ELSIF TRUNC(v_fecha) = TRUNC(SYSDATE) THEN RETURN 'Hoy';
  ELSE RETURN 'Realizado';
  END IF;
EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 'N/D';
END;
/

-- Cantidad de asistentes a un evento
CREATE OR REPLACE FUNCTION fn_evento_asistentes(p_evento_id NUMBER)
RETURN NUMBER IS v NUMBER;
BEGIN
  SELECT COUNT(*) INTO v FROM EventosAsistencia WHERE evento=p_evento_id;
  RETURN v;
END;
/

-- =============================
-- 6️⃣ FUNCIONES INVENTARIO
-- =============================

-- ¿Inventario vencido? (1 sí / 0 no)
CREATE OR REPLACE FUNCTION fn_inventario_vencido(p_item_id NUMBER)
RETURN NUMBER IS v_cad DATE;
BEGIN
  SELECT fechaCaducidad INTO v_cad FROM Inventario WHERE id=p_item_id;
  IF v_cad IS NULL THEN RETURN 0; END IF;
  RETURN CASE WHEN TRUNC(v_cad) < TRUNC(SYSDATE) THEN 1 ELSE 0 END;
EXCEPTION WHEN NO_DATA_FOUND THEN RETURN 0;
END;
/
