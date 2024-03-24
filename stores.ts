import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";


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
