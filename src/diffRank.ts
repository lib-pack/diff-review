import * as espree from "espree";
import { writeFileSync } from "fs";
import { gitlogPromise } from "gitlog";
import { isMatch } from "matcher";
import simpleGit from "simple-git";
import throat from "throat";

import { RANK_PROMPT } from "./prompt/RANK_PROMPT";
import { Gpt } from "./reviewer/Gpt";

export async function diffRank(source: string, target: string, options: any) {
	// console.log(source, target, options);

	const commits = await gitlogPromise({
		// author: "Dom Harrington",
		// execOptions: { maxBuffer: 1000 * 1024 },
		// fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
		// number: 20,
		// repo: __dirname + "/test-repo-folder",
		branch: `${source}...${target}`,
		repo: process.cwd(),
		number: 5000,
	});

	// console.log(commits);

	const matchCommit = commits.filter((p) => {
		return (
			isMatch(p.files, options.patter) &&
			p.subject &&
			options.commitPatter &&
			isMatch(p.subject, options.commitPatter)
		);
	});

	const groupByAuthor = matchCommit.reduce<any>((acc, cur) => {
		if (!acc[cur.authorName]) {
			acc[cur.authorName] = [];
		}

		acc[cur.authorName].push(cur);
		return acc;
	}, {});

	// console.log(groupByAuthor);

	const rankResult = [];
	for (const author in groupByAuthor) {
		const commits = groupByAuthor[author];
		// console.log("------------------------");
		const result = [];
		result.push(`## Author: ${author}`);
		const codes = [];
		for (const commit of commits) {
			result.push(`### ${commit.subject} ${commit.hash}`);
			const git = simpleGit();
			const diff = await git.show(commit.hash);
			const diffLines = diff.split("\n");
			let ignore = false;
			let open = false;
			let path = "";
			let code: any[] = [];
			diffLines.forEach((line) => {
				if (line.startsWith("+++") && ignore) {
					ignore = false;
				}

				if (line.startsWith("+++") && !isMatch(line, options.patter)) {
					ignore = true;
				}

				if (ignore) {
					return;
				}

				if (line.startsWith("@@")) {
					if (open) {
						result.push("```");
						codes.push({
							path,
							code,
							hash: commit.hash,
							commit: commit.subject,
						});
						code = [];
					}

					result.push("```js");

					open = true;
				} else if (line.startsWith("+++")) {
					if (open) {
						result.push("```");
						open = false;
						codes.push({
							path,
							code,
							hash: commit.hash,
							commit: commit.subject,
						});
						code = [];
					}

					result.push(`#### ${line.slice(6)}`);
					path = line.slice(6);
				} else if (line.startsWith("+")) {
					result.push(`${line.slice(1)}`);
					code.push(`${line.slice(1)}`);
				}
			});
			if (open) {
				result.push("```");
				codes.push({
					path,
					code: code,
					hash: commit.hash,
					commit: commit.subject,
				});
				code = [];
			}
		}

		const filterCodes = codes.filter((c) => {
			const validLines = c.code.filter((l) => {
				const t = l.trim();
				return t.length > 0 && !t.startsWith("//") && !t.startsWith("/*");
			});
			if (validLines.length < 5) {
				return false;
			}

			if (
				/\w.*?\(.*?\).*\{/.test(c.code[0]) &&
				/\}.*,/.test(c.code[c.code.length - 1])
			) {
				return true;
			}

			try {
				const parsed = espree.parse(c.code.join("\n"), {
					ecmaVersion: 6,
				});
			} catch (error) {
				return false;
			}

			return true;
		});
		const md: string[] = [];
		let resultRemarks = [];
		let resultResponse = "";
		let resultRelated = new Set();
		if (filterCodes.length > 0) {
			// md.push(`### ${commit.subject} (HASH ${commit.hash})`);
			// console.log(filterCodes);
			filterCodes.forEach((c) => {
				resultRelated.add(c.hash);
				md.push("### FILE", c.path);
				md.push("```js");
				md.push(c.code.join("\n"));
				md.push("```");
			});

			resultRelated = Array.from(resultRelated) as any;

			const aiReview = async () => {
				const gpt = new Gpt(
					options.aiReviewer.token,
					options.aiReviewer.api,
					RANK_PROMPT,
				);
				const content = "代码片段:\n\n" + md.join("\n");
				const response = await gpt.run(content, options.model);

				const matchJSON = response?.match(/\[[\s\S]*?\]/g);

				const result = matchJSON?.reduce((acc, cur) => {
					try {
						const json = JSON.parse(cur);
						acc.push(...json);
					} catch (error) {
						console.log("### ERROR ###");
						console.log(cur);
						console.log(response);
					}

					return acc;
				}, [] as any[]);

				return {
					response,
					result,
				};
			};

			// console.log(`### ${commit.subject} (HASH ${commit.hash})`);
			let i = 0;
			while (true) {
				const { result = [], response = "" } = await aiReview();

				i++;

				if (result.length > 0) {
					resultRemarks = result;
					resultResponse = response;
					break;
				}

				if (i > 10) {
					break;
				}
			}

			console.log([author]);
			// console.log(resultResponse);
			console.log(resultRemarks);
			console.log(resultRelated);
			resultRemarks = resultRemarks.filter((r) => {
				return (
					r.score !== 0 &&
					!/缩进|未定义|格式|空格|没有定义|变量未|addEvent/.test(r.comment)
				);
			});
			const avg =
				resultRemarks.reduce((acc, cur) => {
					acc += cur.score;
					return acc;
				}, 0) / resultRemarks.length;
			rankResult.push({
				score: avg,
				author,
				resultRemarks,
				resultResponse,
				resultRelated,
			});
		}
	}

	rankResult.sort((a, b) => {
		return b.score - a.score;
	});
	if (options?.reportDist) {
		writeFileSync(options.reportDist, JSON.stringify(rankResult, null, 2));
	}

	return rankResult;
}
