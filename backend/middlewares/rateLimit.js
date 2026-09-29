// backend/middlewares/rateLimit.js
// Límites de peticiones para las rutas públicas que escriben algo.
//
// Los contadores viven en memoria: se reinician si Render reinicia el proceso
// (por ejemplo al despertar después de dormir). Para un solo servidor es
// suficiente; con varias instancias habría que pasarlos a un almacén
// compartido como Redis, o cada instancia contaría por su lado.

const { rateLimit } = require("express-rate-limit");

const MINUTO = 60 * 1000;

const comun = {
  // Cabeceras RateLimit estándar: le dicen al cliente cuánto le queda y
  // cuándo se reinicia, en vez de que tenga que adivinar.
  standardHeaders: "draft-8",
  legacyHeaders: false,
};

/**
 * Login: 10 intentos FALLIDOS por cuenta cada 15 minutos.
 *
 * Por qué por cuenta y no por IP: el login no lo llama el navegador del
 * usuario sino NextAuth desde el servidor de Vercel. Para este backend,
 * todos los logins vienen de las mismas IPs de Vercel. Un límite por IP
 * sumaría los errores de todos los usuarios en un solo contador: con diez
 * contraseñas mal escritas entre todos, nadie más podría entrar. En vez de
 * una protección sería un botón para tumbar el login.
 *
 * Por cuenta protege lo que de verdad importa, sobre todo la cuenta ADMIN:
 * a 10 intentos cada 15 minutos, probar un diccionario de 10.000 contraseñas
 * tomaría más de diez días.
 *
 * El costo aceptado: alguien podría bloquear a propósito una cuenta ajena
 * equivocándose adrede, pero solo por 15 minutos y sin acceder a nada.
 *
 * skipSuccessfulRequests: un login correcto no gasta cupo, así que a quien
 * se equivoca un par de veces y después acierta no se le acumula el castigo.
 */
const limitarLogin = rateLimit({
  ...comun,
  windowMs: 15 * MINUTO,
  limit: 10,
  skipSuccessfulRequests: true,
  // Normalizado: "Admin@Kumelen.cl " y "admin@kumelen.cl" son la misma
  // cuenta, y no deben tener contadores separados.
  keyGenerator: (req) => `login:${String(req.body?.email ?? "").trim().toLowerCase()}`,
  message: {
    error: "Demasiados intentos fallidos para esta cuenta. Espera 15 minutos e inténtalo de nuevo.",
  },
});

/**
 * Registro: 5 cuentas por IP cada hora.
 * Acá sí sirve la IP: el registro lo llama el navegador directamente. Frena
 * la creación masiva de cuentas falsas sin molestar a nadie real, que crea
 * una sola.
 */
const limitarRegistro = rateLimit({
  ...comun,
  windowMs: 60 * MINUTO,
  limit: 5,
  message: {
    error: "Se crearon demasiadas cuentas desde tu conexión. Inténtalo de nuevo en una hora.",
  },
});

/**
 * Reservas: 10 por IP cada hora.
 * Cada reserva dispara un correo al negocio. Sin límite, cualquiera podría
 * inundar esa bandeja —y la base de datos— con solicitudes falsas desde un
 * script. Diez por hora sobra para alguien real, que reserva una o dos.
 */
const limitarReservas = rateLimit({
  ...comun,
  windowMs: 60 * MINUTO,
  limit: 10,
  message: {
    error: "Recibimos demasiadas solicitudes desde tu conexión. Inténtalo de nuevo en una hora o escríbenos por WhatsApp.",
  },
});

/**
 * Recuperación de contraseña: dos límites encadenados, porque cada pedido
 * envía un correo y hay dos formas distintas de abusar de eso.
 *
 * Por IP (5/hora): frena a quien dispara pedidos en masa desde su conexión.
 * Acá la IP sí es real: el formulario lo llama el navegador directamente.
 */
const limitarRecuperacionPorIp = rateLimit({
  ...comun,
  windowMs: 60 * MINUTO,
  limit: 5,
  message: { error: "Demasiadas solicitudes desde tu conexión. Inténtalo de nuevo en una hora." },
});

/**
 * Por correo (3/hora): el límite por IP no alcanza para proteger a una
 * persona concreta. Alguien con varias conexiones podría llenarle la bandeja
 * de correos de recuperación a otra persona. Este tope protege al dueño del
 * correo, venga de donde venga el ataque.
 */
const limitarRecuperacionPorCorreo = rateLimit({
  ...comun,
  windowMs: 60 * MINUTO,
  limit: 3,
  keyGenerator: (req) => `recuperar:${String(req.body?.email ?? "").trim().toLowerCase()}`,
  message: {
    error: "Ya enviamos varios enlaces a este correo. Revisa tu bandeja y la carpeta de spam, o inténtalo en una hora.",
  },
});

/**
 * Restablecer: 10 por IP cada 15 minutos.
 * Adivinar un token de 256 bits es inviable, así que esto no es la defensa
 * principal; evita que alguien martille el endpoint gratis.
 */
const limitarRestablecer = rateLimit({
  ...comun,
  windowMs: 15 * MINUTO,
  limit: 10,
  message: { error: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." },
});

module.exports = {
  limitarLogin,
  limitarRegistro,
  limitarReservas,
  limitarRecuperacionPorIp,
  limitarRecuperacionPorCorreo,
  limitarRestablecer,
};
