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
  props: ["resolveBlock", "rejectBlock"],
  events: {
    "documentCameraControllerDidCancel": sender => {
      let reject = self.$rejectBlock();
      dismiss(sender, () => reject("Did cancel."));
    },
    "documentCameraController:didFinishWithDocInfoCollection:imageCache:warnUser:": (sender, info, cache) => {
      let document = $objc("DCScannedDocument").$alloc().$initWithDocInfoCollection_imageCache(info, cache);
      let count = document.$docInfos().$count();
      let images = [];
      for (let idx=0; idx<count; ++idx) {
        let image = document.$imageOfPageAtIndex(idx);
        images.push(image.rawValue());
      }
      let resolve = self.$resolveBlock();
      dismiss(sender, () => resolve(images));
    }
  }
});

function dismiss(vc, blk) {
  let handler = blk ? $block("void", blk) : null;
  vc.$dismissViewControllerAnimated_completion(true, handler);
}

function scanDocument() {
  return new Promise((resolve, reject) => {
    let camVC = $objc("DocCamVC").$alloc().$initWithDelegate(null);
    camVC.$setResolveBlock(resolve);
    camVC.$setRejectBlock(reject);
    let rootVC = $ui.controller.runtimeValue();
    rootVC.$presentViewController_animated_completion(camVC, true, null);
  });
}

module.exports.scanDocument = scanDocument;
