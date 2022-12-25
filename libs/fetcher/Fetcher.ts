import { Constants } from "../../constants.ts";
import { Fetcher } from "../../domain/Fetcher.ts";

export const defaultFetcher: Fetcher = {
  async getText(url) {
    const req = new Request(url, {
      headers: {
        "user-agent": Constants.FETCH_UA,
      },
    });
    const result = await fetch(req);

    const text = await result.text();
    return text;
  },
};
