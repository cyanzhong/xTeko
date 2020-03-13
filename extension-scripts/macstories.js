$app.theme = "auto";

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
            layout: ({left, width}, {height}) => {
              left.top.bottom.inset(5);
              width.equalTo(height);
            }
          },
          {
            type: "label",
            props: {
              id: "label",
              font: $font("bold", 17),
              lines: 0
            },
            layout: ({left, top, right}) => {
              left.equalTo($("image").right).offset(10);
              top.bottom.equalTo(0);
              right.inset(10);
            }
          }
        ],
        actions: [
          {
            title: "Share",
            handler: (sender, indexPath) => {
              const data = sender.object(indexPath);
              $share.sheet([data.url, data.label.text]);
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: (sender, indexPath, {label, url}) => {
          showDetail(label.text, url);
        },
        pulled: refresh
      }
    }
  ]
});

function renderItems(items) {
  const list = $("list");
  list.data = items.map(item => ({
    label: {
      text: $text.HTMLUnescape(item.title)
    },
    image: {
      src: extractImageURL(item)
    },
    url: item.url
  }));
  list.endRefreshing();
}

function showDetail(title, url) {
  $ui.push({
    props: {
      title
    },
    views: [
      {
        type: "web",
        props: {
          url
        },
        layout: $layout.fill
      }
    ]
  });
}

function refresh() {

  $ui.loading(true);
  const url = "https://macstories.net/feed/json";
  
  const handler = ({data}) => {
    $ui.loading(false);
    const items = data.items;
    renderItems(items);
    $cache.set("items", items);
  };

  $http.get(url).then(handler);
}

function extractImageURL(item) {
  const matches = item["content_html"].match(/<img src="(.*)" alt="/);
  if (matches && matches.length >= 2) {
    return matches[1];
  } else {
    return "";
  }
}

const cachedItems = $cache.get("items");
if (cachedItems && cachedItems.length > 0) {
  renderItems(cachedItems);
}

refresh();