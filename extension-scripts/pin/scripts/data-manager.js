var helper = require("./helper");

function init() {

  var text = $clipboard.text;

  if (text == undefined || text.length == 0) {
    return;
  }

  var items = getTextItems();
  var index = items.indexOf(text);

  if (index != -1) {
    helper.arrayRemove(items, index);
  }

  items.unshift(text);
  setTextItems(items);
}

function getTextItems() {
  return $cache.get("clipboard-items") || [];
}

function setTextItems(items) {
  $cache.set("clipboard-items", items);
}

function clearTextItems() {
  $cache.remove("clipboard-items");
}

function defaultActionItems() {
  return JSON.parse($file.read("assets/actions.json").string);
}

function getActionItems() {
  return $cache.get("action-items") || [
    {
      "name": $l10n("AT_GOOGLE"),
      "pattern": "http://translate.google.cn/?hl=en#auto/zh-CN/%@",
      "icon": "icon_179.png"
    },
    {
      "name": $l10n("AO_URL"),
      "pattern": "open-url://%@",
      "icon": "icon_020.png"
    },
    {
      "name": $l10n("AW_WIKI"),
      "pattern": "https://zh.wikipedia.org/wiki/%@",
      "icon": "icon_024.png"
    },
    {
      "name": $l10n("AM_APPLE"),
      "pattern": "http://maps.apple.com/?q=%@",
      "icon": "icon_043.png"
    },
    {
      "name": $l10n("AS_TAOBAO"),
      "pattern": "taobao://s.taobao.com/?q=%@",
      "icon": "icon_072.png"
    }
  ];
}

function setActionItems(items) {
  $cache.set("action-items", items);
}

function getSearchEngine() {
  return $cache.get("search-engine") || "x-web-search://?";
}

function setSearchEngine(engine) {
  $cache.set("search-engine", engine);
}

module.exports = {
  init: init,
  getTextItems: getTextItems,
  setTextItems: setTextItems,
  clearTextItems: clearTextItems,
  defaultActionItems: defaultActionItems,
  getActionItems: getActionItems,
  setActionItems: setActionItems,
  getSearchEngine: getSearchEngine,
  setSearchEngine: setSearchEngine,
}