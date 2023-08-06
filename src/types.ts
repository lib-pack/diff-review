import { ESLint } from "eslint";

export interface Options {
	aiReviewer?: {
		apiKey: string;
		basePath: string;
		enabled?: boolean;
	};
	cwd?: string;
	eslintReviewer?: ESLint.Options;
}
