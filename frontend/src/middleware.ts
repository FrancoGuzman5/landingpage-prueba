// src/middleware.ts
// Modo mantención: cierra el sitio al público sin borrar nada ni tocar el
// hospedaje. Vercel en plan gratis no tiene un botón de "pausar proyecto", así
// que el interruptor vive acá y se maneja con variables de entorno.
//
// Cómo se usa (en Vercel → Settings → Environment Variables):
//   MANTENCION=1          → el sitio queda cerrado
//   MANTENCION=0 (o sin la variable) → el sitio funciona normal
//   MANTENCION_CLAVE=loquesea → habilita una llave de acceso para entrar igual
//
// Para entrar estando cerrado: https://…/?acceso=loquesea
// Eso deja una cookie y ya se navega normal durante 7 días, sin repetir el
// parámetro en cada página.
//
// Responde 503 y no 404 a propósito: 503 significa "no disponible ahora" y los
// buscadores lo entienden como algo temporal, así que no dan por muerto el
// sitio. Un 404 sí lo daría.

import { NextResponse, type NextRequest } from "next/server";

const COOKIE_ACCESO = "kumelen_acceso";

function paginaMantencion() {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Volvemos pronto | Kumelen Endémico</title>
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0; min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
        background: #27292D; color: #E8E1D4;
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        text-align: center; padding: 24px;
      }
      main { max-width: 34rem; }
      /* El isologo original es de 3860px: se limita por CSS para no servir
         una imagen enorme en una página que solo lleva un mensaje. */
      img { width: 96px; height: auto; margin: 0 auto 1.5rem; display: block; }
      h1 { font-size: 1.75rem; margin: 0 0 1rem; color: #fff; font-weight: 600; }
      p { line-height: 1.6; margin: 0 0 .75rem; color: rgba(232,225,212,.85); }
      .nota { font-size: .8rem; color: rgba(232,225,212,.5); margin-top: 2rem; }
    </style>
  </head>
  <body>
    <main>
      <img src="/Isologo.png" alt="Kumelen Endémico" width="96" height="87" />
      <h1>Estamos trabajando en el sitio</h1>
      <p>Esta web está en desarrollo y volverá a estar disponible pronto.</p>
      <p class="nota">Sitio de demostración · no es la web oficial de Kumelen Endémico.</p>
    </main>
  </body>
</html>`;
}

export function middleware(request: NextRequest) {
  if (process.env.MANTENCION !== "1") return NextResponse.next();

  const clave = process.env.MANTENCION_CLAVE;

  // Llave por la URL: deja la cookie para no tener que repetir el parámetro.
  const acceso = request.nextUrl.searchParams.get("acceso");
  if (clave && acceso === clave) {
    const limpia = new URL(request.nextUrl);
    limpia.searchParams.delete("acceso");
    const res = NextResponse.redirect(limpia);
    res.cookies.set(COOKIE_ACCESO, clave, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // una semana
      path: "/",
    });
    return res;
  }

  // Quien ya tiene la cookie sigue navegando normal.
  if (clave && request.cookies.get(COOKIE_ACCESO)?.value === clave) {
    return NextResponse.next();
  }

  return new NextResponse(paginaMantencion(), {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Sin caché: si no, la página de mantención se quedaría pegada en el
      // navegador después de reabrir el sitio.
      "cache-control": "no-store",
      "retry-after": "86400",
    },
  });
}

export const config = {
  // Se deja pasar lo que no es una página: archivos estáticos, imágenes
  // optimizadas, fuentes y los medios de /public. Si se bloquearan, ni
  // siquiera la propia página de mantención cargaría bien.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|videos|fonts|Isologo).*)",
  ],
};
