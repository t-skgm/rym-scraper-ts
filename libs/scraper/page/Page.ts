import { PageBase } from "../../../domain/PageBase.ts";
import { Scraper, ScrapedPageNext } from "../../../domain/Scraper.ts";
import { defaultFetcher } from "../../fetcher/Fetcher.ts";

export type PageScrapeResult<Content> = {
  content: Content | null;
  url: URL;
  nextUrl?: URL;
};

export class Page<Content> implements PageBase<Content> {
  constructor(
    readonly scraper: Scraper<Content>,
    readonly url: URL,
    nextUrl?: URL
  ) {
    this.next =
      nextUrl != null
        ? {
            hasNext: true,
            url: nextUrl,
          }
        : { hasNext: false };
  }

  next: ScrapedPageNext;

  // deno-lint-ignore require-await
  async scrape(): Promise<PageScrapeResult<Content>> {
    console.log("[page]", this.url.toString());
    // const body = await defaultFetcher.getText(this.url);
    const body = "<p>aaaaa</p>";
    const result = this.scraper.run(body, this);

    return {
      content: result.content,
      url: new URL(this.url.toString() + "a"),
      nextUrl: result.next.hasNext ? result.next.url : undefined,
    };
  }
}
