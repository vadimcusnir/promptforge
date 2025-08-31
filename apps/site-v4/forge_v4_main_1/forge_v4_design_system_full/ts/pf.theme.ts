// theme/pf.theme.ts
import { extendTheme } from "@chakra-ui/react";
export const pfTheme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  styles: { global: { "html, body": { bg: "#05010A", color:"#F5F7FA" } } },
  fonts: { heading: "Cinzel, serif", body: "Space Grotesk, ui-sans-serif", mono: "JetBrains Mono, ui-monospace" },
  colors: {
    brand: { 500:"#00FF7F" }, accent:{500:"#FF2F2F"}, gold:{500:"#CDA434"},
    surface:{500:"#0B0712", 600:"#100A18"}, border:{500:"#2A2036"}
  },
  radii: { sm:"6px", md:"10px", lg:"14px", xl:"20px" },
  shadows: { glow:"0 0 0 2px rgba(0,255,127,.2), 0 0 24px rgba(0,255,127,.35)" }
});
