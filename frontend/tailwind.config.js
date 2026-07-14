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
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        artifact: ["var(--font-artifact)"],
      }
    },
  },

  plugins: [],
}

