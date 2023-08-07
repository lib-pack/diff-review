// vite.config.js
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "src/index.ts"),
			name: "DiffReview",
			// the proper extensions will be added
			fileName: "diff-review",
			formats: ["es", "cjs"],
		},
		minify: false,
		outDir: "lib",
		rollupOptions: {
			// 确保外部化处理那些你不想打包进库的依赖
			external: [
				"fs",
				"child_process",
				"path",
				"assert",
				"util",
				"os",
				"events",
				"stream",
				"module",
				"crypto",
				"url",
				"openai",
				"eslint",
				"gitlog",
				"lodash.merge",
				"matcher",
				"simple-git",
				"throat",
			],
		},
		sourcemap: true,
	},
	plugins: [dts()],
	test: {
		clearMocks: true,
		coverage: {
			all: true,
			exclude: ["lib"],
			include: ["src"],
			provider: "istanbul",
			reporter: ["html", "lcov"],
		},
		exclude: ["lib", "node_modules"],
		globals: true,
		setupFiles: ["console-fail-test/setup"],
		testTimeout: 20000,
	},
});
