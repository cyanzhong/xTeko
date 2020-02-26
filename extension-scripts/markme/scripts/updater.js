exports.check = async() => {

  const url = "https://xteko.com/store/fetch?id=140";
  const {data} = await $http.get(url);
  const latestVersion = data.extension.version;
  const currentVersion = $file.read("version.conf").string;

  if (latestVersion === currentVersion) {
    return;
  }

  const actions = [$l10n("UPDATE"), $l10n("CANCEL")];
  const {index} = await $ui.alert({
    title: $l10n("FOUND_NEW_VERSION"),
    message: $l10n("UPDATE_TO_NEW_VERSION"),
    actions: actions
  });

  if (index !== 0) {
    return;
  }

  const pkgURL = data.extension.url;
  const pkgName = $addin.current.name;
  const redirURL = `jsbox://import?url=${encodeURIComponent(pkgURL)}&name=${encodeURIComponent(pkgName)}`;
  $app.openURL(redirURL);
  $app.close();
}