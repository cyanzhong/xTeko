$ui.render({
  views: [
    {
      type: "list",
      props: {
        rowHeight: 80,
        template: [
          {
            type: "image",
            props: {
              id: "image"
            },
            layout: (make, view) => {
              make.left.top.bottom.inset(5);
              make.width.equalTo(view.height);
            }
          },
          {
            type: "label",
            props: {
              id: "label",
              font: $font("bold", 17),
              lines: 0
            },
            layout: make => {
              make.left.equalTo($("image").right).offset(10);
              make.top.bottom.equalTo(0);
              make.right.inset(10);
            }
          }
        ],
        actions: [
          {
            title: "Share",
            handler: (sender, indexPath) => {
              var data = sender.object(indexPath);
              $share.sheet([data.url, data.label.text]);
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: (sender, indexPath, data) => {
          showDetail(data.label.text, data.url);
        },
        pulled: refresh
      }
    }
  ]
});

function renderItems(items) {
  var list = $("list");
  list.data = items.map(item => {
    return {
      label: {
        text: $text.HTMLUnescape(item.title)
      },
      image: {
        src: extractImageURL(item)
      },
      url: item.url
    };
  });
  list.endRefreshing();
}

function showDetail(title, url) {
  $ui.push({
    props: {
      title: title
    },
    views: [
      {
        type: "web",
        props: {
          url: url
        },
        layout: $layout.fill
      }
    ]
  });
}

function refresh() {

  $ui.loading(true);
  var url = "https://macstories.net/feed/json";
  
  var handler = function(resp) {
    $ui.loading(false);
    var items = resp.data.items;
    renderItems(items);
    $cache.set("items", items);
  };

  $http.get(url).then(handler);
}

function extractImageURL(item) {
  var matches = item["content_html"].match(/<img src="(.*)" alt="/);
  if (matches && matches.length >= 2) {
    return matches[1];
  } else {
    return "";
  }
}

var cachedItems = $cache.get("items");
if (cachedItems && cachedItems.length > 0) {
  renderItems(cachedItems);
}

refresh();