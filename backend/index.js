require('dotenv').config();         // Carga variables de entorno
const express = require('express'); // Framework para manejar la API
const cors = require('cors');       // Habilita CORS para evitar bloqueos al frontend
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3001;
const authenticate   = require("./middlewares/authMiddleware");

// Render corta el TLS en su proxy y reenvía por HTTP. Sin esto, req.ip sería
// la del proxy (la misma para todo el mundo) y req.protocol diría "http".
// El 1 confía en un único salto: con `true`, cualquiera podría falsear su IP
// mandando una cabecera X-Forwarded-For a mano.
app.set("trust proxy", 1);

// Va primero porque los middlewares corren en orden y helmet actúa poniendo
// cabeceras: lo que se responda antes de registrarlo saldría sin ellas.
app.use(helmet());

// CORS: en producción se restringe al dominio del frontend (FRONTEND_URL).
// En local, si FRONTEND_URL no está definida, se permite cualquier origen.
app.use(cors(process.env.FRONTEND_URL ? { origin: process.env.FRONTEND_URL } : {}));

// El default de Express son 100kb. Ninguna petición legítima se acerca: la más
// pesada es guardar un tour completo (~3,7kb). El tope acota cuánta memoria
// puede hacernos reservar un request antes de rechazarlo.
app.use(express.json({ limit: "32kb" }));

// Importar rutas // Rutas protegidas
const userRoutes = require('./routes/users');
app.use("/users", authenticate, userRoutes);      // Ahora todo lo que venga a /users va a ahí

const tourRoutes = require('./routes/tours');
app.use("/tours", tourRoutes);      // GET público; crear/editar/borrar protegido por-ruta (ADMIN)

const bookingRoutes = require('./routes/bookings');
app.use("/bookings", bookingRoutes);   // POST público (invitado); resto protegido por-ruta

// Rutas públicas de autenticación
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Kumelen");
});

// Después de las rutas: solo llega acá lo que ninguna reclamó. Responde JSON
// porque el resto de la API también lo hace; el 404 de Express sería HTML.
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Los cuatro argumentos son obligatorios: así Express lo reconoce como
// manejador de errores, aunque `next` no se use. Va al final de todo.
//
// El detalle completo queda en los logs de Render, que solo vemos nosotros.
// Al cliente le llega un mensaje genérico: un stack trace delata rutas de
// archivos, versiones y estructura interna del servidor.
//
// En Express 5 las promesas rechazadas de los handlers async llegan hasta acá
// solas, así que también cubre los controladores que no tienen try/catch.
// Mensajes fijos por código: describen el problema sin repetir el texto
// original del error, que puede traer detalles internos.
const MENSAJES_CLIENTE = {
  400: "Petición inválida",
  413: "Petición demasiado grande",
};

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Un body de 40kb o un JSON malformado son errores del cliente, no caídas
  // del servidor. Devolver 500 en esos casos haría creer al frontend que el
  // fallo es nuestro, y le impediría corregir la petición.
  if (status >= 400 && status < 500) {
    return res
      .status(status)
      .json({ error: MENSAJES_CLIENTE[status] || "Petición inválida" });
  }

  console.error("Error no controlado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Levanta servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
