const types = [
  {
    name: "From",
    pattern: "from:"
  },
  {
    name: "To",
    pattern: "to:"
  },
  {
    name: "Mentioning",
    pattern: "@"
  }
];

$ui.render({
  views: [
    {
      type: "tab",
      props: {
        id: "type",
        items: types.map(x => x.name)
      },
      layout: make => {
        make.left.top.right.inset(8);
        make.height.equalTo(28);
      }
    },
    {
      type: "input",
      props: {
        id: "keyword",
        returnKeyType: $rkType.search
      },
      layout: make => {
        make.left.right.inset(8);
        make.top.equalTo($("type").bottom).offset(8);
        make.height.equalTo(36);
      },
      events: {
        ready: sender => {
          sender.focus();
        },
        returned: sender => {
          const keyword = sender.text;
          if (keyword.length === 0) {
            return;
          }
          const pattern = types[$("type").index].pattern;
          search(keyword, pattern);
        }
      }
    }
  ]
});

function search(keyword, pattern) {
  const user = $context.link.split("/").pop();
  const query = encodeURIComponent(`${keyword} (${pattern}${user})`);
  const url = `twitter://search?query=${query}`;
  $context.close();
  $app.openURL(url);
}