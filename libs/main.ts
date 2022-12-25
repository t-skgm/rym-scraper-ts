import { Args, parse } from "https://deno.land/std@0.66.0/flags/mod.ts";
import { ListPageContent } from "./domain/Content/ListContent.ts";
import { PageList } from "./page/PageList.ts";
import { ListScraper } from "./scraper/ListScraper.ts";
import { createListURLGeneratorFromString } from "./urlGenerator/ListURLGenerator.ts";
import { sleep } from "./utils/sleep.ts";
import { Logger } from "./utils/logger.ts";
import { Constants } from "./constants.ts";
import { ListCSVPresenter } from "./presenter/ListCSVPresenter.ts";
import { ListJSONPresenter } from "./presenter/ListJSONPresenter.ts";

const main = async ({ urlStr }: { urlStr: string }) => {
  Logger.info("[main] start");

  Logger.debug("[main] create url");
  const initialUrl = createListURLGeneratorFromString(urlStr).run();
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

    const fileCSV = await Deno.open("./out/list.csv", {
      write: true,
      create: true,
      truncate: true,
    });
    await ListCSVPresenter.run(fileCSV, contents);
    fileCSV.close();

    const fileJson = await Deno.open("./out/list.json", {
      write: true,
      create: true,
      truncate: true,
    });
    await ListJSONPresenter.run(fileJson, contents);
    fileJson.close();

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
  const url = args.url as string | undefined;
  if (url == null || url.length === 0) {
    Logger.error("[args] No url");
    Deno.exit(1);
  }

  await main({ urlStr: url });
}
