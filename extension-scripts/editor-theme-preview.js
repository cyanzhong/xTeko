//更直观的选择编辑器主题
//已知问题:部分配色与 JSBox 内置同名主题有差别, 加载太多 WKWebView 可能会引起卡顿

const schemes = [
  "agate",
  "androidstudio",
  "arduino-light",
  "arta",
  "ascetic",
  "atelier-cave-dark",
  "atelier-cave-light",
  "atelier-dune-dark",
  "atelier-dune-light",
  "atelier-estuary-dark",
  "atelier-estuary-light",
  "atelier-forest-dark",
  "atelier-forest-light",
  "atelier-heath-dark",
  "atelier-heath-light",
  "atelier-lakeside-dark",
  "atelier-lakeside-light",
  "atelier-plateau-dark",
  "atelier-plateau-light",
  "atelier-savanna-dark",
  "atelier-savanna-light",
  "atelier-seaside-dark",
  "atelier-seaside-light",
  "atelier-sulphurpool-dark",
  "atelier-sulphurpool-light",
  "atom-one-dark",
  "atom-one-light",
  "codepen-embed",
  "color-brewer",
  "darcula",
  "dark",
  "default",
  "docco",
  "dracula",
  "far",
  "foundation",
  "github-gist",
  "github",
  "googlecode",
  "grayscale",
  "gruvbox-dark",
  "gruvbox-light",
  "hopscotch",
  "hybrid",
  "idea",
  "ir-black",
  "kimbie.dark",
  "kimbie.light",
  "magula",
  "mono-blue",
  "monokai-sublime",
  "monokai",
  "obsidian",
  "ocean",
  "paraiso-dark",
  "paraiso-light",
  "purebasic",
  "qtcreator_dark",
  "qtcreator_light",
  "railscasts",
  "rainbow",
  "routeros",
  "solarized-dark",
  "solarized-light",
  "sunburst",
  "tomorrow-night-blue",
  "tomorrow-night-bright",
  "tomorrow-night-eighties",
  "tomorrow-night",
  "tomorrow",
  "vs",
  "vs2015",
  "xcode",
  "xt256",
  "zenburn"
];

const text =
  `const rates = [0.12, 0.15, 0.18, 0.20]

function calculate() {
  var origin = Number($("input").text)
  var rate = rates[$("tab").index]
  var tip = origin * rate
  $("label").text = origin.toFixed(2) + " + " + tip.toFixed(2) + " = " + (origin + tip).toFixed(2)
}`

var data = schemes.map(function (i) {
  return {
    title: i,
    rows: [{
      type: "web",
      props: {
        userInteractionEnabled: false,
        html: "<html><link rel='stylesheet' href='http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/" +
          i +
          ".min.css'><style>pre{font-size:24px;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;margin:0;padding-bottom:0;}</style><script src='http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'></script><script>hljs.initHighlightingOnLoad();</script><pre><code class='hljs'>" +
          text +
          "</code></pre></html>"
      },
      layout: $layout.fill
    }]
  };
});

$ui.render({
  views: [{
    type: "list",
    props: {
      rowHeight: $device.info.screen.height * .224,
      data: data
    },
    layout: $layout.fill
  }]
});