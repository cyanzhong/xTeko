exports.getHistory = () => {
  return $cache.get("history") || [];
}

exports.setHistory = history => {
  $cache.set("history", history);
}