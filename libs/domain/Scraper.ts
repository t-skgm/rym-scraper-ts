import { PageBase } from "./PageBase.ts";

export type Scraper<Content> = {
  run(html: string, currentPage: PageBase<Content>): ScrapeResult<Content>;
};

type ScrapeResult<Content> = {
  content: Content | null;
  next: ScrapedPageNext;
};

export type ScrapedPageNext =
  | {
      hasNext: true;
      url: URL;
    }
  | {
      hasNext: false;
    };
