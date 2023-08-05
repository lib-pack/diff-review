// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "src/index.ts"),
			name: "DiffReview",
			// the proper extensions will be added
			fileName: "diff-review",
			formats: ["es", "umd"],
		},
		outDir: "lib",
		// rollupOptions: {
		// 	// 确保外部化处理那些你不想打包进库的依赖
		// 	external: ["vue"],
		// 	output: {
		// 		// 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
		// 		globals: {
		// 			vue: "Vue",
		// 		},
		// 	},
		// },
		sourcemap: true,
	},
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
