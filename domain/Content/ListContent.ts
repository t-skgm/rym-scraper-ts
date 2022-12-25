import { HtmlText, ImageLink, TextLink } from "./common.ts";

export type ListPageContent = {
  title: string;
  description: HtmlText;
  currentPageNum: number;
  totalPageNum: number;
  listItems: ListItem[];
};

export type ListItem = ListItemText | ListItemRelease;

export type ListItemRelease = {
  art?: ImageLink;
  artist?: TextLink;
  release?: {
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
