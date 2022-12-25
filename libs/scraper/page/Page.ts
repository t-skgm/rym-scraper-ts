import { PageBase } from "../../../domain/PageBase.ts";
import { Scraper } from "../../../domain/Scraper.ts";
import { defaultFetcher } from "../../fetcher/Fetcher.ts";

export type PageScrapeResult<Content> = {
  content: Content | null;
  url: URL;
  next: { hasNext: false } | { hasNext: true; url: URL };
};

export class Page<Content> implements PageBase<Content> {
  constructor(readonly scraper: Scraper<Content>, readonly url: URL) {}

  // deno-lint-ignore require-await
  async scrape(): Promise<PageScrapeResult<Content>> {
    console.log("[page]", this.url.toString());
    const body = await defaultFetcher.getText(this.url);
    const result = this.scraper.run(body, this);

    return {
      content: result.content,
      url: this.url,
      next: result.next,
    };
  }
}
