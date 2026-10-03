const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const parseAttributes = (rawTag) => {
  const attributes = {};
  if (!rawTag) return attributes;

  const attributesString = rawTag
    .replace(/^<\s*\/?[a-zA-Z0-9-]+/i, "")
    .replace(/\/?>$/, "")
    .trim();

  if (!attributesString) return attributes;

  const attrRegex = /([a-zA-Z0-9:-]+)(?:=(?:["']([^"']*)["']|([^\s>]+)))?/g;

  for (const match of attributesString.matchAll(attrRegex)) {
    const key = match[1];
    const hasValue = match[2] !== undefined || match[3] !== undefined;

    attributes[key] = hasValue ? (match[2] ?? match[3]) : true;
  }

  return attributes;
};

function html2json(htmlText) {
  if (!htmlText || typeof htmlText !== "string") {
    return [];
  }

  const cleanHtml = htmlText
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .trim();

  const tokenization = cleanHtml.match(
    /(<[^"'>]+(?:["'][^"']*["'][^"'>]*)*>)|([^<]+)/g,
  );
  if (!tokenization) return [];

  const root = { tag: "root", children: [] };
  const stack = [root];

  tokenization.forEach((element) => {
    const trimmedToken = element.trim();
    if (!trimmedToken) return;

    if (element.startsWith("</")) {
      if (stack.length > 1) {
        stack.pop();
      }
      return;
    }

    if (element.startsWith("<")) {
      const tagMatch = element.match(/^<\s*([a-zA-Z0-9-]+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : null;

      if (!tagName) return;

      const isSelfClosing =
        /\/>\s*$/.test(element) || VOID_ELEMENTS.has(tagName);
      const parent = stack[stack.length - 1];

      const node = {
        tag: tagName,
        attributes: parseAttributes(element),
        children: [],
      };

      parent.children.push(node);

      if (!isSelfClosing) {
        stack.push(node);
      }
    } else {
      const parent = stack[stack.length - 1];
      parent.children.push(element.trim());
    }
  });

  return root.children;
}
