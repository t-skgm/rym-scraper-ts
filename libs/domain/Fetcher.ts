export type Fetcher = {
  getText(url: URL): Promise<string>;
};
