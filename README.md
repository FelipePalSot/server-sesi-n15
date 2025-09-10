# server-sesi-n15 · API + WebSockets (Express 5, Socket.IO, JWT, MongoDB)

Backend mínimo pero completo para autenticación básica, notificaciones en tiempo real y endpoints de ejemplo.
Construido con **Node.js (ESM)**, **Express 5**, **Socket.IO**, **JWT** y **MongoDB/Mongoose**.

> Puerto por defecto: **4001** · CORS: controlado por `FRONTEND_URL` · Node recomendado: **>= 18**

**Trabajo académico — Grupo 1**

---

## Características

- **API REST** con Express 5 (ESM).
- **Autenticación JWT** (token + refresh token) y *middleware* de roles.
- **MongoDB** con Mongoose y *hooks* (normaliza nombres/roles).
- **WebSockets** con Socket.IO (salas por usuario vía `email`).
- **Notificaciones en tiempo real** (evento `nuevaNotificacion`).
- **Nodemon** para desarrollo y soporte de `.env` (dotenv).
- CORS configurable vía `utils/constantes.js`.

---

## Estructura del proyecto

```
server-sesi-n15-master/
├─ app.js
├─ routes.js
├─ package.json
├─ .env
├─ config/
│  ├─ auth.js              # generación/verificación de JWT
│  ├─ cors.js              # configuración CORS (usa FRONTEND_URL)
│  └─ mongoose.js          # conexión a MongoDB (bd: bdprueba)
├─ controllers/
│  ├─ seguridad.controller.js
│  └─ notificacion.controller.js
├─ middleware/
│  └─ auth.middleware.js   # protección por token + roles
├─ routes/
│  ├─ seguridad.routes.js
│  └─ notificacion.routes.js
├─ schemas/
│  ├─ persona.schema.js    # usuarios/personas (Mongoose)
│  └─ notificacion.schema.js
├─ services/
│  ├─ seguridad.service.js
│  └─ notificacion.service.js
└─ utils/
   ├─ constantes.js        # PUERTO, FRONTEND_URL, JWT_* (algunos via .env)
   └─ socket.js            # configuración de Socket.IO + getIO()
```

---

## Requisitos

- **Node.js >= 18** (ESM + Express 5)
- **MongoDB** ejecutándose localmente en `mongodb://localhost:27017` (DB: `bdprueba`)
- **npm** o **pnpm**

> Si usas Windows, te recomendamos instalar **Node 18/20 LTS** y **MongoDB Community Server**.

---

## Puesta en marcha (desarrollo)

1) **Instalar dependencias**  
```bash
npm install
```

2) **Variables de entorno**  
Revisa `.env` (incluido en el repo):
```
JWT_SECRET='...'
JWT_REFRESH_SECRET='...'
```
> Puedes cambiarlas. Ojo: en `utils/constantes.js` también hay constantes como `PUERTO`, `FRONTEND_URL`, `JWT_EXPIRES`, etc.

3) **Levantar MongoDB**  
Asegúrate de tener MongoDB corriendo localmente en el puerto 27017.

4) **Iniciar el servidor**  
```bash
npm start
```
Verás en consola: `Listening on 4001`.

---

## CORS y configuración

- **Puerto**: definido en `utils/constantes.js` → `const PUERTO = 4001;`
- **CORS**: `FRONTEND_URL` en `utils/constantes.js`. Por defecto es `'*'` (desarrollo).  
  En producción, define el origen exacto, por ejemplo:
  ```js
  export const FRONTEND_URL='https://mi-frontend.com';
  ```

---

## Autenticación y seguridad

- **JWT**: generación/verificación en `config/auth.js`.
- **Middleware**: `middleware/auth.middleware.js` valida el `Authorization: Bearer <token>` y (opcionalmente) el rol.

### Flujo típico
1. `POST /api/v1/seguridad/login` → retorna `token` y `refreshToken` si usuario/password son válidos.
2. En endpoints protegidos, incluir `Authorization: Bearer <token>`.
3. `POST /api/v1/seguridad/refresh-token` → genera un nuevo `token` usando el `refreshToken`.

> **Importante**: el ejemplo actual compara la contraseña en claro (ver servicios/esquemas). Para producción, usa `bcrypt` y guarda *passwords* con *hash + salt*.

---

## WebSockets (Socket.IO)

