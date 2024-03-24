import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";

let vectorStore: any = '';

export async function faissDocumentVectorStore(splits, embeddingsModel = new OpenAIEmbeddings()) {
    vectorStore = await FaissStore.fromDocuments(splits, embeddingsModel);
    return vectorStore;
}

// Save the vector store to a directory
const directory = "persistence/";

await vectorStore.save(directory);

// Load the vector store from the same directory
export const loadedVectorStore = await FaissStore.load(
    directory,
    new OpenAIEmbeddings()
);
