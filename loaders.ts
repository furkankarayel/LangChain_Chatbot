import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";


export async function loadDirectoryDocs() {
  const directoryLoader = new DirectoryLoader(
    "docs_in/",
    {
      ".pdf": (path: string) => new PDFLoader(path),
    }
  );
  return await directoryLoader.load();
}

/* Cheerio: Web based loader */
export async function loadWebDocs() {
  const loader = new CheerioWebBaseLoader("https://xyz.com/article");
  return await loader.load();
}

