$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/DocumentCamera.framework").$load();

$define({
  type: "ICDocCamExtractedDocumentViewController",
  events: {
    "viewDidLoad": () => {
      self.$ORIGviewDidLoad();
      let tintColor = $color("tint").runtimeValue();
      self.$recropButtonItem().$setTintColor(tintColor);
      self.$compactFilterButtonItem().$setTintColor(tintColor);
      self.$rotateButtonItem().$setTintColor(tintColor);
      self.$trashButtonItem().$setTintColor(tintColor);
    }
  }
});

$define({
  type: "DocCamVC: DCDocumentCameraViewController_InProcess",
  events: {
    "documentCameraControllerDidCancel": sender => dismiss(sender),
    "documentCameraController:didFinishWithDocInfoCollection:imageCache:warnUser:": (sender, info, cache) => {
      let document = $objc("DCScannedDocument").$alloc().$initWithDocInfoCollection_imageCache(info, cache);
      let count = document.$docInfos().$count();
      let images = [];
      for (let idx=0; idx<count; ++idx) {
        let image = document.$imageOfPageAtIndex(idx);
        images.push(image.rawValue());
      }
      dismiss(sender, () => {
        if (_handler) {
          _handler(images);
        }
      });
    }
  }
});

function dismiss(vc, blk) {
  let handler = blk ? $block("void", blk) : null;
  vc.$dismissViewControllerAnimated_completion(true, handler);
}

let _handler = null;
exports.open = handler => {
  const ios13 = parseInt($device.info.version.split(".")[0]) >= 13;
  if (ios13 && typeof $photo.scan === "function") {
    $photo.scan().then(response => {
      let images = response.results;
      if (images) {
        handler(images);
      }
    });
  } else {
    _handler = handler;
    let camVC = $objc("DocCamVC").$alloc().$initWithDelegate(null);
    let rootVC = $ui.controller.runtimeValue();
    rootVC.$presentViewController_animated_completion(camVC, true, null);
  }
}