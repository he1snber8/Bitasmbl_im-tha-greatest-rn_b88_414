import { Project } from "ts-morph";
import path from "path";
import { fileURLToPath } from "url";

const project = new Project();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const source = project.addSourceFileAtPath(
  path.join(__dirname, "router/router.tsx"),
);

console.log("Imports:");
source.getImportDeclarations().forEach((i) => {
  console.log("-", i.getModuleSpecifierValue());
});

console.log("\nFunctions:");
source.getFunctions().forEach((f) => {
  console.log("-", f.getName());
});

console.log("\nVariables:");
source.getVariableDeclarations().forEach((v) => {
  console.log("-", v.getName());
});
