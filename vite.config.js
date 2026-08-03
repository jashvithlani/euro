import react from "@vitejs/plugin-react";

export default {
  base: "/",
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
    target: "es2020",
    rollupOptions: {
      output: {
        // Strip comments from emitted chunks.
        compact: true,
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
    legalComments: "none",
  },
};
