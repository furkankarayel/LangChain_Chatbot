import "cheerio";
import { directoryLoaderDocs } from "./loaders"
import { textSplitter } from "./splitters"
import { faissDocumentVectorStore } from "./stores"
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChainTool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { DynamicTool } from "@langchain/core/tools";
import { VectorDBQAChain } from "langchain/chains";
import { ChatPromptTemplate, MessagesPlaceholder, } from "@langchain/core/prompts";
const MEMORY_KEY = "chat_history";
// Loader
const docs = directoryLoaderDocs

// Splitter
const splits = textSplitter.splitDocuments(docs);

// Store
const vectorStore = await faissDocumentVectorStore(splits);

// Retrieve and generate using the relevant snippets of the blog.
const model = new OpenAI({ temperature: 0 });
const chain = VectorDBQAChain.fromLLM(model, vectorStore);

const qaTool = new ChainTool({
    name: "state-of-union-qa",
    description:
        "State of the Union QA - useful for when you need to ask questions about the most recent state of the union address.",
    chain: chain,
});


const tools = [new Calculator(), qaTool];

const memoryPrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are very powerful assistant, but bad at calculating lengths of words.",
    ],
    new MessagesPlaceholder(MEMORY_KEY),
    ["user", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
]);

const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent"
);
const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });

const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
});
console.log("Loaded agent.");

