exports.check = async() => {

  let url = "https://xteko.com/store/fetch?id=131";
  let {data} = await $http.get(url);
  let latestVersion = data.extension.version;
  let currentVersion = $file.read("version.conf").string;

  if (latestVersion === currentVersion) {
    return;
  }

  let actions = [$l10n("UPDATE"), $l10n("CANCEL")];
  let {index} = await $ui.alert({
    title: $l10n("FOUND_NEW_VERSION"),
    message: $l10n("UPDATE_TO_NEW_VERSION"),
    actions: actions
  });

  if (index !== 0) {
    return;
  }

  let pkgURL = data.extension.url;
  let pkgName = $addin.current.name;
  let redirURL = `jsbox://import?url=${encodeURIComponent(pkgURL)}&name=${encodeURIComponent(pkgName)}`;
  $app.openURL(redirURL);
  $app.close();
}