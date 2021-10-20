// 1. You must have matching braces, if you open a bracket and then don't close it, that's bad
// (caveat comments)
// import fs from "fs";

// const fileName = process.argv[2];
// if (!fileName) {
//   console.log("Please pass a filename");
//   process.exit(1);
// }
// const fileContents = fs.readFileSync(fileName).toString();

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

function formatter(input: string): string {
  console.log(stringToItems(input));
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

const input = `
100 * zone([atla, smf1], movingavg(5, 1 - default(0,
        sumany(rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/failures))) /
        sumany(rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/requests))))))
`.trim();
const output = `
100 * zone(
  [atla, smf1], movingavg(5, 1 - default(0, sumany(
    rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/failures))
  ) / sumany(
    rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/requests))
  )))
)
`.trim();
const output2 = `
100 * zone(
  [atla, smf1],
  movingavg(
    5,
    1 - default(
      0,
      sumany(
        rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/failures))
      ) / sumany(
        rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/requests))
      )
    )
  )
)
`.trim();
console.log(formatter(input) === output);
console.log(formatter(input) === output2);
