export abstract class Reviewer {
	static reviewers: Reviewer[] = [];
	static register(reviewer: Reviewer) {
		Reviewer.reviewers.push(reviewer);
	}
	static async review(
		source: string,
		target: string,
		options: ReviewOptions,
	): Promise<ReviewResult[]> {
		// const results = await Promise.all(
		// 	Reviewer.reviewers.map(async (reviewer) => {
		// 		const result = await reviewer.review(source, target, options);
		// 		return result;
		// 	}),
		// );
		// return results.flat();

		const results: ReviewResult[] = [];
		for (let i = 0; i < Reviewer.reviewers.length; i++) {
			const reviewer = Reviewer.reviewers[i];
			results.push(
				await reviewer.review({ index: i, results }, source, target, options),
			);
		}

		return results;
	}

	abstract review(
		ctx: ReviewContext,
		source: string,
		target: string,
		options: ReviewOptions,
	): Promise<ReviewResult>;
}

export interface ReviewResult {
	input: string;
	message: string;
	reviewer: Reviewer;
}

export interface ReviewOptions {
	cwd: string;
}

export interface ReviewContext {
	index: number;
	results: ReviewResult[];
}
