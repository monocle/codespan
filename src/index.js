import stringParse from "../lib/stringParse/src/index.js";
import {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
} from "../src/definitions-js.js";

export function jsAddSpans(text) {
  let options = { concat: [], typeMap: {} };

  options.typeMap = {
    keyword: keywords,
    declarator: declarators,
    punctuation: punctuations,
    quote: quotes,
    bracket: brackets,
  };

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
    return (html += `<span class="codespan-js-${type}">${value}</span>`);
  }, "");
}

export default function addSpans() {
  const codeElems = document.querySelectorAll("[data-codespan='js']");

  for (const elem of codeElems) {
    elem.innerHTML = jsAddSpans(elem.innerText, "js");
  }
}
