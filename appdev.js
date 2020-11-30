const initialPrefix = "http://localhost:3001";
const BASE_URL = "https://openfin-demo.adaptabletools.com";

const fs = require("fs");

const json = JSON.parse(fs.readFileSync("openfin-app-dev.json"));

const traverse = require("traverse");

const finalJSON = traverse(json).map(function (value) {
  if (value && typeof value === "string" && value.startsWith(initialPrefix)) {
    this.update(value.replace(initialPrefix, BASE_URL));
  }
});

fs.writeFileSync("out/openfin-app.json", JSON.stringify(finalJSON, null, 2));