- **Inicialización**: en `app.js` → `configSocket(server)`.
- **Archivo**: `utils/socket.js` expone:
  - `configSocket(server)`: configura el servidor Socket.IO.
  - `getIO()`: devuelve la instancia `io` para emitir desde servicios.

### Eventos implementados (servidor)
- **connection**: log de usuario conectado.
- **matriculado**: el cliente envía un `email` (o identificador) y el servidor lo **une a una sala** con ese nombre (`socket.join(usuario)`).
- **tresenraya**: ejemplo de juego; la data recibida se difunde con `io.emit("notificacion", datoJuego)`.

### Notificaciones en tiempo real
Al **crear una notificación** vía API, el servicio:
```js
const io = getIO();
io.to(emailDelUsuario).emit("nuevaNotificacion", notificacionCreada);
```
Es decir, **solo** los clientes “matriculados”/unidos a la sala con ese `email` la recibirán.

### Ejemplo de cliente (vanilla con CDN)
```html
<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
<script>
  const socket = io("http://localhost:4001", { transports: ["websocket"] });

  // Unirse a la sala del usuario (por ejemplo, su email)
  socket.emit("matriculado", "usuario@correo.com");

  // Escuchar notificaciones
  socket.on("nuevaNotificacion", (msg) => {
    console.log("Notificación:", msg);
  });

  // Evento de ejemplo del servidor
  socket.on("notificacion", (payload) => {
    console.log("Evento notificacion:", payload);
  });
</script>
```

---

## Endpoints principales

**Prefijo**: `/api/v1`

### Seguridad (`/seguridad`)
- `GET /api/v1/seguridad/` → lista de personas/usuarios.
- `POST /api/v1/seguridad/login` → *body* `{ email, password }` → retorna `{ token, refreshToken, usuario }`.
- `POST /api/v1/seguridad/refresh-token` → *body* `{ refreshToken }` → retorna `{ token }`.
- `POST /api/v1/seguridad/` → crea usuario/persona.
- `PUT /api/v1/seguridad/:id` → actualiza usuario/persona.
- `GET /api/v1/seguridad/edad-promedio` → **nota**: el controlador espera `edadMinima` en el **body**; puedes enviarlo como `POST` o ajustar a querystring.

> Algunas rutas protegidas por roles están comentadas a modo de ejemplo. Para activarlas, descomenta `mauth.authMiddleware(["admin"])` en las rutas.

### Notificaciones (`/notificacion`)
- `GET /api/v1/notificacion/:email` → obtiene notificaciones por email.
- `POST /api/v1/notificacion/` → crea una notificación (*body* mínimo `{ email, mensaje, precio }`) y emite `nuevaNotificacion` a la sala del usuario.
- `PATCH /api/v1/notificacion/:id/leer` → marca como leída una notificación.

### Ejemplos (cURL)

**Login**
```bash
curl -X POST http://localhost:4001/api/v1/seguridad/login   -H "Content-Type: application/json"   -d '{"email":"usuario@correo.com","password":"123456"}'
```

**Renovar token**
```bash
curl -X POST http://localhost:4001/api/v1/seguridad/refresh-token   -H "Content-Type: application/json"   -d '{"refreshToken":"<REFRESH_TOKEN_AQUI>"}'
```

**Crear notificación**
```bash
curl -X POST http://localhost:4001/api/v1/notificacion   -H "Content-Type: application/json"   -d '{"email":"usuario@correo.com","mensaje":"¡Oferta!","precio":9.99}'
```

**Marcar notificación como leída**
```bash
curl -X PATCH http://localhost:4001/api/v1/notificacion/<ID>/leer
```

---

## Capa de datos (Mongoose)

### `Persona` (resumen)
Campos típicos: `nombre`, `apellido`, `nro_documento (unique)`, `edad`, `usuario.{ email, password, rol }`, etc.  
*Hook* `pre('save')` normaliza: `nombre/apellido` a mayúsculas y `usuario.rol` a minúsculas.

### `Notificacion` (resumen)
Campos: `email`, `mensaje`, `precio`, `lectura` (boolean), fechas de creación/actualización, etc.

> La conexión a MongoDB está en `config/mongoose.js` y usa la base `bdprueba` por defecto.

---

## Autoría
Este repositorio corresponde al **Grupo 1**.

### Integrantes
- Diego Alonso Chiang Meléndez
- Felipe Palomino Sotelo
- Adolfo Andrés Bravo Andía
- Vanesa Leonela Salcedo Alva
