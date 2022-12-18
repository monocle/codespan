import { describe, test, expect } from "../lib/testing/src/index.js";
import {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
} from "../src/definitions.js";
import jsAddSpans from "../src/index.js";

const definitions = {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
};

describe("Ensure definitions have the correct number of elements", () => {
  [
    ["keywords", 48],
    ["declarators", 7],
    ["punctuations", 10],
    ["quotes", 3],
    ["brackets", 6],
  ].forEach(([type, numElems]) => {
    test(`${type} has ${numElems}`, () => {
      expect(definitions[type].length).toBe(numElems);
    });
  });
});

["brackets", "quotes"].forEach((typeGroup) => {
  describe(`jsAddSpans(text) inserts the appropriate spans for ${typeGroup}`, () => {
    definitions[typeGroup].forEach((value) => {
      const classPostfix = typeGroup.slice(0, -1);
      const expected = `<span class="codespan-${classPostfix}">${value}</span>`;

      test(`${value} yields ${expected}`, () => {
        const html = jsAddSpans(value);
        expect(html).toBe(expected);
      });
    });
  });
});
