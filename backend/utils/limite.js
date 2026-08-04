// backend/utils/limite.js
// Tope de filas para los findMany.
//
// La idea no es paginar, es que ninguna consulta pueda devolver la tabla
// entera: sin tope, una sola petición puede hacer que el servidor cargue en
// memoria y serialice todo lo que haya en la base.
//
// El máximo lo decide el servidor. Un cliente puede pedir MENOS con ?limit=,
// nunca más, aunque escriba 10000.

const LIMITE_MAX = 100;

function limite(query, max = LIMITE_MAX) {
  const pedido = Number.parseInt(query?.limit, 10);

  // parseInt devuelve NaN con "abc" o con el parámetro ausente, y valores
  // negativos o cero romperían la consulta: en todos esos casos, el máximo.
  if (!Number.isFinite(pedido) || pedido <= 0) return max;

  // Lo que hace imposible pasarse por arriba.
  return Math.min(pedido, max);
}

module.exports = { limite, LIMITE_MAX };
