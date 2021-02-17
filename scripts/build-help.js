var showdown = require("showdown");
var fs = require("fs");
var path = require("path");
let filename = "README.md";
let pageTitle = process.argv[2] || "";

console.log('Generating page', pageTitle)

fs.readFile(__dirname + "/style.css", function (err, styleData) {
  fs.readFile(path.resolve(__dirname, "../", filename), function (err, data) {
    if (err) {
      throw err;
    }
    let text = data.toString();

    converter = new showdown.Converter({
      ghCompatibleHeaderId: true,
      simpleLineBreaks: true,
      ghMentions: true,
      tables: true,
    });

    let preContent =
      `
    <html>
      <head>
        <title>` +
      pageTitle +
      `</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id='content'>
    `;

    let postContent =
      `

        </div>
        <style type='text/css'>` +
      styleData +
      `</style>
      </body>
    </html>`;

    html = preContent + converter.makeHtml(text) + postContent;

    converter.setFlavor("github");
   // console.log(html);

    let filePath = process.cwd() + "/README.html";
    fs.writeFile(filePath, html, { flag: "wx" }, function (err) {
      if (err) {
        console.log("File '" + filePath + "' already exists. Aborted!");
      } else {
        console.log("Done, saved to " + filePath);
      }
    });
  });
});
