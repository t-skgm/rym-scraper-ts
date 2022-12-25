import { parseHTML } from "linkedom";
import {
  ListItem,
  ListItemRelease,
  ListItemText,
  ListPageContent,
} from "../../domain/Content/ListContent.ts";
import { ScrapedPageNext, Scraper } from "../../domain/Scraper.ts";

export const ListScraper: Scraper<ListPageContent> = {
  run(html, page) {
    console.log("[scrape] start", page.url.toString());

    const { document: doc } = parseHTML(html, "text/html");

    const absoluteURL = (path: string | null | undefined) =>
      new URL(path ?? "", page.url);

    const contentWithoutItems = scrapeContentWithoutItems(doc);
    const listItems = scrapeContentItems(doc, absoluteURL);
    const next = scrapeNextUrl(doc, absoluteURL);

    return {
      content: {
        ...contentWithoutItems,
        listItems,
      },
      next,
    };
  },
};

const scrapeContentWithoutItems = (
  doc: Document
): Omit<ListPageContent, "listItems"> => {
  const title = doc.querySelector("title")?.textContent ?? "";
  const descriptionElm = doc?.querySelector(
    "#content h1 + p + p + p + div + span"
  );
  const totalPageNumNode = Array.from(
    doc?.querySelectorAll(".navspan > .navlinknum") ?? []
  ).at(-1);
  const totalPageNum = Number.parseInt(
    totalPageNumNode?.textContent ?? "1",
    10
  );

  return {
    title,
    description: {
      html: descriptionElm?.innerHTML ?? "",
      text: descriptionElm?.textContent ?? "",
    },
    totalPageNum,
  };
};

const scrapeContentItems = (
  doc: Document,
  urlGetter: (path: string | null | undefined) => URL
): ListPageContent["listItems"] => {
  const itemRows = Array.from(doc?.querySelectorAll("#user_list tr") ?? []);

  const listItems: ListItem[] = itemRows
    .filter((row) => {
      const classNameEmpty = row.className === "";
      const forSmallDevice =
        row.className.includes("show-for-small-table-row") ?? false;
      return !classNameEmpty && !forSmallDevice;
    })
    .map((row) => {
      const genericElm = row.querySelector(".generic_item");

      if (genericElm != null) {
        const releaseArt = row.querySelector(".list_art");
        return {
          art: releaseArt?.hasChildNodes()
            ? {
                src: `https:${
                  releaseArt.querySelector("img")?.getAttribute("data-src") ??
                  ""
                }`,
                url: urlGetter(
                  releaseArt.querySelector("a")?.getAttribute("src")
                ).toString(),
              }
            : undefined,
          title: genericElm.querySelector(".generic_title")?.textContent ?? "",
          description: {
            html: genericElm.querySelector(".generic_desc")?.innerHTML ?? "",
            text: genericElm.querySelector(".generic_desc")?.textContent ?? "",
          },
        } satisfies ListItemText;
      }

      const releaseArt = row.querySelector(".list_art");
      const entryElm = row.querySelector(".main_entry");
      const artistElm = entryElm?.querySelector("h2 > a");
      const releaseElm = entryElm?.querySelector("h3 > a");
      const releaseSubElm = entryElm?.querySelector("h3 > span");
      const descriptionElm = entryElm?.querySelector(":scope > span");

      return {
        art: releaseArt
          ? {
              src: `https:${
                releaseArt.querySelector("img")?.getAttribute("data-src") ?? ""
              }`,
              url: urlGetter(
                releaseArt.querySelector("a")?.getAttribute("src")
              ).toString(),
            }
          : undefined,
        artist: {
          text: artistElm?.innerHTML ?? "",
          url: urlGetter(artistElm?.getAttribute("href")).toString(),
        },
        release: {
          main: {
            text: releaseElm?.innerHTML ?? "",
            url: urlGetter(releaseElm?.getAttribute("href")).toString(),
          },
          sub: releaseSubElm?.textContent ?? undefined,
        },
        description: {
          html: descriptionElm?.textContent ?? "",
          text: descriptionElm?.textContent ?? "",
        },
      } satisfies ListItemRelease;
    });

  return listItems;
};

const scrapeNextUrl = (
  doc: Document,
  urlGetter: (path: string | null | undefined) => URL
): ScrapedPageNext => {
  const nextUrlStr =
    doc?.querySelector(".navlinknext")?.getAttribute("href") ?? undefined;
  console.log("nextUrlStr", nextUrlStr);

  return nextUrlStr != null && nextUrlStr.length !== 0
    ? {
        hasNext: true,
        url: urlGetter(nextUrlStr),
      }
    : { hasNext: false };
};
