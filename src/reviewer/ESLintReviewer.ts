import { ESLint } from "eslint";
import { gitlogPromise } from "gitlog";
import merge from "lodash.merge";
import { join } from "path";

import {
	ReviewContext,
	ReviewOptions,
	ReviewResult,
	Reviewer,
} from "../Reviewer";

export class ESLintReviewer extends Reviewer {
	constructor(private eslintOptions?: ESLint.Options) {
		super();
	}
	async review(
		ctx: ReviewContext,
		source: string,
		target: string,
		options: ReviewOptions,
	): Promise<ReviewResult> {
		const cwd = options.cwd;

		const eslint = new ESLint(
			merge(
				{
					cwd,
					errorOnUnmatchedPattern: false,
					ignore: true,
					// ignorePath: join(cwd, ".eslintignore"),
					// overrideConfigFile: join(cwd, ".eslintrc.cjs"),
				},
				this.eslintOptions,
			) as ESLint.Options,
		);

		// Synchronous
		const commits = await gitlogPromise({
			// author: "Dom Harrington",
			// execOptions: { maxBuffer: 1000 * 1024 },
			// fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
			// number: 20,
			// repo: __dirname + "/test-repo-folder",
			branch: `${source}...${target}`,
			repo: cwd,
		});
		// console.log(commits);

		const matchFile: string[] = commits.flatMap((commit) =>
			commit.files.map((file) => join(cwd, file)),
		);

		const input: string[] = [];
		for (let i = 0; i < matchFile.length; i++) {
			const file = matchFile[i];
			if (!(await eslint.isPathIgnored(file))) {
				input.push(file);
			}
		}

		// console.log(input);

		// 2. 检查文件
		const results = await eslint.lintFiles(input);

		// 3. 格式化结果
		const formatter = await eslint.loadFormatter("unix");
		const resultText = await formatter.format(results);

		// console.log(resultText);

		return {
			input: input.join("\n"),
			message: resultText,
			reviewer: this,
		};
	}
}
