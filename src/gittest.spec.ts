import gitlog from "gitlog";
import { simpleGit } from "simple-git";

describe("gitTools.ts", () => {
	it("should diff git logs", async () => {
		const options = {
			// author: "Dom Harrington",
			// execOptions: { maxBuffer: 1000 * 1024 },
			// fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
			// number: 20,
			// repo: __dirname + "/test-repo-folder",
			branch: "test/b1...test/b2",
			repo: __dirname,
		};

		// Synchronous
		const commits = gitlog(options);
		console.log(commits);

		const result = commits.map(async (commit) => {
			const diff = await simpleGit().show([commit.hash]);
			// console.log(diff);
			return {
				commit: commit.hash,
			};
		});

		const diff = await simpleGit().diff(["test/b1", "test/b2"]);
		console.log(diff);
	});
});
