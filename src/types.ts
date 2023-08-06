import { ESLint } from "eslint";

export interface Options {
	aiReviewer?: {
		api: string;
		enabled?: boolean;
		token: string;
	};
	cwd?: string;
	eslintReviewer?: ESLint.Options;
}
