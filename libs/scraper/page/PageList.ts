import { Scraper } from "../../../domain/Scraper.ts";
import { Page, PageScrapeResult } from "./Page.ts";

export class PageList<Content>
  implements AsyncIterable<PageScrapeResult<Content>>
{
  currentPage: Page<Content>;

  constructor(readonly scraper: Scraper<Content>, init: Page<Content>) {
    this.currentPage = init;
  }

  static fromInitialURL<Content>(scraper: Scraper<Content>, initURL: URL) {
    const initPage = new Page(scraper, initURL);
    return new PageList(scraper, initPage);
  }

  [Symbol.asyncIterator]() {
    return {
      scraper: this.scraper,
      currentPage: this.currentPage,

      async next() {
        const scrapeResult = await this.currentPage.scrape();

        const page = new Page<Content>(
          this.scraper,
          scrapeResult.url,
          scrapeResult.nextUrl
        );
        this.currentPage = page;

        return {
          done: !page.next.hasNext,
          value: scrapeResult,
        };
      },
    };
  }
}
