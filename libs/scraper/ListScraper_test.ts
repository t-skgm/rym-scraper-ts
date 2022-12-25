import { assertEquals, assertThrows } from "testing/asserts";
import { assertSnapshot } from "testing/snapshot";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

import { Page } from "./page/Page.ts";
import { ListScraper } from "../scraper/ListScraper.ts";

const htmlFile = await Deno.readTextFile(
  new URL("../../test/sample/rym_list_page_a1.html", import.meta.url)
);
const htmlFileBlocked = await Deno.readTextFile(
  new URL("../../test/sample/rym_security_check_required.html", import.meta.url)
);

const PAGE_URL = "https://rateyourmusic.com/list/foxbyrd/emo-encyclopedia";

mf.install();

Deno.test("成功", async (t) => {
  const scraper = ListScraper;
  const page = new Page(scraper, new URL(PAGE_URL + "/1/"));

  const result = scraper.run(htmlFile, page);

  await t.step("content.totalPageNum/currentPageNum", () => {
    assertEquals(result.content?.currentPageNum, 1);
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

Deno.test("アクセスブロック表示を察知する", () => {
  const scraper = ListScraper;
  const page = new Page(scraper, new URL(PAGE_URL + "/2/"));

  assertThrows(() => scraper.run(htmlFileBlocked, page));
});
