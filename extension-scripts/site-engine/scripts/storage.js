exports.port = () => {
  return $cache.get("server-port") || 8080;
}

exports.setPort = port => {
  $cache.set("server-port", port);
}

exports.indexPage = () => {
  return $cache.get("index-page") || "index.html";
}

exports.setIndexPage = indexPage => {
  $cache.set("index-page", indexPage);
}

exports.browserIndex = () => {
  return $cache.get("browser-index") || 0;
}

exports.setBrowserIndex = index => {
  $cache.set("browser-index", index);
}

exports.showToolbar = () => {
  return $cache.get("show-toolbar") || false;
}

exports.setShowToolbar = value => {
  $cache.set("show-toolbar", value);
}

exports.showProgress = () => {
  const value = $cache.get("show-progress");
  if (value == undefined) {
    return true;
  } else {
    return value;
  }
}

exports.setShowProgress = value => {
  $cache.set("show-progress", value);
}

exports.fullScreen = () => {
  return $cache.get("full-screen") || false;
}

exports.setFullScreen = value => {
  $cache.set("full-screen", value);
}

exports.safeArea = () => {
  return $cache.get("safe-area") || false;
}

exports.setSafeArea = value => {
  $cache.set("safe-area", value);
}

exports.disableScrolling = () => {
  return $cache.get("disable-scrolling") || false;
}

exports.setDisableScrolling = value => {
  $cache.set("disable-scrolling", value);
}

exports.userAgent = () => {
  return $cache.get("user-agent");
}

exports.setUserAgent = value => {
  $cache.set("user-agent", value);
}