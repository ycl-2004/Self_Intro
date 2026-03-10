var _a, _b, _c;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
var repoName = (_b = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split("/")[1]) !== null && _b !== void 0 ? _b : "";
var defaultBase = process.env.GITHUB_ACTIONS === "true" && repoName ? "/".concat(repoName, "/") : "/";
export default defineConfig({
    plugins: [react()],
    base: (_c = process.env.VITE_BASE_PATH) !== null && _c !== void 0 ? _c : defaultBase,
});
