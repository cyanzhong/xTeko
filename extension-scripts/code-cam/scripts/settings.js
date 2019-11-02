const modes = [
  "Auto",
  "APL",
  "ASN.1",
  "ASP.NET",
  "Asterisk",
  "Brainfuck",
  "C",
  "C#",
  "C++",
  "CMake",
  "CQL",
  "CSS",
  "Clojure",
  "ClojureScript",
  "Closure Stylesheets (GSS)",
  "Cobol",
  "CoffeeScript",
  "Common Lisp",
  "Crystal",
  "Cypher",
  "Cython",
  "D",
  "DTD",
  "Dart",
  "Django",
  "Dockerfile",
  "Dylan",
  "EBNF",
  "ECL",
  "Eiffel",
  "Elm",
  "Embedded Javascript",
  "Embedded Ruby",
  "Erlang",
  "Esper",
  "F#",
  "FCL",
  "Factor",
  "Forth",
  "Fortran",
  "Gas",
  "Gherkin",
  "GitHub Flavored Markdown",
  "Go",
  "Groovy",
  "HAML",
  "HTML",
  "HTTP",
  "HXML",
  "Haskell",
  "Haskell (Literate)",
  "Haxe",
  "IDL",
  "JSON",
  "JSON-LD",
  "JSX",
  "Java",
  "Java Server Pages",
  "JavaScript",
  "Jinja2",
  "Julia",
  "Kotlin",
  "LESS",
  "LaTeX",
  "LiveScript",
  "Lua",
  "MS SQL",
  "MUMPS",
  "MariaDB SQL",
  "Markdown",
  "Mathematica",
  "Modelica",
  "MySQL",
  "NSIS",
  "NTriples",
  "Nginx",
  "OCaml",
  "Objective-C",
  "Objective-C++",
  "Octave",
  "Oz",
  "PEG.js",
  "PGP",
  "PHP",
  "PLSQL",
  "Pascal",
  "Perl",
  "Pig",
  "Plain Text",
  "PostgreSQL",
  "PowerShell",
  "Properties files",
  "ProtoBuf",
  "Pug",
  "Puppet",
  "Python",
  "Q",
  "R",
  "RPM Changes",
  "RPM Spec",
  "Ruby",
  "Rust",
  "SAS",
  "SCSS",
  "SML",
  "SPARQL",
  "SQL",
  "SQLite",
  "Sass",
  "Scala",
  "Scheme",
  "Shell",
  "Sieve",
  "Slim",
  "Smalltalk",
  "Smarty",
  "Solr",
  "Soy",
  "Spreadsheet",
  "Squirrel",
  "Stylus",
  "Swift",
  "SystemVerilog",
  "TOML",
  "TTCN",
  "TTCN_CFG",
  "Tcl",
  "Textile",
  "TiddlyWiki ",
  "Tiki wiki",
  "Tornado",
  "Turtle",
  "Twig",
  "TypeScript",
  "TypeScript-JSX",
  "VB.NET",
  "VBScript",
  "VHDL",
  "Velocity",
  "Verilog",
  "Vue.js Component",
  "Web IDL",
  "XML",
  "XQuery",
  "YAML",
  "Yacas",
  "Z80",
  "diff",
  "edn",
  "mIRC",
  "mbox",
  "mscgen",
  "msgenny",
  "reStructuredText",
  "sTeX",
  "troff",
  "xu"
];

const themes = [
  "3024-day",
  "3024-night",
  "abcdef",
  "ambiance-mobile",
  "ambiance",
  "base16-dark",
  "base16-light",
  "bespin",
  "blackboard",
  "cobalt",
  "colorforth",
  "darcula",
  "dracula",
  "duotone-dark",
  "duotone-light",
  "eclipse",
  "elegant",
  "erlang-dark",
  "gruvbox-dark",
  "hopscotch",
  "icecoder",
  "idea",
  "isotope",
  "lesser-dark",
  "liquibyte",
  "lucario",
  "material-darker",
  "material-ocean",
  "material-palenight",
  "material",
  "mbo",
  "mdn-like",
  "midnight",
  "monokai",
  "moxer",
  "neat",
  "neo",
  "night",
  "nord",
  "oceanic-next",
  "panda-syntax",
  "paraiso-dark",
  "paraiso-light",
  "pastel-on-dark",
  "railscasts",
  "rubyblue",
  "seti",
  "shadowfox",
  "solarized",
  "ssms",
  "the-matrix",
  "tomorrow-night-bright",
  "tomorrow-night-eighties",
  "ttcn",
  "twilight",
  "vibrant-ink",
  "xq-dark",
  "xq-light",
  "yeti",
  "yonce",
  "zenburn",
];

const fontNames = [
  "Menlo",
  "Source Code Pro",
  "Monaco",
  "Iosevka",
  "Ubuntu Mono",
  "Hack",
  "Cascadia Code",
];

exports.modes = modes;
exports.themes = themes;

exports.modeIndex = () => {
  return $cache.get("editor.mode") || 0;
}

exports.mode = () => {
  const index = exports.modeIndex();
  return modes[index];
}

exports.setMode = index => {
  $cache.set("editor.mode", index);
}

exports.theme = () => {
  const index = $prefs.get("editor.theme");
  return themes[index] || "nord";
}

exports.fontName = () => {
  const index = $prefs.get("editor.font.name");
  return fontNames[index] || "Menlo";
}

exports.fontSize = () => {
  return $prefs.get("editor.font.size") || 15;
}

exports.lineHeight = () => {
  return $prefs.get("editor.line.height") || 20;
}

exports.lineNumbers = () => {
  return $prefs.get("editor.line.numbers");
}

exports.showInvisibles = () => {
  return $prefs.get("editor.invisibles");
}

exports.maxWidth = () => {
  return $prefs.get("window.width.max") || "150%";
}

exports.paddingX = () => {
  return $prefs.get("window.padding.x") || 10;
}

exports.paddingY = () => {
  return $prefs.get("window.padding.y") || 10;
}

exports.shadowOffsetX = () => {
  return $prefs.get("window.shadow.x") || 10;
}

exports.shadowOffsetY = () => {
  return $prefs.get("window.shadow.y") || 10;
}

exports.shadowRadius = () => {
  return $prefs.get("window.shadow.radius") || 15;
}

exports.backgroundColor = () => {
  return $prefs.get("window.bg.color") || "#FFFFFF";
}

exports.backgroundAlpha = () => {
  return $prefs.get("window.bg.alpha") || 0;
}