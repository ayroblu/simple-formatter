// 1. You must have matching braces, if you open a bracket and then don't close it, that's bad
// (caveat comments)
import fs from "fs";
import { formatter } from "./formatter";

const fileName = process.argv[2];
if (!fileName) {
  console.log("Please pass a filename");
  process.exit(1);
}
const fileContents = fs.readFileSync(fileName).toString();

fs.writeFileSync(fileName, formatter(fileContents));
