import { ListPageContent } from "./domain/Content/ListContent.ts";
import { PageList } from "./libs/scraper/page/PageList.ts";
import { ListScraper } from "./libs/Scraper/ListScraper.ts";
import { createListURLGenerator } from "./libs/URLGenerator/ListURLGenerator.ts";

const main = async () => {
  const initialUrl = createListURLGenerator({
    userId: "foxbyrd",
    listId: "emo-encyclopedia",
  }).run();
  const list = PageList.fromInitialURL(ListScraper, initialUrl);

  const contents: ListPageContent[] = [];
  for await (const page of list) {
    console.log(page.content);
    if (page.content) contents.push(page.content);
  }
  console.log("result", contents);
};

await main();
