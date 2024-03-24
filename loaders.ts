import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";


/* Load all PDFs within the specified directory */
const directoryLoader = new DirectoryLoader(
  "docs_in/",
  {
    ".pdf": (path: string) => new PDFLoader(path),
  }
);

export const directoryLoaderDocs = await directoryLoader.load();

/* Cheerio: Web based loader */
const loader = new CheerioWebBaseLoader(
  "https://xyz.com/article"
);
export const webDocs = await loader.load();


