import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

export class Gpt {
	openai: OpenAIApi;
	constructor(apiKey: string, basePath: string) {
		const configuration = new Configuration({
			apiKey: apiKey,
			basePath: basePath,
		});
		this.openai = new OpenAIApi(configuration);
	}

	async run(code: string) {
		const messages = [
			{
				content:
					"我给你一个git diff log，你找出代码潜在的问题，或者给出优化建议，不用给出具体的修改后的代码，我写的代码一般都是js，你要讲汉语。",
				role: "system",
			},
			{
				content: code,
				role: "user",
			},
		] as ChatCompletionRequestMessage[];
		const chatCompletion = await this.openai.createChatCompletion({
			messages: messages,
			model: "gpt-3.5-turbo-16k",
			// model: "gpt-3.5-turbo-0613",
			n: 1,
		});

		const choice = chatCompletion.data.choices[0];
		if (choice) {
			const content = choice.message?.content;
			// console.log(content);
			return content;
		}
	}
}
