import { ReviewResult, Reviewer } from "./Reviewer";
import { getCurrentBranch } from "./getCurrentBranch";
import { AiReviewer } from "./reviewer/AiReviewer";
import { ESLintReviewer } from "./reviewer/ESLintReviewer";
import { Gpt } from "./reviewer/Gpt";
import { Options } from "./types";

export async function diffReview(target: string, options: Options) {
	const current: string = await getCurrentBranch(options.cwd ?? process.cwd());
	Reviewer.register(new ESLintReviewer(options.eslintReviewer));

	if (options.aiReviewer && options.aiReviewer.enabled !== false) {
		Reviewer.register(
			new AiReviewer(new Gpt(options.aiReviewer.token, options.aiReviewer.api)),
		);
	}

	return await Reviewer.review(current, target, {
		cwd: options.cwd ?? process.cwd(),
		patter: options.patter,
	});
}

// 格式化输出为Md
export function formatReviewResult(
	result: ReviewResult[],
	options?: any,
): string {
	const formatted = result
		.filter((r) => r.status === "success")
		.map((r) => {
			return `## ${r.reviewer.constructor.name}\n\n${r.message}`;
		});

	return formatted.join("\n\n");
}
