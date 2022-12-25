import { ScrapedPageNext, Scraper } from "./Scraper.ts";

export type PageBase<Content> = {
  scraper: Scraper<Content>;
  url: URL;
  next: ScrapedPageNext;
};
