import stringParse from "../lib/stringParse/src/index.js";
import {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
  booleans,
} from "../src/definitions-js.js";

export function jsAddSpans(text) {
  const shouldExclude = {
    word: true,
    other: true,
    ws: true,
    newline: true,
  };

  let options = { concat: [], typeMap: {} };

  options.typeMap = {
    keyword: keywords,
    declarator: declarators,
    punctuation: punctuations,
    quote: quotes,
    bracket: brackets,
    boolean: booleans,
  };

  options.concat.push({
    type: "declarator",
    start: "=>",
    stop: "",
    includeStartDelimeter: true,
  });

  quotes.forEach((quoteChar) => {
    options.concat.push({
      type: "string",
      start: `${quoteChar}`,
      stop: `${quoteChar}`,
    });
  });

  options.concat.push({
    type: "comment",
    start: "//",
    stop: "\n",
    includeStartDelimeter: true,
  });

  options.concat.push({
    type: "comment",
    start: "/*",
    stop: "*/",
    includeStartDelimeter: true,
    includeStopDelimeter: true,
  });

  return stringParse(text, options).reduce((html, { type, value }) => {
    let value_ = value.replace(/</g, "&lt;");
    let text = `<span class="codespan-js-${type}">${value_}</span>`;

    if (shouldExclude[type]) {
      text = value_;
    }

    return html + text;
  }, "");
}

export default function addSpans() {
  const codeElems = document.querySelectorAll("[data-codespan='js']");

  for (const elem of codeElems) {
    const innerHTML = elem.innerHTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    const output = jsAddSpans(innerHTML, "js");

    elem.innerHTML = output;
  }
}
