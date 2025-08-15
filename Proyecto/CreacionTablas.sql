-- Tablas principales

--1. Tabla Roles
CREATE TABLE Roles (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL CHECK (nombre IN ('Administrador', 'Usuario', 'Voluntario'))
);

--2. Tabla Usuarios
CREATE TABLE Usuarios (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL CHECK (REGEXP_LIKE(nombre, '^[A-Z�����][a-z�����\s''-]+$')),
    apellido VARCHAR2(100) NOT NULL CHECK (REGEXP_LIKE(apellido, '^[A-Z�����][a-z�����\s''-]+$')),
    email VARCHAR2(100) NOT NULL CHECK (REGEXP_LIKE(email, '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')),
    password VARCHAR2(100) NOT NULL CHECK (LENGTH(password) >= 8),
    telefono VARCHAR2(10) NOT NULL CHECK (REGEXP_LIKE(telefono, '^[0-9]{8,10}$')),
    rol NUMBER NOT NULL CHECK (rol IN (1, 2, 3)),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol) REFERENCES Roles(id)
);

--3. Tabla Mascotas
CREATE TABLE Mascotas (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    raza VARCHAR2(100) NOT NULL,
    edad NUMBER NOT NULL,
    descripcion VARCHAR2(500) NOT NULL,
    foto VARCHAR2(500),
    estado VARCHAR2(20) NOT NULL CHECK (estado IN ('Disponible', 'Adoptado')),
    usuario NUMBER ,
    CONSTRAINT fk_mascota_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id)
);

--4. Tabla HistorialMedico
CREATE TABLE HistorialMedico (
    id NUMBER PRIMARY KEY,
    mascota NUMBER NOT NULL,
    fecha DATE NOT NULL,
    diagnostico VARCHAR2(500),
    tratamiento VARCHAR2(500),
    veterinario VARCHAR2(100),
    observaciones VARCHAR2(500),
    estado VARCHAR2(20) NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT fk_historial_mascota FOREIGN KEY (mascota) REFERENCES Mascotas(id)
);

--5. Tabla Adopciones
CREATE TABLE Adopciones (
    id NUMBER PRIMARY KEY,
    fecha DATE NOT NULL,
    usuario NUMBER NOT NULL,
    mascota NUMBER NOT NULL,
    CONSTRAINT fk_adopcion_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id),
    CONSTRAINT fk_adopcion_mascota FOREIGN KEY (mascota) REFERENCES Mascotas(id),
    CONSTRAINT uk_adopcion_mascota UNIQUE (mascota) -- Una mascota solo puede ser adoptada una vez
);

--6. Tabla Reportes
CREATE TABLE Reportes (
    id NUMBER PRIMARY KEY,
    fecha DATE NOT NULL,
    usuario NUMBER NOT NULL,
    mascota NUMBER,
    provincia VARCHAR2(100) NOT NULL,
    canton VARCHAR2(100) NOT NULL,
    distrito VARCHAR2(100) NOT NULL,
    detalles VARCHAR2(500) NOT NULL,
    CONSTRAINT fk_reporte_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id),
    CONSTRAINT fk_reporte_mascota FOREIGN KEY (mascota) REFERENCES Mascotas(id)
);

--7. Tabla campanias
CREATE TABLE campanias (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    descripcion VARCHAR2(500) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    objetivo NUMBER NOT NULL,
    estado VARCHAR2(20) NOT NULL CHECK (estado IN ('Activa', 'Inactiva')),
    usuario NUMBER NOT NULL,
    CONSTRAINT fk_campania_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id)
);

--8. Tabla Donacionescampanias
CREATE TABLE Donacionescampanias (
    id NUMBER PRIMARY KEY,
    fecha DATE NOT NULL,
    cantidad NUMBER NOT NULL,
    usuario NUMBER NOT NULL,
    campania NUMBER NOT NULL,
    CONSTRAINT fk_donacion_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id),
    CONSTRAINT fk_donacion_campania FOREIGN KEY (campania) REFERENCES campanias(id)
);

--9. Tabla Inventario
CREATE TABLE Inventario (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    tipo VARCHAR2(100) NOT NULL,
    cantidad NUMBER NOT NULL,
    fechaIngreso DATE NOT NULL,
    fechaCaducidad DATE,
    proveedor VARCHAR2(100) NOT NULL,
    fuente VARCHAR2(20) NOT NULL CHECK (fuente IN ('Compra', 'Donacion'))
);

