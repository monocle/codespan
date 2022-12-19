import { describe, test, expect } from "../lib/testing/src/index.js";
import {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
} from "../src/definitions-js.js";
import { jsAddSpans } from "../src/index.js";

const definitions = {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
};

describe("Ensure definitions have the correct number of elements", () => {
  [
    ["keywords", 44],
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

["keywords", "declarators", "punctuations", "quotes", "brackets"].forEach(
  (typeGroup) => {
    describe(`jsAddSpans(text) inserts the appropriate spans for ${typeGroup}`, () => {
      definitions[typeGroup].forEach((value) => {
        const classPostfix = typeGroup.slice(0, -1);
        const expected = `<span class="codespan-js-${classPostfix}">${value}</span>`;

        test(`${value} yields ${expected}`, () => {
          const html = jsAddSpans(value);
          expect(html).toBe(expected);
        });
      });
    });
  }
);

describe(`jsAddSpans(text) transforms strings for char:`, () => {
  quotes.forEach((quoteChar) => {
    const text = `${quoteChar}This is a string.${quoteChar}`;
    const expected = `<span class="codespan-js-quote">${quoteChar}</span><span class="codespan-js-string">This is a string.</span><span class="codespan-js-quote">${quoteChar}</span>`;

    test(quoteChar + "  ", () => {
      const html = jsAddSpans(text);
      expect(html).toBe(expected);
    });
  });
});

describe(`jsAddSpans(text) transforms comments`, () => {
  test(`single line comments are correct`, () => {
    const text = `// this is a comment\n`;
    const expected = `<span class="codespan-js-comment">// this is a comment</span><span class="codespan-js-newline">\n</span>`;
    // const expected = `<span class="codespan-js-ws"> </span><span class="codespan-js-comment">// this is a comment</span><span class="codespan-js-ws">\n</span>`;
    console.log("===================");
    expect(jsAddSpans(text)).toBe(expected);
  });

  test(`block comments are correct`, () => {
    const text = `/* this is a comment */`;
    const expected = `<span class="codespan-js-comment">/* this is a comment */</span>`;

    expect(jsAddSpans(text)).toBe(expected);
  });
});
