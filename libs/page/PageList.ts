import { Scraper } from "../domain/Scraper.ts";
import { Page, PageScrapeResult } from "./Page.ts";

export class PageList<Content>
  implements AsyncIterable<PageScrapeResult<Content> | undefined>
{
  pageToScrape: Page<Content>;

  constructor(readonly scraper: Scraper<Content>, initPage: Page<Content>) {
    this.pageToScrape = initPage;
  }

  static fromInitialURL<Content>(scraper: Scraper<Content>, initURL: URL) {
    const initPage = new Page(scraper, initURL);
    return new PageList(scraper, initPage);
  }

  [Symbol.asyncIterator]() {
    return {
      scraper: this.scraper,
      pageToScrape: this.pageToScrape as Page<Content> | undefined,

      async next() {
        if (this.pageToScrape === undefined) {
          return {
            done: true,
            value: undefined,
          };
        }

        const pageToScrapeResult = await this.pageToScrape.fetchAndScrape();

        if (pageToScrapeResult.next.hasNext) {
          const nextPage = new Page<Content>(
            this.scraper,
            pageToScrapeResult.next.url
          );
          this.pageToScrape = nextPage;
        } else {
          this.pageToScrape = undefined;
        }

        return {
          done: false,
          value: pageToScrapeResult,
        };
      },
    };
  }
}
