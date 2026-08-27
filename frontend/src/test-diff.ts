import fs from "fs";
import parseGitDiff from "parse-git-diff";

const diff = fs.readFileSync("patch.diff", "utf8");

console.log(diff.slice(0, 300));

const parsed = parseGitDiff(diff);

console.dir(parsed, {
  depth: null,
  colors: true,
});
