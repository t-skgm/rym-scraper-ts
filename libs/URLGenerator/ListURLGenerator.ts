import { Constants } from "../../constants.ts";
import { URLGenerator } from "../../domain/URLGenerator.ts";

type ListURLGeneratorInput = {
  /** ID of user */
  userId: string;
  /** ID of list */
  listId: string;
  /** Number of page position. default: 1 */
  pageNum?: number;
};

const LIST_PATH = "/list";

export const createListURLGenerator = (
  input: ListURLGeneratorInput
): URLGenerator => {
  return {
    run() {
      // https://rateyourmusic.com/list/${userId}/${listId}/${pageNum}/
      // ex: https://rateyourmusic.com/list/foxbyrd/emo-encyclopedia/2/
      const url = new URL(
        `${Constants.RYM_BASE_URL}${LIST_PATH}/${input.userId}/${
          input.listId
        }/${input.pageNum ?? "1"}/`
      );
      return url;
    },
  };
};
