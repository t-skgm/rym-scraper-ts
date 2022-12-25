import { assertEquals } from "testing/asserts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

import { Scraper } from "../domain/Scraper.ts";
import { Page } from "./Page.ts";

mf.install();
mf.mock("/path", () => new Response("mocked html", { status: 200 }));

Deno.test("Page", async (t) => {
  const mockScraper: Scraper<{ html: string }> = {
    run(html, _page) {
      return { content: { html }, next: { hasNext: false } };
    },
  };

  const mockUrl = new URL("https://example.com/path");

  const page = new Page(mockScraper, mockUrl);

  await t.step("props", () => {
    assertEquals(page.url, mockUrl);
    assertEquals(page.scraper, mockScraper);
  });

  await t.step("fetchAndScrape()", async () => {
    const res = await page.fetchAndScrape();
    assertEquals(res.content, { html: "mocked html" });
    assertEquals(res.next, { hasNext: false });
    assertEquals(res.url, mockUrl);
  });
});
