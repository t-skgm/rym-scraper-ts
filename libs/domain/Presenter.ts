export type Presenter<Content> = {
  run(file: Deno.FsFile, contents: Content[]): Promise<void>;
};
