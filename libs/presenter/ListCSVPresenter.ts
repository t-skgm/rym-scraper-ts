import { writeCSV } from "https://deno.land/x/csv@v0.8.0/mod.ts";
import {
  ListItem,
  ListItemRelease,
  ListPageContent,
} from "../domain/Content/ListContent.ts";
import { Presenter } from "../domain/Presenter.ts";

export const ListCSVPresenter: Presenter<ListPageContent> = {
  async run(file, contents) {
    const header = [
      "ArtistName",
      "ArtistUrl",
      "ReleaseName",
      "ReleaseUrl",
      "Description",
    ] as const;

    const rows = contents
      .flatMap((c) => c.listItems)
      .map((i) => {
        if (isListItemRelease(i)) {
          // "artistName", "artistUrl", "releaseName", "releaseUrl", "description"
          return [
            i.artist?.text ?? "",
            i.artist?.url ?? "",
            `${i.release?.main.text ?? ""}${
              i.release?.sub ? " " + i.release?.sub : ""
            }`,
            i.release?.main.url ?? "",
            i.description.text ?? "",
          ];
        }
        // ItemText
        return [i.title ?? "", "", "", "", i.description.text ?? ""];
      });

    await writeCSV(file, [header, ...rows]);
  },
};

const isListItemRelease = (i: ListItem): i is ListItemRelease => "artist" in i;
