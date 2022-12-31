import { describe, test, expect } from "../lib/testing/src/index.js";
import {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
  booleans,
} from "../src/definitions-js.js";
import { jsAddSpans } from "../src/index.js";

const definitions = {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
  booleans,
};

describe("Ensure definitions have the correct number of elements", () => {
  test("definition length is 6", () => {
    expect(Object.keys(definitions).length).toBe(6);
  });

  [
    ["keywords", 42],
    ["declarators", 8],
    ["punctuations", 21],
    ["quotes", 3],
    ["brackets", 6],
    ["booleans", 2],
  ].forEach(([type, numElems]) => {
    test(`${type} has ${numElems}`, () => {
      expect(definitions[type].length).toBe(numElems);
    });
  });
});

Object.keys(definitions).forEach((typeGroup) => {
  describe(`jsAddSpans inserts the appropriate spans for ${typeGroup}`, () => {
    definitions[typeGroup]
      .filter((value) => value !== "<" && value !== ">")
      .forEach((value) => {
        const classPostfix = typeGroup.slice(0, -1);
        const expected = `<span class="codespan-js-${classPostfix}">${value}</span>`;

        test(`${value} yields ${expected}`, () => {
          const html = jsAddSpans(value);
          expect(html).toBe(expected);
        });
      });
  });
});

describe(`jsAddSpans does not output`, () => {
  test(`"word" tokens`, () => {
    expect(jsAddSpans("foo")).toBe("foo");
  });

  test(`"other" tokens`, () => {
    expect(jsAddSpans("✅")).toBe("✅");
  });

  test(`"ws" tokens`, () => {
    expect(jsAddSpans(" ")).toBe(" ");
  });

  test(`"newline" tokens`, () => {
    expect(jsAddSpans("\n")).toBe("\n");
  });
});

describe(`jsAddSpans combines words with:`, () => {
  ["_", "$"].forEach((char) => {
    const text = `${char}word${char}`;

    test(`${char} : ${text}`, () => {
      const html = jsAddSpans(text);

      expect(html).toBe(text);
    });
  });
});

describe(`jsAddSpans transforms strings for a given quote char:`, () => {
  quotes.forEach((quoteChar) => {
    const text = `${quoteChar}This is a string.${quoteChar}`;
    const expected = `<span class="codespan-js-quote">${quoteChar}</span><span class="codespan-js-string">This is a string.</span><span class="codespan-js-quote">${quoteChar}</span>`;

    test(quoteChar + "  ", () => {
      const html = jsAddSpans(text);
      expect(html).toBe(expected);
    });
  });
});

describe(`jsAddSpans transforms`, () => {
  test(`single line comments`, () => {
    const text = `// this is a comment\n`;
    const expected = `<span class="codespan-js-comment">// this is a comment</span>\n`;

    expect(jsAddSpans(text)).toBe(expected);
  });

  test(`block comments`, () => {
    const text = `/* this is a comment */`;
    const expected = `<span class="codespan-js-comment">/* this is a comment */</span>`;

    expect(jsAddSpans(text)).toBe(expected);
  });

  test(`"<" to "<span class="codespan-js-punctuation">&lt;</span>"`, () => {
    const expected = `<span class="codespan-js-punctuation">&lt;</span>`;
    expect(jsAddSpans("<")).toBe(expected);
  });

  test(`">" to "<span class="codespan-js-punctuation">></span>"`, () => {
    const expected = `<span class="codespan-js-punctuation">></span>`;
    expect(jsAddSpans(">")).toBe(expected);
  });
});
