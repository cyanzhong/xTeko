const Keys = {
  Categories: "categories",
  Items: "items",
}

function getCategories() {
  var cache = $cache.get(Keys.Categories)
  return cache || [$l10n("CATEGORY_COMMON"), $l10n("CATEGORY_QUICK_REPLY"), $l10n("CATEGORY_BYEBYE")]
}

function setCategories(categories) {
  $cache.set(Keys.Categories, categories)
  var items = getAllItems()
  for (key in items) {
    if (categories.indexOf(key) < 0) {
      items[key] = []
    }
  }
  setAllItems(items)
}

function getItems(category) {
  return getAllItems()[category] || ["Item 1", "Item 2", "Item 3"]
}

function setItems(category, items) {
  var allItems = getAllItems()
  allItems[category] = items
  setAllItems(allItems)
}

function getAllItems() {
  var cache = $cache.get(Keys.items)
  return cache || {}
}

function setAllItems(items) {
  $cache.set(Keys.items, items)
}

module.exports = {
  getCategories: getCategories,
  setCategories: setCategories,
  getItems: getItems,
  setItems: setItems
}