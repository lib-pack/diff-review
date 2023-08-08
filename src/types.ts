import { ESLint } from "eslint";

export interface Options {
	aiReviewer?: {
		api: string;
		enabled?: boolean;
		prompt?: string;
		token: string;
	};
	cwd?: string;
	eslintReviewer?: ESLint.Options;
	patter?: string[];
}
