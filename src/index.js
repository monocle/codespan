import stringParse from "../lib/stringParse/src/index.js";
import {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
} from "../src/definitions.js";

export default function jsAddSpans(text) {
  let options = {};

  options.typeMap = {
    bracket: brackets,
    quote: quotes,
  };

  return stringParse(text, options).reduce((html, { type, value }) => {
    return (html += `<span class="codespan-${type}">${value}</span>`);
  }, "");
}
