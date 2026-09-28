
/** @type {import('next').NextConfig} */

const nextConfig = {
  // aquí tus opciones, por ejemplo:
  reactStrictMode: true,

  images: {
    // Por defecto Next ofrece hasta 3840px. Ninguna foto del sitio se muestra
    // tan grande, pero en pantallas retina el navegador igual elegía esa
    // variante y descargaba megas de más. Recortamos la lista: el caso típico
    // cae en ~1200px y el peor caso (imagen a pantalla completa en un monitor
    // grande) queda topado en 1920.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // Las fotos que se suben desde el panel viven en Vercel Blob, no en
    // /public. next/image se niega a optimizar imágenes de dominios que no
    // estén en esta lista (es una protección contra usar el servidor como
    // proxy de cualquier imagen de internet), así que sin esta entrada las
    // tarjetas fallarían al mostrar una foto subida.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

module.exports = nextConfig;
