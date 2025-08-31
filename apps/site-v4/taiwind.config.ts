[ -f apps/site-v4-manus/tailwind.config.ts ] || cat > apps/site-v4-manus/tailwind.config.ts <<'EOF'
import type { Config } from "tailwindcss"
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.{ts,tsx,css}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
EOF
