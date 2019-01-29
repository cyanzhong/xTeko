$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/MarkupUI.framework").$load();

let lowMemory = $app.env != $env.app;
let widgetHeight = $widget.height;
$widget.height = 500;

$app.strings = {
  "en": {
    "TITLE": "Painting",
    "COPY": "Copy",
    "SHARE": "Share",
    "COPIED": "Copied",
  },
  "zh-Hans": {
    "TITLE": "画图板",
    "COPY": "复制",
    "SHARE": "分享",
    "COPIED": "已复制",
  }
};

$define({
  type: "AKToolbarView",
  props: ["canvas"],
  events: {
    "inlineInkPicker:didSelectColor:": (picker, color) => {
      self.$ORIGinlineInkPicker_didSelectColor(picker, color);
      self.$notify();
    },
    "inlineInkPicker:didSelectTool:": (picker, tool) => {
      self.$ORIGinlineInkPicker_didSelectTool(picker, tool);
      self.$notify();
    },
    "notify": () => {
      let inkPicker = self.$inkPicker();
      let ink = inkPicker.$selectedInk();
      let canvas = self.$canvas();
      canvas.$setInk(ink);

      let identifier = ink.$identifier().rawValue();
      let color = ink.$color().rawValue().hexCode;
      let weight = ink.$weight();
      $cache.set("ink", {
        identifier: identifier,
        color: color,
        weight: weight
      });
    }
  }
});

$define({
  type: "_AKNonMinibarToolbar",
  events: {
    "layoutSubviews": () => {
      self.$ORIGlayoutSubviews();
      var looping = true;
      let cls = $objc("_UIButtonBarButton").$class();
      self.$loopOver(self, view => {
        if (looping && view.$isKindOfClass(cls)) {
          view.$setAlpha(0);
          looping = false;
        }
      });
    },
    "loopOver": (view, handler) => {
      handler(view);

      let subviews = view.$subviews();
      for (var idx=0; idx<subviews.$count(); ++idx) {
        let subview = subviews.$objectAtIndex(idx);
        self.$loopOver(subview, handler);
      }
    }
  }
});

$define({
  type: "PKCanvasView",
  events: {
    "didMoveToWindow": () => {
      self.$ORIGdidMoveToWindow();
      self.$removeGestureRecognizer(self.$pinchGestureRecognizer());
      self.$removeGestureRecognizer(self.$drawingGestureRecognizer());
    },
    "disableWideGamut": () => {
      return lowMemory;
    },
    "visualizationsEnabled": () => {
      return !lowMemory;
    }
  }
});

$define({
  type: "PKCanvasVC: MarkupViewController",
  props: ["canvas"],
  events: {
    "viewDidLoad": () => {
      self.$super().$viewDidLoad();
      self.$navigationItem().$setTitle($l10n("TITLE"));
      self.$setBackgroundColor($color("white").runtimeValue());
      self.$setShowShareButtonInToolbar(true);
      self.$didReceiveMemoryWarning(null);

      let canvas = $objc("PKCanvasView").$new();
      canvas.$setBackgroundColor($color("#FFFFFF").runtimeValue());
      canvas.$setBackgroundImage(null);
      self.$setCanvas(canvas);
      self.$view().$addSubview(canvas);
      self.$setImage($objc("UIImage").$new());

      let toolbar = self.$modernToolbar();
      toolbar.$setCanvas(canvas);

      let picker = toolbar.$inkPicker();
      let ink = getInk();
      if (ink) {
        picker.$setSelectedInk_animated(ink, true);
      } else {
        let identifier = picker.$inkIdentifiers().$objectAtIndex(0);
        picker.$setSelectedInkIdentifier_animated(identifier, true);
      }

      picker.$notifyToolSelected(true);

      let tintColor = $color("tint").runtimeValue();
      ["_shareButton", "_shapesPickerButton", "_attributesPickerButton", "_currentColorButton"].forEach(key => {
        toolbar.$valueForKey(key).$setTintColor(tintColor);
      });

      let doneButton = $objc("UIBarButtonItem").$alloc().$initWithBarButtonSystemItem_target_action(0, self, "closeButtonTapped");
      self.$navigationItem().$setLeftBarButtonItem(doneButton);
    },
    "viewDidLayoutSubviews": () => {
      self.$super().$viewDidLayoutSubviews();
      let canvas = self.$canvas();
      let maxBounds = self.$view().$bounds();
      let toolbarBounds = self.$modernToolbar().$bounds();
      canvas.$setFrame({
        "x": 0,
        "y": 0,
        "width": maxBounds.width,
        "height": maxBounds.height - toolbarBounds.height
      });
    },
    "closeButtonTapped": () => {
      self.$dismissViewControllerAnimated_completion(true, null);
      $widget.height = widgetHeight;
    },
    "_toolbarShareButtonTapped:": () => {

      let canvas = self.$canvas();
      let bounds = canvas.$bounds();
      let size = {"width": bounds.width, "height": bounds.height};
      let scale = lowMemory ? 1 : $device.info.screen.scale;
      let renderer = $objc("PKImageRenderer").$alloc().$initWithSize_scale_useMetal(size, scale, true);

      let drawing = canvas.$drawing();
      let block = $block("void, UIImage *", image => {
        
        $thread.main({

          handler: async() => {

            function copyImage() {
              $clipboard.image = image.rawValue();
              $device.taptic(2);
              $ui.toast($l10n("COPIED"));
            }

            function shareImage() {
              $share.sheet(image.rawValue());
            }

            if (lowMemory) {
              copyImage();
            } else {
              let {index} = await $ui.menu([$l10n("COPY"), $l10n("SHARE")]);
              if (index == 0) {
                copyImage();
              } else {
                shareImage();
              }
            }
          }
        });
      });
      
      renderer.$renderDrawing_completion(drawing, block);
    }
  },
  classEvents: {
    "_isInLowMemoryEnvironment": () => {
      return lowMemory;
    }
  }
});

function getInk() {
  let _ink = $cache.get("ink");
  if (_ink) {
    let identifier = _ink.identifier;
    let color = $color(_ink.color).runtimeValue();
    let weight = _ink.weight;
    let ink = $objc("PKInk").$inkWithIdentifier_color_weight(identifier, color, weight);
    return ink;
  } else {
    return null;
  }
}

let canvasVC = $objc("PKCanvasVC").$new();
let navigator = $objc("UINavigationController").$alloc().$initWithRootViewController(canvasVC);
let rootVC = $ui.controller.runtimeValue();
rootVC.$presentViewController_animated_completion(navigator, true, null);