import simpleGit from "simple-git";

import { ReviewContext, ReviewResult, Reviewer } from "../Reviewer";
import { Gpt } from "./Gpt";

export class AiReviewer extends Reviewer {
	constructor(public gpt: Gpt) {
		super();
	}

	async review(
		ctx: ReviewContext,
		source: string,
		target: string,
	): Promise<ReviewResult> {
		const input = await simpleGit().diff([source, target]);
		const message = await this.gpt.run(input);
		return {
			input,
			message: message ?? "",
			reviewer: this,
		};
	}
}
