import { parse } from "https://deno.land/std@0.66.0/flags/mod.ts";
import { ListScraper } from "./scraper/ListScraper.ts";
import { createListURLGeneratorFromString } from "./urlGenerator/ListURLGenerator.ts";
import { Logger } from "./utils/logger.ts";
import { ListCSVPresenter } from "./presenter/ListCSVPresenter.ts";
import { ListJSONPresenter } from "./presenter/ListJSONPresenter.ts";
import { ListWorker } from "./worker/ListWorker.ts";

const main = async ({ urlStr }: { urlStr: string }) => {
  Logger.info("[main] start");

  Logger.debug("[main] create url");
  const initialUrl = createListURLGeneratorFromString(urlStr).run();
  Logger.debug(`[main] url is: ${initialUrl.toString()}`);

  const worker = ListWorker.create({
    initialUrl,
    scraper: ListScraper,
    presenters: [
      { presenter: ListCSVPresenter, extension: "csv" },
      { presenter: ListJSONPresenter, extension: "json" },
    ],
  });

  try {
    // run scraper
    Logger.debug("[main] scraping started");
    await worker.scrape();
    Logger.debug("[main] scraping finished");

    // save to file(s)
    await worker.save();
    Logger.debug("[main] file(s) written");

    Logger.info("[main] finish all");
  } catch (err) {
    Logger.error("[main] Error occured on scraping...", err);
    Deno.exit(1);
  }
};

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["url"],
  });
  const urlStr = args.url as string | undefined;
  if (urlStr == null || urlStr.length === 0) {
    Logger.error("[args] No url");
    Deno.exit(1);
  }

  await main({ urlStr });
}
