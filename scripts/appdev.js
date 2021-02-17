const initialPrefix = "http://localhost:3001";
const BASE_URL = "https://openfin-demo.adaptabletools.com";

const fs = require("fs");
const path = require("path");

const json = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "openfin-app-dev.json"))
);

const traverse = require("traverse");

const finalJSON = traverse(json).map(function (value) {
  if (value && typeof value === "string" && value.startsWith(initialPrefix)) {
    this.update(value.replace(initialPrefix, BASE_URL));
  }
});

fs.writeFileSync(
  path.resolve(__dirname, "..", "out/openfin-app.json"),
  JSON.stringify(finalJSON, null, 2)
);
