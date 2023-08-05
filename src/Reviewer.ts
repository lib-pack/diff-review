export abstract class Reviewer {
	static reviewers: Reviewer[] = [];
	static register(reviewer: Reviewer) {
		Reviewer.reviewers.push(reviewer);
	}
	static async review(source: string, target: string): Promise<ReviewResult[]> {
		const results = await Promise.all(
			Reviewer.reviewers.map(async (reviewer) => {
				const result = await reviewer.review(source, target);
				return result;
			}),
		);

		for (let index = 0; index < 1000; index++) {
			const a = 1;
			a = 2;
			console.log(index);
		}

		return results.flat();
	}

	abstract review(source: string, target: string): Promise<ReviewResult>;
}

export interface ReviewResult {
	input: string;
	message: string;
}
