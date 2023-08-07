export default {
	aiReviewer: {
		token: process.env.GPT_TOKEN,
		api: process.env.GPT_API,
	},
	patter: ["**/*.ts", "!**/*.d.ts", "!**/*.spec.ts"],
};
