import { ListPageContent } from "./domain/Content/ListContent.ts";
import { PageList } from "./libs/scraper/page/PageList.ts";
import { ListScraper } from "./libs/scraper/ListScraper.ts";
import { createListURLGenerator } from "./libs/URLGenerator/ListURLGenerator.ts";
import { sleep } from "./libs/utils/sleep.ts";

const main = async () => {
  const initialUrl = createListURLGenerator({
    userId: "foxbyrd",
    listId: "emo-encyclopedia",
  }).run();
  const list = PageList.fromInitialURL(ListScraper, initialUrl);

  const contents: ListPageContent[] = [];
  for await (const page of list) {
    // console.log(page.content);
    if (page.content) contents.push(page.content);
    await sleep(1000);
  }
  console.log("result", contents);
};

await main();
