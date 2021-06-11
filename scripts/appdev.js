const initialPrefix = "http://localhost:3001";
const BASE_URL = "https://openfin-demo.adaptabletools.com";
const HOME_BASE_URL = "https://home.openfin-demo.adaptabletools.com";


const fs = require("fs");
const path = require("path");

const json = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "openfin-app-dev.json"))
);

const homeJSON = {
...json,
  platform: {
    ...json.platform,
    "interop": {
      "providerId": "openfin-browser",
      "contextDeclaration": [
        "instrument",
        "fdc3.instrument"
      ]
     },
  }
}

const traverse = require("traverse");


const fixURL = (NEW_URL) => {
  return function (value) {
    if (value && typeof value === "string" && value.startsWith(initialPrefix)) {
      this.update(value.replace(initialPrefix, NEW_URL));
    }
  }
}
const finalJSON = traverse(json).map(fixURL(BASE_URL));
const finalHOMEJSON = traverse(homeJSON).map(fixURL(HOME_BASE_URL));

// build initial app json - for deployment
fs.writeFileSync(
  path.resolve(__dirname, "..", "out/openfin-app.json"),
  JSON.stringify(finalJSON, null, 2)
);


// build HOME app json - for deployment
fs.writeFileSync(
  path.resolve(__dirname, "..", "out/openfin-home.json"),
  JSON.stringify(finalHOMEJSON, null, 2)
);

// build HOME app json - for local dev
fs.writeFileSync(
  path.resolve(__dirname, "..", "openfin-app-home.json"),
  JSON.stringify(homeJSON, null, 2)
);
