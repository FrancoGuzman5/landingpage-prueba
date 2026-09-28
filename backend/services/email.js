// backend/services/email.js
// Envío de correos con Resend. Un solo lugar para el proveedor: si mañana se
// cambia Resend por otro servicio, se toca este archivo y nada más.
//
// Variables de entorno:
//   RESEND_API_KEY        clave de la API. Sin ella no se envía nada.
//   NOTIFICACIONES_EMAIL  quién recibe los avisos internos (nuevas reservas).
//   EMAIL_REMITENTE       remitente. Mientras no haya un dominio verificado en
//                         Resend, solo sirve onboarding@resend.dev, y ese
//                         remitente SOLO entrega al correo del dueño de la
//                         cuenta de Resend.
//   FRONTEND_URL          para armar el enlace al panel dentro del correo.

const { Resend } = require("resend");

const REMITENTE_POR_DEFECTO = "Kumelen Endémico <onboarding@resend.dev>";

let cliente = null;
function obtenerCliente() {
  if (!process.env.RESEND_API_KEY) return null;
  cliente ??= new Resend(process.env.RESEND_API_KEY);
  return cliente;
}

// Todo lo que viene de un formulario se escapa antes de meterlo en el HTML.
// Sin esto, un invitado podría escribir en su nombre algo como
// <a href="sitio-falso">Confirmar pago</a>, y el correo que recibe el negocio
// mostraría un enlace de phishing como si fuera parte del mensaje.
function escaparHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const clp = (n) =>
  Number(n).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// timeZone UTC: las fechas de salida se guardan como día puro a medianoche UTC.
const fecha = (d) =>
  new Date(d).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * Envía un correo. Nunca lanza: devuelve { ok, ... } para que quien lo llame
 * decida qué hacer, y un correo fallido nunca tumbe la operación principal.
 */
async function enviarCorreo({ to, subject, html, text, replyTo }) {
  const resend = obtenerCliente();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY sin configurar: no se envía "${subject}"`);
    return { ok: false, motivo: "sin-configurar" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_REMITENTE || REMITENTE_POR_DEFECTO,
      to,
      subject,
      html,
      // Versión en texto plano: algunos clientes de correo la muestran en vez
      // del HTML, y su ausencia sube la probabilidad de caer en spam.
      text,
      replyTo,
    });

    // Resend NO lanza una excepción cuando la API rechaza el envío: devuelve
    // `error`. Si no se revisara acá, un correo rechazado se registraría como
    // enviado y nadie se enteraría de que los avisos no están llegando.
    if (error) {
      console.error(`[email] Resend rechazó "${subject}":`, error);
      return { ok: false, error };
    }
    console.log(`[email] Enviado "${subject}" (id ${data?.id})`);
    return { ok: true, id: data?.id };
  } catch (err) {
    // Fallos de red o de la propia librería.
    console.error(`[email] Error enviando "${subject}":`, err);
    return { ok: false, error: err };
  }
}

/**
 * Avisa al negocio que llegó una solicitud de reserva.
 * @param booking  reserva recién creada, con `tour` incluido.
 */
async function notificarNuevaReserva(booking, { esInvitado }) {
  const destino = process.env.NOTIFICACIONES_EMAIL;
  if (!destino) {
    console.warn("[email] NOTIFICACIONES_EMAIL sin configurar: no se avisa la nueva reserva");
    return { ok: false, motivo: "sin-destinatario" };
  }

  const t = booking.tour;
  const total = t.price * booking.quantity;
  const personas = `${booking.quantity} ${booking.quantity === 1 ? "persona" : "personas"}`;
  const panel = `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin`;
  const tipo = esInvitado ? "Invitado (sin cuenta)" : "Usuario registrado";

  const e = escaparHtml;
  const fila = (etiqueta, valor) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap">${etiqueta}</td>` +
    `<td style="padding:6px 0;color:#1A1D1A">${valor}</td></tr>`;

  const html = `
  <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1A1D1A">
    <h2 style="margin:0 0 4px;color:#0F3D2E">Nueva solicitud de reserva</h2>
    <p style="margin:0 0 20px;color:#6b6b6b">Queda como <strong>pendiente</strong> hasta que la confirmes en el panel.</p>
    <table style="border-collapse:collapse;font-size:15px">
      ${fila("Expedición", `<strong>${e(t.title)}</strong>`)}
      ${fila("Salida", e(fecha(t.startDate)))}
      ${fila("Personas", e(personas))}
      ${fila("Monto estimado", `<strong>${e(clp(total))}</strong> <span style="color:#6b6b6b">(${e(clp(t.price))} × ${booking.quantity})</span>`)}
      ${fila("Nombre", e(booking.contactName || "—"))}
      ${fila("Correo", e(booking.contactEmail || "—"))}
      ${fila("Teléfono", e(booking.contactPhone || "—"))}
      ${fila("Tipo", e(tipo))}
    </table>
    <p style="margin:24px 0">
      <a href="${e(panel)}" style="background:#A8501F;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Abrir el panel de reservas</a>
    </p>
    <p style="font-size:13px;color:#6b6b6b">Puedes responder este correo directamente: la respuesta le llega a quien hizo la solicitud.</p>
  </div>`;

  const text = [
    "Nueva solicitud de reserva (pendiente de confirmar)",
    "",
    `Expedición: ${t.title}`,
    `Salida: ${fecha(t.startDate)}`,
    `Personas: ${personas}`,
    `Monto estimado: ${clp(total)} (${clp(t.price)} × ${booking.quantity})`,
    `Nombre: ${booking.contactName || "—"}`,
    `Correo: ${booking.contactEmail || "—"}`,
    `Teléfono: ${booking.contactPhone || "—"}`,
    `Tipo: ${tipo}`,
    "",
    `Panel: ${panel}`,
  ].join("\n");

  return enviarCorreo({
    to: destino,
    subject: `Nueva reserva: ${t.title} · ${personas}`,
    html,
    text,
    // Reply-To al cliente: el negocio aprieta "Responder" y le escribe
    // directo, sin copiar la dirección desde el cuerpo del correo.
    replyTo: booking.contactEmail || undefined,
  });
}

module.exports = { enviarCorreo, notificarNuevaReserva, escaparHtml };
