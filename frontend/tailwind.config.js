/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        kumelenDark:  "#27292D", // Fondo principal, texto oscuro
        kumelenGold:  "#D6A042", // Color dorado destacado
        kumelenGreen: "#17301C", // Verde
        kumelenSand:  "#ECDBC8", // Beige claro
        kumelenGray:  "#C8C1B0", // Gris claro
        kumelenBrown: "#35332F", // Marrón secundario
        white:        "#FFFFFF",

        // ─── Tokens de conversión (rediseño) ───────────────────────────────
        // Paleta orientada a jerarquía visual y contraste AA. Conviven con los
        // tokens kumelen* de marca; por ahora se usan en CTAs y secciones nuevas.
        bosque:     "#0F3D2E", // verde valdiviano: CTAs sobre fondo claro, texto
        atacama:    "#C86A3B", // acento: subrayados y detalles GRANDES solamente
        atacamaCta: "#A8501F", // naranja de botones con texto blanco (5.48:1, AA)
        atacamaCtaDark: "#8E4319", // hover del botón primario
        arena:      "#E8E1D4", // fondos de sección
        liquen:     "#7FA88C", // acento secundario
        basalto:    "#1A1D1A", // texto oscuro
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        artifact: ["var(--font-artifact)"],
      }
    },
  },

  plugins: [],
}

