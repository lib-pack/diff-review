import { Reviewer } from "./Reviewer";
import { AiReviewer } from "./reviewer/AiReviewer";
import { ESLintReviewer } from "./reviewer/ESLintReviewer";
import { Gpt } from "./reviewer/Gpt";

export function diffReview(current: string, target: string, options: Options) {
	Reviewer.register(new ESLintReviewer());

	if (options.aiReviewer && options.aiReviewer.enabled !== false) {
		Reviewer.register(
			new AiReviewer(
				new Gpt(options.aiReviewer.apiKey, options.aiReviewer.basePath),
			),
		);
	}

	return Reviewer.review(current, target);
}

export interface Options {
	aiReviewer?: {
		apiKey: string;
		basePath: string;
		enabled?: boolean;
	};
}
