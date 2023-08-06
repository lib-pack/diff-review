import { execSync } from "child_process";

import { ESLintReviewer } from "./ESLintReviewer";

describe("ESLintReview.ts", () => {
	const cwd = execSync("git rev-parse --show-toplevel").toString().trim();
	it("should review by eslint.", async () => {
		expect(
			await new ESLintReviewer({}).review(
				{ index: 0, results: [] },
				"feat/first",
				"main",
				{ cwd },
			),
		).toHaveProperty("message");
	});
});
