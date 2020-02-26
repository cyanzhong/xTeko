module.exports = markdown => {
  const markmap = require("./markmap");
  const template = $file.read("scripts/mindmap/template.html").string;
  const data = markmap(markdown);
  const html = template.replace("{/* data */}", JSON.stringify(data));
  return html;
}