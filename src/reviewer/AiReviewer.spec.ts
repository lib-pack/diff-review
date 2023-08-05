import { AiReviewer } from "./AiReviewer";
import { Gpt } from "./Gpt";

describe("AiReviewer.ts", () => {
	it("should review branch", async () => {
		const gpt = new Gpt(
			"sk-CPhSHyGhDJlPiZ8c8890C0E0D4294344A116B7A11fF88631",
			"http://8.219.209.161:9901/v1",
		);
		const aiReview = new AiReviewer(gpt);

		const result = await aiReview.review("test/b1", "test/b2");

		console.log(result);

		expect(result.message).toString();
	});
});
