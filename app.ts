import { loadDirectoryDocs } from "./loaders"
import { textSplitter } from "./splitters"
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";


async function main() {
    // Loader
    const docs = await loadDirectoryDocs();

    // Splitter
    const splits = await textSplitter.splitDocuments(docs);

    // Store
    const vectorStore = await FaissStore.fromDocuments(
        splits,
        new OpenAIEmbeddings()
    );

    // Save the vector store to a directory
    const directory = "your/directory/here";

    await vectorStore.save(directory);

    // Load the vector store from the same directory
    const loadedVectorStore = await FaissStore.load(
        directory,
        new OpenAIEmbeddings()
    );

    // Retrieve
    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });
    const retriever = MultiQueryRetriever.fromLLM({
        llm: model,
        retriever: vectorStore.asRetriever(),
        verbose: true,
    });

    const query = "Was ist Objekterkennung?";
    const retrievedDocs = await retriever.getRelevantDocuments(query);

    console.log(retrievedDocs);
}

// Execute the main async function
main().catch(console.error);







