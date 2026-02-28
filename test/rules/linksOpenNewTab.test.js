import linksOpenNewTab from "../../src/rules/linksOpenNewTab";
import { test, expect } from "@jest/globals";

/**
 * Returns Cartesian product of input arrays as an array.
 *
 * @param {string[][]} arrays - Input arrays.
 * @returns {string[][]} Cartesian product of input.
 */
const cartesian = (...arrays) => {
  return arrays.reduce(
    (/** @type {string[][]} **/ accumulator, currentArray) => {
      return accumulator.flatMap((accElement) => {
        return currentArray.map((currElement) => {
          return accElement.concat([currElement]);
        });
      });
    },
    [[]]
  );
};

/**
 * Returns all possible string combinations with elements chosen from input string
 * arrays using Cartesian product.
 *
 * @param {string[][]} choices - Input arrays to choose from.
 * @returns {string[]} Strings formed from the Cartesian products of input choices.
 */
const stringCases = (...choices) => {
  return cartesian(...choices).map((v) => v.join(" "));
};

const open = ["open", "opens"];
const ina = ["a", "in", "in a"];
const new_ = ["new"];
const tab = ["tab", "tab or window", "window", "window or tab"];
const strings = stringCases(open, ina, new_, tab);

const okAriaContents = strings.map((s) => {
  return '<a target="_blank" aria-label="' + s + '"></a>';
});
const okSrContents = strings.map((s) => {
  return '<a target="_blank"><label class="sr-only">' + s + "</label></a>";
});
const okVhContents = strings.map((s) => {
  return (
    '<a target="_blank"><label class="visually-hidden">' + s + "</label></a>"
  );
});

const okContents = [...okAriaContents, ...okSrContents, ...okVhContents];
const cases = [
  ...okContents.map((v) => {
    return { content: v, expected_length: 0 };
  }),
  { content: "<span></span>", expected_length: 0 },
  { content: '<a target="_blank"></a>', expected_length: 1 },
  {
    content: '<a target="_blank" aria-label="opens new"></a>',
    expected_length: 1,
  },
];

test.each(cases)(
  "content: $content\nexpected: $expected_length",
  ({ content, expected_length }) => {
    expect(linksOpenNewTab(content, "").length).toStrictEqual(expected_length);
  }
);
