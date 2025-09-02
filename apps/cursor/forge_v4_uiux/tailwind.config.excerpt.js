// tailwind.config.js (excerpt)
export default {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        bg: "#05010A",
        brand: "#00FF7F",
        accent: "#FF2F2F",
        gold: "#CDA434",
        surface: "#0B0712",
        surfaceAlt: "#100A18",
        border: "#2A2036"
      },
      boxShadow: {
        glow: "0 0 0 2px rgba(0,255,127,.2), 0 0 24px rgba(0,255,127,.35)"
      },
      borderRadius: {
        md: "10px",
        xl: "20px"
      }
    }
  }
}
