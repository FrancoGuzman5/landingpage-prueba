// backend/utils/password.js
// Regla única de contraseñas: la usan el registro y la recuperación.
//
// Existe porque el registro no validaba nada en el servidor: solo el
// formulario revisaba que las dos contraseñas coincidieran, así que llamando
// directo a la API se podía crear una cuenta con "a" o con contraseña vacía.
// Tenerla en un solo lugar evita que las dos rutas exijan cosas distintas.

const MIN = 8;

// bcrypt solo considera los primeros 72 BYTES de la contraseña y descarta el
// resto en silencio. Una contraseña de 100 caracteres "funcionaría", pero
// cualquier otra con los mismos primeros 72 bytes también entraría. Se mide
// en bytes y no en caracteres porque una letra con tilde o un emoji ocupan
// más de un byte en UTF-8.
const MAX_BYTES = 72;

/** Devuelve un mensaje de error, o null si la contraseña sirve. */
function validarContrasena(password) {
  if (typeof password !== "string" || password.length === 0) {
    return "La contraseña es obligatoria.";
  }
  if (password.length < MIN) {
    return `La contraseña debe tener al menos ${MIN} caracteres.`;
  }
  if (Buffer.byteLength(password, "utf8") > MAX_BYTES) {
    return "La contraseña es demasiado larga (máximo 72 caracteres sin tildes).";
  }
  if (password.trim().length === 0) {
    return "La contraseña no puede ser solo espacios.";
  }
  return null;
}

module.exports = { validarContrasena };
