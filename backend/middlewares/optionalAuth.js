const jwt = require("jsonwebtoken");

// Autenticación "blanda": si viene un token válido, adjunta req.user;
// si no viene o es inválido, sigue igual (req.user queda undefined).
// Sirve para rutas públicas que se comportan distinto si hay sesión
// (ej. crear una reserva como invitado o como usuario logueado).
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header) {
    const token = header.replace("Bearer ", "");
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // token inválido/expirado → lo tratamos como invitado, sin cortar
    }
  }
  next();
}

module.exports = optionalAuth;
