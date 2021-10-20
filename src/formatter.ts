const maxLength = 120;
const indentWidth = 2;

export function formatter(input: string): string {
  const items = stringToItems(input);
  items.forEach((item) => {
    if (item.type === "text") {
      item.value = item.value.replace(/\s\s+/g, " ");
    }
  });
  const lines: Line[] = [{ text: "", indent: 0 }];
  const stackMatchingIndexes = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    const currentLine = lines[lines.length - 1];

    if (i === stackMatchingIndexes[stackMatchingIndexes.length - 1]) {
      stackMatchingIndexes.pop();
      lines.push({ text: item.value, indent: currentLine.indent - 1 });
    } else if (item.type === "bracket" && openBrackets.has(item.value)) {
      const matchingIndex = getMatchingBracketIndex(items, i);
      const endIndex = adjustEndIndexIfNotEnclosed(
        currentLine.indent !== 0,
        items,
        matchingIndex
      );
      const text = getItemText(items, i, endIndex);
      if (
        currentLine.indent * indentWidth +
          currentLine.text.length +
          text.length >
        maxLength
      ) {
        lines.push({ text: "", indent: currentLine.indent + 1 });
        currentLine.text += item.value;
        stackMatchingIndexes.push(matchingIndex);
      } else {
        currentLine.text += text;
        i = endIndex;
      }
    } else {
      currentLine.text += item.value;
    }
  }
  return lines
    .map(({ text, indent }) => `${" ".repeat(indent * indentWidth)}${text}`)
    .join("\n");
  // At each opening bracket, calculate the next line till closing, if it's too long, break at this bracket
  // correct indent
  // determine whether to break
  // track bracket stack
  // commas: no space before, space after
  // operators: space before and after
}
function invert(object: typeof Bracket): { [k: string]: Bracket | undefined } {
  return Object.entries(object).reduce(
    (acc, [_, value]) => ({
      ...acc,
      [value]: value,
    }),
    {}
  );
}
const bracketMap = invert(Bracket);
function stringToItems(input: string): Item[] {
  return input.split("").reduce((a, n) => {
    const bracket = bracketMap[n];
    if (bracket) {
      a.push({ type: "bracket", value: bracket });
      return a;
    }

    // Definitely text past this point
    const lastItem = a[a.length - 1];
    if (!lastItem || lastItem.type !== "text") {
      a.push({ type: "text", value: n });
      return a;
    }
    lastItem.value += n;
    return a;
  }, [] as Item[]);
}
function getMatchingBracketIndex(items: Item[], idx: number) {
  let counter = 1;
  let i = idx + 1;
  for (; i < items.length; ++i) {
    const item = items[i];
    if (item.type === "bracket") {
      if (openBrackets.has(item.value)) {
        ++counter;
      } else {
        --counter;
        if (counter === 0) {
          break;
        }
      }
    }
  }
  return i;
}
function adjustEndIndexIfNotEnclosed(
  isEnclosed: boolean,
  items: Item[],
  idx: number
): number {
  if (isEnclosed) return idx;
  let i = idx + 1;
  for (; i < items.length; ++i) {
    const item = items[i];
    if (item.type === "bracket" && openBrackets.has(item.value)) {
      return i;
    }
  }
  return i - 2;
}
function getItemText(
  items: Item[],
  startIndex: number,
  endIndex: number
): string {
  return items
    .slice(startIndex, endIndex + 1)
    .map(({ value }) => value)
    .join("");
}

type TextItem = {
  type: "text";
  value: string;
};
// enum Operator {
//   multiply = "*",
//   divide = "/",
//   minus = "-",
//   plus = "+",
// }
// type OperatorItem = {
//   type: "operator";
//   value: Operator;
// };
const openBrackets = new Set(["(", "[", "{", "<"]);
enum Bracket {
  openParen = "(",
  closeParen = ")",
  openSquare = "[",
  closeSquare = "]",
  openBrace = "{",
  closeBrace = "}",
  openAngle = "<",
  closeAngle = ">",
}
type BracketItem = {
  type: "bracket";
  value: Bracket;
};
// type WhiteSpaceItem = {
//   type: "whitespace";
// };
type Item = TextItem | BracketItem;
type Line = {
  text: string;
  indent: number;
};
