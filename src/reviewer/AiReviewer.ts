import { gitlogPromise } from "gitlog";
import { isMatch } from "matcher";
import simpleGit from "simple-git";
import throat from "throat";

import {
	ReviewContext,
	ReviewOptions,
	ReviewResult,
	Reviewer,
} from "../Reviewer";
import { Gpt } from "./Gpt";

export class AiReviewer extends Reviewer {
	constructor(public gpt: Gpt) {
		super();
	}

	async review(
		ctx: ReviewContext,
		source: string,
		target: string,
		{ cwd, patter = ["*"] }: ReviewOptions,
	): Promise<ReviewResult> {
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

		const matchFile: string[] = commits
			.flatMap((commit) =>
				commit.files.map((file) => file /* join(cwd, file) */),
			)
			.filter((file) => isMatch(file, patter));

		let input = "";
		let message = "";

		await Promise.all(
			matchFile.map(
				throat(5, async (file: string) => {
					try {
						const diff = await simpleGit().diff([source, target, file]);
						input += diff + "\n";
						const result = await this.gpt.run(diff);
						message += `**${file}**\n\n${result}` + "\n\n";
						// console.log(file, result);
					} catch (error) {}
				}),
			),
		);

		// const input = await simpleGit().diff([source, target]);
		// const message = await this.gpt.run(input);
		return {
			input,
			message: message ?? "",
			reviewer: this,
		};
	}
}
