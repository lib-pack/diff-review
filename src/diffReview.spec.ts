import { execSync } from "child_process";
import { isMatch } from "matcher";

import { diffReview, formatReviewResult } from "./diffReview";

describe("diffReview.ts", () => {
	const cwd = execSync("git rev-parse --show-toplevel").toString().trim();

	it("should format result", async () => {
		const result = await diffReview("main", {
			cwd,
			patter: ["!*/**/*.spec.ts", "*/**/*.ts"],
			aiReviewer: {
				api: process.env.GPT_API || "",
				token: process.env.GPT_TOKEN || "",
			},
		});

		expect(result).toHaveProperty("length");

		const formatted = formatReviewResult(result);

		console.log(formatted);

		expect(formatted).toContain("## ESLintReviewer");
	});
});
