import { Command } from "commander";
import { cosmiconfig } from "cosmiconfig";

import {
	diffRank,
	diffReview,
	formatReviewResult,
	version,
} from "../lib/diff-review.js";
const program = new Command();
// program.allowUnknownOption(true);

const explorer = cosmiconfig("diff-review");

program
	.name("diff-review")
	.description("CLI tool for reviewing code changes")
	.version(version);

program
	.command("review")
	.argument("[branch]", "diff branch name", "main")
	.option("-c, --cwd <path>", "current working directory")
	.option("-p, --patter <glob>", "file pattern")
	.option("--config <path>", "config path")
	.action(async (target, opts) => {
		const config = await explorer.search().then((r) => r?.config);

		const dr = await diffReview(
			target,
			Object.assign(Object.assign({}, config), opts),
		);
		const out = formatReviewResult(dr, opts);
		console.log(out);
	});

program
	.command("rank")
	.argument("<source>", "diff branch name")
	.argument("<target>", "diff branch name")
	.option("-c, --cwd <path>", "current working directory")
	.option("-p, --patter <glob>", "file pattern")
	.option("--config <path>", "config path")
	.action(async (source, target, opts) => {
		const config = await explorer.search().then((r) => r?.config);
		diffRank(source, target, Object.assign(Object.assign({}, config), opts));
	});

// program
// 	.command("split")
// 	.description("Split a string into substrings and display as an array")
// 	.argument("<string>", "string to split")
// 	.option("--first", "display just the first substring")
// 	.option("-s, --separator <char>", "separator character", ",")
// 	.action((str, options) => {
// 		const limit = options.first ? 1 : undefined;
// 		console.log(str.split(options.separator, limit));
// 	});

program.parseAsync();
