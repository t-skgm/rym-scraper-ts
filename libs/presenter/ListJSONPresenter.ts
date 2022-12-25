import { ListPageContent } from "../domain/Content/ListContent.ts";
import { Presenter } from "../domain/Presenter.ts";
import { omit } from "rambda";

export const ListJSONPresenter: Presenter<ListPageContent> = {
  async run(file, contents) {
    const base = omit(["listItems"], contents[0]);
    const listItems = contents.flatMap((c) => c.listItems);
    const json = { ...base, listItems };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(json));
    await file.write(data);
  },
};
