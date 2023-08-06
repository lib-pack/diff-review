import { ReviewResult, Reviewer } from "./Reviewer";
import { AiReviewer } from "./reviewer/AiReviewer";
import { ESLintReviewer } from "./reviewer/ESLintReviewer";
import { Gpt } from "./reviewer/Gpt";
import { Options } from "./types";

export function diffReview(current: string, target: string, options: Options) {
	Reviewer.register(new ESLintReviewer(options.eslintReviewer));

	if (options.aiReviewer && options.aiReviewer.enabled !== false) {
		Reviewer.register(
			new AiReviewer(new Gpt(options.aiReviewer.token, options.aiReviewer.api)),
		);
	}

	return Reviewer.review(current, target, {
		cwd: options.cwd ?? process.cwd(),
	});
}

// 格式化输出为Md
export function formatReviewResult(
	result: ReviewResult[],
	options?: any,
): string {
	const formatted = result.map((r) => {
		return `## ${r.reviewer.constructor.name}\n\n${r.message}`;
	});

	return formatted.join("\n");
}
