import { Constants } from "../constants.ts";
import { URLGenerator } from "../domain/URLGenerator.ts";

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
    /**
     * https://rateyourmusic.com/list/${userId}/${listId}/${pageNum}/
     * - ex: https://rateyourmusic.com/list/foxbyrd/emo-encyclopedia/2/
     */
    const url = new URL(
      `${Constants.RYM_BASE_URL}${Constants.RYM_LIST_PATH}/${userId}/${listId}/${pageNum}/`
    );
    return url;
  },
});

export const createListURLGeneratorFromString = (
  /**
   * https://rateyourmusic.com/list/${userId}/${listId}/${pageNum}/
   * - ex: https://rateyourmusic.com/list/foxbyrd/emo-encyclopedia/2/
   */
  urlStr: string
): URLGenerator => ({
  run() {
    const url = new URL(urlStr);

    // validate
    if (
      url.origin !== Constants.RYM_BASE_URL ||
      !url.pathname.startsWith(Constants.RYM_LIST_PATH)
    ) {
      throw new Error("Invalid list url");
    }

    return url;
  },
});
