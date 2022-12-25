import { Args, parse } from "https://deno.land/std@0.66.0/flags/mod.ts";
import { ListPageContent } from "./domain/Content/ListContent.ts";
import { PageList } from "./libs/scraper/page/PageList.ts";
import { ListScraper } from "./libs/scraper/ListScraper.ts";
import { createListURLGeneratorFromString } from "./libs/URLGenerator/ListURLGenerator.ts";
import { sleep } from "./libs/utils/sleep.ts";
import { Logger } from "./libs/utils/logger.ts";
import { Constants } from "./constants.ts";

const main = async (args: Args) => {
  const url = args.url as string | undefined;
  if (url == null || url.length === 0) {
    Logger.error("[args] No url");
    Deno.exit(1);
  }

  Logger.info("[main] start");

  Logger.debug("[main] create url");
  const initialUrl = createListURLGeneratorFromString(url).run();
  Logger.debug(`[main] url is: ${initialUrl.toString()}`);

  Logger.debug("[main] page iterating");
  const list = PageList.fromInitialURL(ListScraper, initialUrl);
  const contents: ListPageContent[] = [];
  try {
    for await (const page of list) {
      if (page) {
        // Logger.debug(page.content);
        if (page.content) contents.push(page.content);
        await sleep(Constants.WAIT_MS_EACH_ACCESS);
      }
    }

    Logger.debug("[main] scrape finished");

    const data = JSON.stringify(contents);
    await Deno.writeTextFile("./out/out.json", data);
    Logger.debug("[main] file written");

    Logger.info("[main] finish");
  } catch (err) {
    Logger.error("[main] Error occured on scraping...", err);
    Deno.exit(1);
  }
};

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["url"],
  });
  await main(args);
}
