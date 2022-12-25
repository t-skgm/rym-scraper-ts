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

export const createListURLGenerator = ({
  userId,
  listId,
  pageNum = 1,
}: ListURLGeneratorInput): URLGenerator => ({
  run() {
    // https://rateyourmusic.com/list/${userId}/${listId}/${pageNum}/
    // ex: https://rateyourmusic.com/list/foxbyrd/emo-encyclopedia/2/
    const url = new URL(
      `${Constants.RYM_BASE_URL}${Constants.RYM_LIST_PATH}/${userId}/${listId}/${pageNum}/`
    );
    return url;
  },
});
