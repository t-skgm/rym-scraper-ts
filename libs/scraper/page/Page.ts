import { PageBase } from "../../../domain/PageBase.ts";
import { Scraper } from "../../../domain/Scraper.ts";
import { defaultFetcher } from "../../fetcher/Fetcher.ts";
import { Logger } from "../../utils/logger.ts";

export type PageScrapeResult<Content> = {
  content: Content | null;
  url: URL;
  next: { hasNext: false } | { hasNext: true; url: URL };
};

export class Page<Content> implements PageBase<Content> {
  constructor(readonly scraper: Scraper<Content>, readonly url: URL) {}

  async fetchAndScrape(): Promise<PageScrapeResult<Content>> {
    Logger.debug(`[page] ${this.url.toString()}`);
    const body = await defaultFetcher.getText(this.url);
    const result = this.scraper.run(body, this);

    return {
      content: result.content,
      url: this.url,
      next: result.next,
    };
  }
}
