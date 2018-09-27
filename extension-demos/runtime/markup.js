$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/MarkupUI.framework").$load();
$defc("NSTemporaryDirectory", "NSString *");

$define({
  type: "MarkupVC: MarkupViewController",
  events: {
    "viewDidLoad": () => {
      self.$super().$viewDidLoad();
      self.$navigationItem().$setTitle("Markup");
      self.$setBackgroundColor($color("white").runtimeValue());

      let tintColor = $color("tint").runtimeValue();
      let toolbar = self.$modernToolbar();
      
      ["_shareButton", "_shapesPickerButton", "_attributesPickerButton", "_currentColorButton"].forEach(key => {
        toolbar.$valueForKey(key).$setTintColor(tintColor);
      });

      let closeButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action("Close", 0, self, "closeButtonTapped");
      self.$navigationItem().$setLeftBarButtonItem(closeButton);
    },
    "closeButtonTapped": () => {
      self.$dismissViewControllerAnimated_completion(true, null);
    },
    "_toolbarShareButtonTapped:": () => {
      let path = NSTemporaryDirectory().$stringByAppendingPathComponent("markup.jpeg");
      let url = NSURL.$fileURLWithPath(path);
      self.$writeToURL_error(url, null);

      let file = NSData.$dataWithContentsOfURL(url).$rawValue();
      $share.sheet(file);
    }
  }
});

let result = await $photo.pick();
let image = result.image;

if (!image) {
  return;
}

let markupVC = $objc("MarkupVC").$new();
markupVC.$setImage(image.runtimeValue());
markupVC.$setShowShareButtonInToolbar(true);

let navigator = $objc("UINavigationController").$alloc().$initWithRootViewController(markupVC);
let rootVC = $ui.controller.runtimeValue();
rootVC.$presentViewController_animated_completion(navigator, true, null);