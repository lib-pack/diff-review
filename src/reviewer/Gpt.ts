import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

import { PR_PROMPT } from "../prompt/PR_PROMPT";

export class Gpt {
	openai: OpenAIApi;
	constructor(
		apiKey: string,
		basePath: string,
		private prompt: string = PR_PROMPT,
	) {
		const configuration = new Configuration({
			apiKey: apiKey,
			basePath: basePath,
		});
		this.openai = new OpenAIApi(configuration);
	}

	async run(code: string) {
		const messages = [
			{
				content: this.prompt,
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
