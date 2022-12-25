import { Constants } from "../constants.ts";
import { ListPageContent } from "../domain/Content/ListContent.ts";
import { Presenter } from "../domain/Presenter.ts";
import { Worker, WorkerInput } from "../domain/Worker.ts";
import { Scraper } from "../domain/Scraper.ts";
import { PageList } from "../page/PageList.ts";
import { Logger } from "../utils/logger.ts";
import { sleep } from "../utils/sleep.ts";

export class ListWorker implements Worker {
  constructor(
    readonly initialUrl: URL,
    readonly scraper: Scraper<ListPageContent>,
    readonly presenters: {
      filenameBase?: string;
      extension: string;
      presenter: Presenter<ListPageContent>;
    }[]
  ) {}

  contents: ListPageContent[] = [];

  static create(input: WorkerInput<ListPageContent>) {
    return new ListWorker(input.initialUrl, input.scraper, input.presenters);
  }

  async scrape(): Promise<void> {
    Logger.debug("[worker] scrape started");

    // reset
    this.contents = [];

    const list = PageList.fromInitialURL(this.scraper, this.initialUrl);

    for await (const page of list) {
      if (page) {
        if (page.content) this.contents.push(page.content);
        await sleep(Constants.WAIT_MS_EACH_ACCESS);
      }
    }

    Logger.debug("[worker] scrape finished");
  }

  async save(): Promise<void> {
    const proms = this.presenters.map(
      async ({ filenameBase, extension, presenter }) => {
        const file = await Deno.open(
          `${filenameBase ?? "./out/"}${this.filenamePrefix()}.${extension}`,
          {
            write: true,
            create: true,
            truncate: true,
          }
        );
        await presenter.run(file, this.contents);
        file.close();
      }
    );

    await Promise.all(proms);
  }

  filenamePrefix() {
    const author = this.contents[0]?.author.text ?? "author";
    const title = this.contents[0]?.title.substring(0, 20) ?? "list";
    return `${author} - ${title}`;
  }
}
