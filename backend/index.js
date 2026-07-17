require('dotenv').config();         // Carga variables de entorno
const express = require('express'); // Framework para manejar la API
const cors = require('cors');       // Habilita CORS para evitar bloqueos al frontend
const app = express();
const PORT = process.env.PORT || 3001;
const authenticate   = require("./middlewares/authMiddleware");

// CORS: en producción se restringe al dominio del frontend (FRONTEND_URL).
// En local, si FRONTEND_URL no está definida, se permite cualquier origen.
app.use(cors(process.env.FRONTEND_URL ? { origin: process.env.FRONTEND_URL } : {}));
app.use(express.json());            // Habilita JSON como formato de entrada/salida

// Importar rutas // Rutas protegidas
const userRoutes = require('./routes/users');
app.use("/users", authenticate, userRoutes);      // Ahora todo lo que venga a /users va a ahí

const tourRoutes = require('./routes/tours');
app.use("/tours", authenticate, tourRoutes);      // Todo lo que venga a /tours se maneja ahí

const bookingRoutes = require('./routes/bookings');
app.use("/bookings", authenticate, bookingRoutes);

// Rutas públicas de autenticación
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Kumelen");
});

// Levanta servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
