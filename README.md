# Sistema de Gestión - Dejando Huella CR 🐾

## Integrantes
- Oscar Andrea Cascante Díaz  
- Juan Ignacio Vargas Ramírez  
- Darío Antonio Valverde Valverde  

## Universidad
**Fidélitas**

## Curso
**Lenguaje de Bases de Datos**

## Profesor
**José Pablo Rodríguez Ledezma**

**Segundo Cuatrimestre 2025**

---

## 🎯 Objetivo General
Desarrollar un sistema de gestión que permita automatizar y mejorar los procesos de gestión de animales, adopciones, voluntariado y donaciones para la organización **Dejando Huella CR**.

## 📌 Objetivos Específicos
- Centralizar la información de animales rescatados, su historial médico y estado de adopción.  
- Facilitar la interacción entre usuarios externos y la organización mediante formularios validados para adopción y voluntariado.  
- Implementar un módulo de registro y consulta de donaciones que garantice la trazabilidad y control de aportes recibidos.  

---

## 🚀 Alcance
El sistema web desarrollado para **Dejando Huella CR** permitirá:

- Registrar animales rescatados mediante un formulario validado (Administrador / Veterinario).  
- Consultar el historial médico de los animales (Administrador / Veterinario).  
- Visualizar perfiles de animales disponibles para adopción (Usuarios externos).  
- Enviar solicitudes de adopción (Usuarios externos, una por animal/persona).  
- Asignar tareas de voluntariado en fechas específicas (Usuarios registrados).  
- Registrar y consultar donaciones monetarias o en especie (Administrador).  
- Validar datos en todos los formularios con mensajes de advertencia claros.  
- Restringir el acceso a usuarios no autenticados para secciones confidenciales (Administrador).  

---

## ⚠️ Restricciones
- Todos los campos obligatorios deben completarse correctamente.  
- Solo usuarios con permisos acceden a información confidencial.  
- Un usuario no podrá tener tareas de voluntariado en la misma fecha y hora.  
- Solo se mostrarán animales con estado **“disponible para adopción”**.  
- Las donaciones registradas deben ser mayores a cero.  
- Las contraseñas deben tener un mínimo de 8 caracteres.  

---

## 🏢 Contexto de la Empresa
**Dejando Huella CR** es una organización sin fines de lucro ubicada en Costa Rica, comprometida con la protección, rescate, rehabilitación y adopción de animales en situación de vulnerabilidad.

Actualmente no cuenta con un sitio web oficial, lo cual restringe su visibilidad y capacidad de difusión, limitándose únicamente a una página de Instagram. Esta dependencia de redes sociales dificulta la trazabilidad, seguimiento y organización de las solicitudes.  

La gestión de la información crítica (animales, adopciones, voluntariado, tratamientos médicos, donaciones) se realiza manualmente en hojas de cálculo y archivos distribuidos, lo que genera problemas como:
- Falta de acceso centralizado y rápido a la información.  
- Dificultad en el seguimiento de historiales médicos.  
- Procesos ineficientes de adopción y voluntariado.  
- Poca trazabilidad de donaciones.  

---

## 🛠️ Lenguaje y Herramientas
- **Lenguaje de programación**: JavaScript, HTML y CSS  
- **Base de datos**: Oracle SQL Developer  
- **Control de versiones**: Git y GitHub  

---

## 📑 Requerimientos de Usuario

### 1. Registro de animales rescatados
- **Tipo**: Necesario  
- **Crítico**: Sí  
- **Prioridad**: Alta  
- **Usuario**: Administrador / Veterinario  
- **Descripción**: El administrador podrá ingresar los datos del animal desde un formulario.  

---

### 2. Consulta de historial médico
- **Tipo**: Deseable  
- **Crítico**: Sí  
- **Prioridad**: Media  
- **Usuario**: Administrador / Veterinario  
- **Descripción**: Mostrar los datos y el historial médico de un animal registrado.  

---

### 3. Solicitud de adopción
- **Tipo**: Necesario  
- **Crítico**: Sí  
- **Prioridad**: Alta  
- **Usuario**: Usuario externo  
- **Descripción**: Permite a un usuario externo registrar su solicitud de adopción de un animal.  

---

### 4. Voluntarios a tareas
- **Tipo**: Deseable  
- **Crítico**: No  
- **Prioridad**: Media  
- **Usuario**: Usuario externo  
- **Descripción**: Permite registrar la participación en tareas de voluntariado.  

---

### 5. Registro y consulta de donaciones
- **Tipo**: Necesario  
- **Crítico**: Sí  
- **Prioridad**: Alta  
- **Usuario**: Administrador  
- **Descripción**: Se registran y consultan donaciones monetarias o en especie.  

---

### 6. Animales disponibles para adopción
- **Tipo**: Necesario  
- **Crítico**: Sí  
- **Prioridad**: Alta  
- **Usuario**: Usuario externo  
- **Descripción**: El visitante podrá ver los perfiles de los animales en adopción.  

---

### 7. Validación de datos
- **Tipo**: Necesario  
- **Crítico**: Sí  
- **Prioridad**: Alta  
- **Usuario**: Todos  
- **Descripción**: Validación en todos los formularios con mensajes claros.  

---

### 8. Acceso al sistema
- **Tipo**: Necesario  
- **Crítico**: Sí  
- **Prioridad**: Alta  
- **Usuario**: Administrador  
- **Descripción**: Solo usuarios autenticados con permisos podrán acceder a información confidencial.  

---

## 🔗 Repositorio GitHub
[Proyecto en GitHub](https://github.com/JuanIgnacio3/ProyectoLenguajeBD.git)

---

## ✅ Conclusiones
- El sistema automatizó tareas críticas: registro de animales, adopciones y voluntariado.  
- Oracle y los formularios validados permiten un acceso centralizado y seguro a la información.  
- Los formularios de adopción y voluntariado fortalecen la relación con la comunidad.  

---

## 💡 Recomendaciones
- Implementar un sistema de alertas (correo o mensajes internos).  
- Capacitar a los administradores para el correcto uso del sistema.  
- Establecer una rutina de respaldo semanal de la base de datos.  
