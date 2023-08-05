import { ESLintReviewer } from "./ESLintReviewer";

describe("ESLintReview.ts", () => {
	it("should review by eslint.", async () => {
		expect(await new ESLintReviewer().review("test/b1", "test/b2"))
			.toMatchInlineSnapshot(`
			{
			  "input": "",
			  "message": "",
			}
		`);
	});
});
