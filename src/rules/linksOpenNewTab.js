import * as cheerio from "cheerio";
import getLineNumber from "../utils/getLineNumber.js";

/* future i18n */
const pattern =
  "^opens?( (in|a|(in a)))? new (tab|window|(tab or window)|(window or tab))$";
const type = "link-new-tab-warning";
const message = `<a> with target="_blank" should inform users it opens in a new tab (e.g., via aria-label or screen reader note)`;

const flags = "i";
const re = new RegExp(pattern, flags);

/**
 * Checks if links opening in a new tab/window notify screen readers.
 *
 * @param {string} content - HTML content.
 * @param {string} file - File name.
 * @returns {object[]} List of new tab warning issues.
 */
export default function linksOpenNewTab(content, file) {
  const $ = cheerio.load(content);
  const errors = [];

  $("a[target='_blank']").each((_, el) => {
    const $el = $(el);

    /* check <a> has appropriate aria-label attribute */
    const ariaLabel = $el.attr("aria-label") || "";
    const text = ariaLabel.toLowerCase();
    const describesNewTab = re.test(text);

    /* check <a> descendants have appropriate classes and text */
    const hasScreenReaderNote =
      $el.find(".sr-only, .visually-hidden").filter((_, n) => {
        const text = $(n).text().toLowerCase();
        return re.test(text);
      }).length > 0;

    /* report issue */
    const ok = describesNewTab || hasScreenReaderNote;
    if (!ok) {
      const html = $.html(el);
      const tagIndex = content.indexOf(html);
      const lineNumber = getLineNumber(content, tagIndex);
      errors.push({
        file,
        line: lineNumber,
        type: type,
        message: message,
      });
    }
  });

  return errors;
}
