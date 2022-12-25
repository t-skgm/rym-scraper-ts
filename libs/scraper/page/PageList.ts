import { Scraper } from "../../../domain/Scraper.ts";
import { Page, PageScrapeResult } from "./Page.ts";

export class PageList<Content>
  implements AsyncIterable<PageScrapeResult<Content>>
{
  currentPage: Page<Content>;

  constructor(readonly scraper: Scraper<Content>, initPage: Page<Content>) {
    this.currentPage = initPage;
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
        // do fetch & scrape
        const currentPageResult = await this.currentPage.scrape();

        if (currentPageResult.next.hasNext) {
          const nextPage = new Page<Content>(
            this.scraper,
            currentPageResult.next.url
          );
          this.currentPage = nextPage;

          return {
            done: false,
            value: currentPageResult,
          };
        } else {
          // 終了
          return {
            done: true,
            value: currentPageResult,
          };
        }
      },
    };
  }
}
