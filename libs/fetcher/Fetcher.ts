import { Fetcher } from "../../domain/Fetcher.ts";

export const defaultFetcher: Fetcher = {
  async getText(url) {
    const result = await fetch(url);
    const text = await result.text();
    return text;
  },
};
