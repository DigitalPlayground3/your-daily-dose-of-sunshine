/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * ─────────────────────────────────────────────────────────────
 *  GITHUB PAGES: put your repository name here  ⬇⬇⬇
 * ─────────────────────────────────────────────────────────────
 * If your GitHub repository is called "bunnys-little-comfort-house",
 * your site will live at:
 *   https://YOUR-USERNAME.github.io/bunnys-little-comfort-house/
 * The text below MUST match the repository name exactly
 * (same spelling, same capital letters).
 *
 * If you deploy to a custom domain or a "username.github.io"
 * repository, change REPO_NAME to "" (an empty string).
 */
const REPO_NAME = "bunnys-little-comfort-house";

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // While you work locally ("npm run dev") the site is served from "/".
  // When you build for GitHub Pages ("npm run build"), and when you preview that
  // build ("npm run preview"), it uses the repository path.
  base: (command === "build" || isPreview) && REPO_NAME ? `/${REPO_NAME}/` : "/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
}));
