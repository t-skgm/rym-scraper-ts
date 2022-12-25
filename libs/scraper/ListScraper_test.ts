import { assertEquals } from "testing/asserts";
import { assertSnapshot } from "testing/snapshot";

import { Page } from "./page/Page.ts";
import { ListScraper } from "../scraper/ListScraper.ts";

const htmlFile = await Deno.readTextFile(
  new URL("../../test/sample/foxbyrd_emo-encyclopedia_1.html", import.meta.url)
);

const PAGE_URL = "https://rateyourmusic.com/list/foxbyrd/emo-encyclopedia";

Deno.test("成功", async (t) => {
  const scraper = ListScraper;
  const page = new Page(scraper, new URL(PAGE_URL + "/1/"));

  const result = scraper.run(htmlFile, page);

  await t.step("content.totalPageNum", () => {
    assertEquals(result.content?.totalPageNum, 27);
  });

  await t.step("content.items", async () => {
    await assertSnapshot(t, result.content?.listItems);
    // await assertSnapshot(t, result.content?.listItems[0]);
    // await assertSnapshot(t, result.content?.listItems[1]);
    // await assertSnapshot(t, result.content?.listItems[2]);
    // await assertSnapshot(t, result.content?.listItems[3]);
  });

  await t.step("content.title/description", async () => {
    await assertSnapshot(t, result.content?.title);
    await assertSnapshot(t, result.content?.description);
  });

  await t.step("next", () => {
    assertEquals(result.next.hasNext, true);
    if (result.next.hasNext) {
      assertEquals(result.next.url, new URL(PAGE_URL + "/2/"));
    }
  });
});
