import jsAddSpans from "./javascript.js";

export default function addSpans() {
  const jsElems = document.querySelectorAll("[data-codespan='js']");

  for (const elem of jsElems) {
    const innerHTML = elem.innerHTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    const output = jsAddSpans(innerHTML, "js");

    elem.innerHTML = output;
  }
}
