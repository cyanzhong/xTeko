exports.setup = () => {
  $objc("NSBundle").$bundleWithPath("/System/Library/Frameworks/Photos.framework").$load();
  $objc("NSBundle").$bundleWithPath("/System/Library/Frameworks/PhotosUI.framework").$load();

  $define_struct({
    name: "UIEdgeInsets",
    props: [
      {"name": "top", "type": "CGFloat"},
      {"name": "left", "type": "CGFloat"},
      {"name": "bottom", "type": "CGFloat"},
      {"name": "right", "type": "CGFloat"},
    ]
  });
}

exports.loadImage = name => {
  const file = $file.read(`assets/${name}.png`);
  return $objc("UIImage").$imageWithData_scale(file, 3);
}

exports.successTaptic = () => {
  $objc("UINotificationFeedbackGenerator").$new().$notificationOccurred(0);
}

exports.convertCollections = collections => {
  const results = [];
  for (let idx=0; idx<collections.$count(); ++idx) {
    const collection = collections.$objectAtIndex(idx);
    results.push(collection.$localizedTitle().jsValue());
  }
  return results;
}

exports.userCollections = () => {
  const collections = $objc("PHCollectionList").$fetchTopLevelUserCollectionsWithOptions(null);
  const results = $objc("NSMutableArray").$array();
  for (let idx=0; idx<collections.$count(); ++idx) {
    const collection = collections.$objectAtIndex(idx);
    if (collection.$isKindOfClass($objc("PHAssetCollection").$class())) {
      results.$addObject(collection);
    }
  }
  return results;
}