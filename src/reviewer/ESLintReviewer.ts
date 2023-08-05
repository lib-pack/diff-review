import { ESLint } from "eslint";
import { existsSync } from "fs";
import { gitlogPromise } from "gitlog";
import { resolve } from "path";

import { ReviewResult, Reviewer } from "../Reviewer";

export class ESLintReviewer extends Reviewer {
	async review(source: string, target: string): Promise<ReviewResult> {
		const options = {
			// author: "Dom Harrington",
			// execOptions: { maxBuffer: 1000 * 1024 },
			// fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
			// number: 20,
			// repo: __dirname + "/test-repo-folder",
			branch: `${source}...${target}`,
			repo: process.cwd(),
		};

		// Synchronous
		const commits = await gitlogPromise(options);

		const input = commits.flatMap((commit) =>
			commit.files
				.map((file) => resolve(process.cwd(), file))
				.filter((file) => {
					existsSync(file);
				}),
		);
		const eslint = new ESLint();

		// 2. 检查文件
		const results = await eslint.lintFiles(input);

		// 3. 格式化结果
		const formatter = await eslint.loadFormatter("stylish");
		const resultText = await formatter.format(results);

		return {
			input: input.join("\n"),
			message: resultText,
		};
	}
}
