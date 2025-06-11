# 02-Trivial-Customizable

Este proyecto es una aplicación web interactiva tipo Trivial customizable desarrollada como parte de nuestras prácticas de final de ciclo. Está orientada a centros educativos, permitiendo a los estudiantes jugar por equipos, responder preguntas personalizadas y generar informes útiles para docentes.

---

## 📌 Índice

- [🎮 Funcionamiento del juego](#-funcionamiento-del-juego)
- [📘 Guía del juego](#-guía-del-juego)
- [🔧 Tecnologías](#-tecnologías)
- [🚀 Funcionalidades](#-funcionalidades)
- [🛠️ Instalación y ejecución](#️-instalación-y-ejecución)
- [📂 Estructura del proyecto](#-estructura-del-proyecto)
- [🧑‍💻 Equipo de desarrollo](#-equipo-de-desarrollo)
- [📝 Licencia](#-licencia)

---

## 🎮 Funcionamiento del juego

Se trata de una **aplicación web con fines educativos** que mezcla elementos del clásico **Trivial** (en el diseño del tablero) con la dinámica del juego **Preguntados**.

- Los jugadores deben **responder preguntas y acumular puntos** según los aciertos.
- Gana el equipo que **más puntuación obtenga** al final.
- Para acceder al juego, el profesor inicia sesión con un **usuario y contraseña predefinidos**.
- Se puede elegir entre:
  - **Categorías por defecto**: Idiomas, Lengua, Matemáticas, Biología, Historia o Música (con preguntas integradas).
  - **Cargar preguntas personalizadas** mediante un archivo externo en formato CSV o Exccel.
- Permite la creación de hasta **5 equipos con 5 integrantes cada uno**, asignando nombre e imagen personalizada.
- En el juego:
  - Se **lanza un dado virtual** y, según el número, el equipo mueve la ficha esa cantidad de casillas en la dirección que elija.
  - Se muestra una **pregunta** que el equipo debe responder sumando puntos en caso de acierto.
  - Durante toda la partida, hay un **ranking en tiempo real** al lado del tablero con nombres, imágenes y puntuación de cada equipo.
  - Al finalizar, se muestra el **ranking final de ganadores**.
  - Existe una opción de **descargar un fichero personalizado** con los datos de la partida: preguntas falladas, qué equipos las fallaron y puntuación final. Este documento es útil para que los profesores analicen los resultados.

---

## 📘 Guía del Juego

### 🎯 Objetivo
Consigue todos los puntos que puedas para ganar el juego.  
Responde correctamente, aprovecha las **casillas especiales** y los **bonus por rachas**.

### 🧮 Sistema de Puntos

- Preguntas correctas:
  - **Personalizadas (Archivo externo)**: puntuación definida en el archivo.
  - **Predefinidas**: entre **10 y 30 puntos**.
- **Multiplicadores por Quesitos**:
 Cada vez que tu equipo consigue un quesito único, aumenta su multiplicador de puntos para las siguientes preguntas.  
**Tabla de multiplicadores:**

- 0 quesitos: x1  
- 1 quesito: x1.2  
- 2 quesitos: x1.4  
- 3 quesitos: x1.7  
- 4 quesitos: x2.1  
- 5 quesitos: x2.5  
- 6 quesitos: x3  

El multiplicador se aplica automáticamente a cada acierto, ¡y se mantiene aunque falles!  
Si vuelves a acertar en una casilla de quesito ya visitada, solo se aplica el multiplicador, no el x2.
### 🌟 Casillas Especiales

- **Quesito** → x2 puntos  
- **Casillas verdes** → turno extra

---
## 🔊 Audios interactivos

Para hacer la experiencia más dinámica y entretenida, el juego incluye **audios interactivos** que comentan el desarrollo de la partida en distintos momentos.  
Estos audios han sido generados mediante la herramienta **ElevenLabs**, utilizando voces naturales con IA para anunciar turnos, resultados y mensajes motivacionales.

---

## 🔧 Tecnologías

### 🖥️ Frontend

- React 19
- Tailwind CSS
- Vite
- Zustand
- Axios
- React Router DOM
- Framer Motion
- ESLint + Prettier

### 🗄️ Backend

- Node.js + Express
- Prisma ORM
- MySQL
- Multer
- CSV-Parser
- ExcelJS
- JWT + Bcrypt
- Dotenv

---

## 🚀 Funcionalidades

- 🧠 **Juego tipo Trivial por equipos**, con tablero interactivo.
- 👥 **Creación de equipos** personalizados (nombre + imagen).
- 📚 **Carga de preguntas desde CSV o Excel** o uso de categorías por defecto.
- 🎲 **Sistema de dado y movimiento de fichas**.
- ✅ **Registro de respuestas y control de puntuación**.
- 🔄 **Ranking en tiempo real** con imagen y puntos.
- 📊 **Generación de informe Excel personalizado** al final.
- 🔐 **Login para profesor** y botón para resetear la partida.

---

## 🛠️ Instalación y ejecución

### Requisitos

- Node.js (v18+)
- MySQL

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/trivial-educativo.git
cd trivial-educativo
```

### 2. Configura el entorno

Crear un archivo `.env` en /backend y en `/frontend` con las siguientes variables:

#### Backend (`/backend/.env`)

```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombreBD"
JWT_SECRET="clave_secreta"
PORT=5000
```

#### Frontend (`/frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

### 3. Instala dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 4. Migra la base de datos

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Ejecuta la aplicación

```bash
# Backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

Accede desde el navegador: [http://localhost:5173](http://localhost:5173)

---

## 📂 Estructura del proyecto

```
trivial-educativo/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── public/
│   └── ...
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── prisma/
│   └── ...
├── README.md
└── ...
```

---

## 🧑‍💻 Equipo de desarrollo

Este proyecto ha sido desarrollado por un grupo de estudiantes de **DAM/DAW** como parte del proyecto final de ciclo:

- **Jose Manuel Terroba Acevedo**
- **Leticia Migueláñez Fuentetaja**
- **Daniel Alconada Díaz**
- **María Rosa Bravo Gil**
- **Paulino Sánchez Sánchez**
- **Florentina Georgiana Dumitru**


### 📋 Responsable del proyecto

- **Álvaro Delgado**

### 👨‍🏫 Tutor académico

- **Francisco Jiménez Moral**

---

## 📝 Licencia

Este proyecto ha sido desarrollado con fines educativos.  
Queda prohibido su uso comercial sin autorización previa.

---

