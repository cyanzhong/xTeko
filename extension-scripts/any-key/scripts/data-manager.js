exports.loadPlugins = () => {
  return $cache.get("plugins") || defaultPlugins();
}

exports.savePlugins = plugins => {
  $cache.set("plugins", plugins);
}

function defaultPlugins() {
  let file = $file.read("assets/default.json");
  let plugins = JSON.parse(file.string);
  return plugins.map(plugin => {
    return {
      name: $l10n(plugin.name),
      icon: plugin.icon,
      file: plugin.file
    }
  });
}