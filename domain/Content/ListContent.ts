export type ListPageContent = {
  title: string;
  description: HtmlText;
  totalPageNum: number;
  listItems: ListItem[];
};

export type ListItem = ListItemText | ListItemRelease;

export type ListItemRelease = {
  art?: ImageLink;
  artist: TextLink;
  release: {
    main: TextLink;
    sub?: string;
  };
  description: HtmlText;
};

export type ListItemText = {
  art?: ImageLink;
  title: string;
  description: HtmlText;
};

export type TextLink = {
  text: string;
  url: string;
};

export type ImageLink = {
  src: string;
  url: string;
};

export type HtmlText = {
  html: string;
  text: string;
};
