import dotenv from 'dotenv';
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGroq } from "@langchain/groq";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import readline from 'readline';

dotenv.config();

// const model = new ChatOpenAI({
//     model: 'gpt-4o',
//     openAIApiKey: process.env.OPENAI_API_KEY
// });

// const model = new ChatAnthropic({
//   model: "claude-3-5-sonnet-20240620",
//   temperature: 0
// });

// const model = new ChatGroq({
//   model: "mixtral-8x7b-32768",
//   temperature: 0
// });

const model = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0
});

const systemTemplate = 'Translate the following into {language}:';

const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['user', '{text}'],
]);

const parser = new StringOutputParser();
const chain = promptTemplate.pipe(model).pipe(parser);

async function translate(text, language) {
    try {
        const result = await chain.invoke({ language, text });
        console.log(`Translation: ${result}`);
      } catch (error) {
        console.error("Error:", error);
      }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  while (true) {
    const language = await askQuestion("Enter the target language (or 'quit' to exit): ");
    if (language.toLowerCase() === 'quit') break;
    const text = await askQuestion("Enter the text to translate: ");
    await translate(text, language);
    console.log();
  }
  rl.close();
}

main();
