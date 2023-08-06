import { AiReviewer } from "./AiReviewer";
import { Gpt } from "./Gpt";

describe("AiReviewer.ts", () => {
	it("should review branch", async () => {
		const gpt = new Gpt(process.env.GPT_TOKEN || "", process.env.GPT_API || "");
		const aiReview = new AiReviewer(gpt);

		const result = await aiReview.review(
			{ index: 0, results: [] },
			"test/b1",
			"test/b2",
		);

		console.log(result);

		expect(result.message).toString();
	});
});
