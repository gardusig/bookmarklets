const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const [entryFile, outputName] = process.argv.slice(2);

if (!entryFile || !outputName) {
  console.error("Usage: node build.js <entryFile> <outputName>");
  process.exit(1);
}

const entryFilePath = path.resolve(__dirname, entryFile);
const outputBundlePath = path.resolve(
  __dirname,
  `./dist/${outputName}.bundle.js`
);

esbuild
  .build({
    entryPoints: [entryFilePath],
    bundle: true,
    minify: true,
    outfile: outputBundlePath,
    format: "iife",
    platform: "browser",
    target: ["es2017"],
  })
  .then(() => {
    console.log(`Bundle generated and saved to ${outputBundlePath}`);
  })
  .catch(() => process.exit(1));
