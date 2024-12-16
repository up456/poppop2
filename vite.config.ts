import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [react(), dts({ include: ["src"] })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es", "cjs"],
      name: "PopChildren",
      fileName: (format) => `index.${format === "es" ? "esm" : "cjs"}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
  },
})
