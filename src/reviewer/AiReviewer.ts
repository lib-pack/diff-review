import simpleGit from "simple-git";

import { Reviewer } from "../Reviewer";
import { Gpt } from "./Gpt";

export class AiReviewer extends Reviewer {
	constructor(public gpt: Gpt) {
		super();
	}

	async review(source: string, target: string) {
		const input = await simpleGit().diff([source, target]);
		const message = await this.gpt.run(input);
		return {
			input,
			message: message ?? "",
		};
	}
}
