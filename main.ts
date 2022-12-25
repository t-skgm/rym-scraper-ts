import { Args, parse } from "https://deno.land/std@0.66.0/flags/mod.ts";
import { ListPageContent } from "./domain/Content/ListContent.ts";
import { PageList } from "./libs/scraper/page/PageList.ts";
import { ListScraper } from "./libs/scraper/ListScraper.ts";
import { createListURLGeneratorFromString } from "./libs/URLGenerator/ListURLGenerator.ts";
import { sleep } from "./libs/utils/sleep.ts";

const main = async (args: Args) => {
  const url = args.url as string | undefined;
  if (url == null || url.length === 0) {
    console.error("[args] No url");
    Deno.exit(1);
  }

  const initialUrl = createListURLGeneratorFromString(url).run();
  const list = PageList.fromInitialURL(ListScraper, initialUrl);

  const contents: ListPageContent[] = [];
  for await (const page of list) {
    console.log(page?.content);
    if (page?.content) contents.push(page.content);
    await sleep(1000);
  }
  console.log("result", contents);
};

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["url"],
  });

  await main(args);
}
