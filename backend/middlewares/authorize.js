/**
 * Middleware factory para verificar roles.
 * @param  {...string} allowedRoles Lista de roles permitidos (e.g. "ADMIN").
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    // req.user viene de authMiddleware, con la forma { userId, role, iat, exp }
    const { role } = req.user || {};

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Acceso denegado: rol insuficiente" });
    }

    next();
  };
}

module.exports = authorize;