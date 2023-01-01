import stringParse from "../lib/stringParse/src/index.js";
import {
  keywords,
  declarators,
  punctuations,
  quotes,
  brackets,
  booleans,
  words,
} from "../src/definitions-js.js";

function assignFunctionName(token, idx, origTokens) {
  if (token.value === "(") {
    for (let i = idx - 1; i >= 0; i--) {
      if (origTokens[i].type === "ws") continue;
      if (origTokens[i].type !== "word") break;

      origTokens[i].type = "function-name";
      break;
    }
  }
  return token;
}

export default function jsAddSpans(text) {
  const shouldExclude = {
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
    word: words,
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

  return stringParse(text, options)
    .map(assignFunctionName)
    .reduce((html, { type, value }) => {
      let value_ = value.replace(/</g, "&lt;");
      let text = `<span class="codespan-js-${type}">${value_}</span>`;

      if (shouldExclude[type]) {
        text = value_;
      }

      return html + text;
    }, "");
}
