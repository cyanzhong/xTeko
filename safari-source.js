var items = $context.safari.items
$ui.menu({
  items: ["页面源码", "所选 HTML", "所选 CSS"],
  handler: function(title, idx) {
    if (idx == 0) {
      $quicklook.open({text: items.source})
    } else if (idx == 1) {
      $quicklook.open({text: items.selection.html})
    } else {
      $quicklook.open({text: JSON.stringify(items.selection.style, 2, null)})
    }
  }
})