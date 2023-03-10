import { Presenter } from "../domain/Presenter.ts";
import { Scraper } from "../domain/Scraper.ts";

export type Worker = {
  scrape(): Promise<void>;
  save(): Promise<void>;
};

export type WorkerInput<Content> = {
  initialUrl: URL;
  scraper: Scraper<Content>;
  presenters: {
    filenameBase?: string;
    extension: string;
    presenter: Presenter<Content>;
  }[];
};
