let xml = $file.read("assets/sample.xml").string;

let doc = $xml.parse({
  "string": xml,
  "mode": "xml"
});

let rootElement = doc.rootElement;

console.log("Daily Values:");

let dailyValues = rootElement.firstChild({
  "tag": "daily-values"
}).children();

for (const dailyValueElement of dailyValues) {
  let nutrient = dailyValueElement.tag;
  let amount = dailyValueElement.number;
  let units = dailyValueElement.attributes["units"];
  console.log(amount, units, nutrient);
}

let xPath = "//food/name";
console.log("XPath Search: ", xPath);

rootElement.enumerate({"xPath": xPath, "handler": (element, idx) => {
  console.log(element);
}});

console.log("children with XPath: ", xPath);
rootElement.children({"xPath": xPath}).forEach(element => {
  console.log(element);
});

let selector = "food > serving[units]";
console.log("CSS Search: ", selector);

rootElement.enumerate({"selector": selector, "handler": (element, idx) => {
  console.log(element);
}});