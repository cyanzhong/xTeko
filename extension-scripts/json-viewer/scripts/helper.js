function parseJson(string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    $ui.error($l10n("FORMAT_ERROR"));
    return null;
  }
}

function renderJson(json) {
  
  var string = JSON.stringify(json, null, 2);
  var theme = $cache.get("theme") || "atom-one-light.min.css";
  var html = "<html><link rel='stylesheet' href='http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/" + theme + "'><style>*{margin:0;padding:0;font-size:24px;}</style><script src='http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'></script><script>hljs.initHighlightingOnLoad();</script><pre><code class='hljs'>" + string + "</code></pre></html>";
  var view = {
    props: { title: $l10n("MAIN_TITLE") },
    views: [
      {
        type: "web",
        props: { html: html },
        layout: function(make, view) {
          make.left.top.right.equalTo(0);
          make.bottom.inset(48);
        }
      },
      {
        type: "button",
        props: { title: $l10n("STRUCTURED_VIEW") },
        layout: function(make, view) {
          make.left.bottom.right.inset(8);
          make.height.equalTo(32);
        },
        events: {
          tapped: function() {
            $quicklook.open({ json: string });
          }
        }
      }
    ]
  };

  if ($app.env == $env.action) {
    $ui.render(view);
  } else {
    $ui.push(view);
  }
}

module.exports = {
  parseJson: parseJson,
  renderJson: renderJson
}