--10. Tabla Eventos
CREATE TABLE Eventos (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    descripcion VARCHAR2(500) NOT NULL,
    fecha DATE NOT NULL,
    ubicacion VARCHAR2(200) NOT NULL,
    responsable NUMBER NOT NULL,
    tipo VARCHAR2(20) NOT NULL CHECK (tipo IN ('Presencial', 'Virtual')),
    estado VARCHAR2(20) NOT NULL CHECK (estado IN ('En curso', 'Planificado', 'Finalizado')),
    CONSTRAINT fk_evento_responsable FOREIGN KEY (responsable) REFERENCES Usuarios(id)
);

--11. Tabla EventosAsistencia
CREATE TABLE EventosAsistencia (
    id NUMBER PRIMARY KEY,
    evento NUMBER NOT NULL,
    usuario NUMBER NOT NULL,
    CONSTRAINT fk_asistencia_evento FOREIGN KEY (evento) REFERENCES Eventos(id),
    CONSTRAINT fk_asistencia_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id),
    CONSTRAINT uk_asistencia_evento_usuario UNIQUE (evento, usuario) -- Un usuario solo puede asistir una vez a un evento
);

--12. Tabla Voluntarios
CREATE TABLE Voluntarios (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    usuario NUMBER NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE,
    horas NUMBER NOT NULL,
    estado VARCHAR2(20) NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT fk_voluntario_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id)
);

--13. Tabla para las actividades de los voluntarios (relación muchos a muchos)
CREATE TABLE VoluntariosActividades (
    voluntario_id NUMBER,
    actividad VARCHAR2(100),
    PRIMARY KEY (voluntario_id, actividad),
    CONSTRAINT fk_va_voluntario FOREIGN KEY (voluntario_id) REFERENCES Voluntarios(id)
);

--14. Tabla para contadores (equivalente a la colección Counters en MongoDB)
CREATE TABLE Contadores (
    id VARCHAR2(50) PRIMARY KEY,
    seq NUMBER NOT NULL
);

--Índices adicionales
CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_mascotas_nombre ON Mascotas(nombre);
CREATE INDEX idx_mascotas_estado ON Mascotas(estado);
CREATE INDEX idx_historial_mascota ON HistorialMedico(mascota);
CREATE INDEX idx_adopciones_usuario ON Adopciones(usuario);
CREATE INDEX idx_reportes_usuario ON Reportes(usuario);
CREATE INDEX idx_campanias_nombre ON campanias(nombre);
CREATE INDEX idx_campanias_estado ON campanias(estado);
CREATE INDEX idx_donaciones_usuario ON Donacionescampanias(usuario);
CREATE INDEX idx_donaciones_campania ON Donacionescampanias(campania);
CREATE INDEX idx_inventario_nombre ON Inventario(nombre);
CREATE INDEX idx_inventario_fuente ON Inventario(fuente);
CREATE INDEX idx_eventos_nombre ON Eventos(nombre);
CREATE INDEX idx_eventos_estado ON Eventos(estado);
CREATE INDEX idx_asistencia_evento ON EventosAsistencia(evento);
CREATE INDEX idx_asistencia_usuario ON EventosAsistencia(usuario);
CREATE INDEX idx_voluntarios_usuario ON Voluntarios(usuario);
CREATE INDEX idx_voluntarios_estado ON Voluntarios(estado);

--Secuencias para autoincrementales (reemplazo de los contadores de MongoDB)
CREATE SEQUENCE seq_roles START WITH 4;
CREATE SEQUENCE seq_usuarios START WITH 4;
CREATE SEQUENCE seq_mascotas START WITH 7;
CREATE SEQUENCE seq_historial_medico START WITH 4;
CREATE SEQUENCE seq_adopciones START WITH 4;
CREATE SEQUENCE seq_reportes START WITH 5;
CREATE SEQUENCE seq_campanias START WITH 4;
CREATE SEQUENCE seq_donaciones START WITH 4;
CREATE SEQUENCE seq_inventario START WITH 4;
CREATE SEQUENCE seq_eventos START WITH 4;
CREATE SEQUENCE seq_asistencias START WITH 4;
CREATE SEQUENCE seq_voluntarios START WITH 4;