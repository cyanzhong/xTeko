$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/MarkupUI.framework").$load();

let majorVersion = parseInt($device.info.version.split(".")[0]);
if (majorVersion < 12) {
  alert($l10n("UPGRADE_IOS"));
  return;
}

let lowMemory = $app.env != $env.app;
let widgetHeight = $widget.height;
$widget.height = 500;

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
  type: "PKNavigator: UINavigationController",
  events: {
    "supportedInterfaceOrientations": () => {
      return 1 << 1;
    }
  }
});

$define({
  type: "PKCanvasVC: MarkupViewController",
  props: ["canvas", "topLine", "bottomLine"],
  events: {
    "viewDidLoad": () => {
      self.$super().$viewDidLoad();
      self.$setBackgroundColor($color("white").runtimeValue());
      self.$setShowShareButtonInToolbar(true);
      self.$didReceiveMemoryWarning(null);

      let canvas = $objc("PKCanvasView").$new();
      canvas.$setBackgroundColor($color("#FFFFFF").runtimeValue());
      canvas.$setBackgroundImage(null);
      self.$setCanvas(canvas);
      self.$view().$addSubview(canvas);
      self.$setImage($objc("UIImage").$new());

      let lineColor = $color("lightGray").runtimeValue();
      let topLine = $objc("UIView").$new();
      topLine.$setBackgroundColor(lineColor);
      self.$setTopLine(topLine);
      self.$view().$addSubview(topLine);

      let bottomLine = $objc("UIView").$new();
      bottomLine.$setBackgroundColor(lineColor);
      self.$setBottomLine(bottomLine);
      self.$view().$addSubview(bottomLine);

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

      let doneButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action($l10n("DONE"), 0, self, "doneButtonTapped");
      let clearButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action($l10n("CLEAR"), 0, self, "clearButtonTapped");

      let navButtons = NSMutableArray.$new();
      navButtons.$addObject(doneButton);
      navButtons.$addObject(clearButton);      
      self.$navigationItem().$setLeftBarButtonItems(navButtons);
    },
    "viewDidLayoutSubviews": () => {
      self.$super().$viewDidLayoutSubviews();

      let canvas = self.$canvas();
      let maxBounds = self.$view().$bounds();
      let toolbarBounds = self.$modernToolbar().$bounds();
      let pageHeight = maxBounds.height - toolbarBounds.height;

      let canvasWidth = maxBounds.width;
      let canvasHeight = (() => {
        let pageSize = $cache.get("page-size") || 0;
        switch (pageSize) {
          case 0: return pageHeight;
          case 1: return Math.min(pageHeight, maxBounds.width * 1.4142);
          case 2: return maxBounds.width;
        }
      })();

      canvas.$setFrame({
        "x": 0,
        "y": (pageHeight - canvasHeight) * 0.5,
        "width": canvasWidth,
        "height": canvasHeight
      });

      let canvasFrame = canvas.$frame();
      let lineHeight = 1.0 / $device.info.screen.scale;

      self.$topLine().$setFrame({
        "x": 0,
        "y": canvasFrame.y,
        "width": canvasFrame.width,
        "height": lineHeight
      });

      self.$bottomLine().$setFrame({
        "x": 0,
        "y": canvasFrame.y + canvasFrame.height,
        "width": canvasFrame.width,
        "height": lineHeight
      });
    },
    "doneButtonTapped": () => {
      const that = self;
      const canvas = self.$canvas();
      renderImage(canvas, image => {
        if (_handler) {
          _handler(image.rawValue());
        }
        that.$dismissViewControllerAnimated_completion(true, null);
        $widget.height = widgetHeight;
      });
    },
    "clearButtonTapped": () => self.$canvas().$eraseAll(),
    "_toolbarShareButtonTapped:": () => {
      const canvas = self.$canvas();
      renderImage(canvas, async(image) => {
        function copyImage() {
          $clipboard.image = image.rawValue();
          $device.taptic(2);
          $ui.toast($l10n("COPIED"));

          if ($cache.get("auto-clear")) {
            canvasVC.$clearButtonTapped();
          }
        }

        function shareImage() {
          $share.sheet(image.rawValue());
        }

        if (lowMemory) {
          copyImage();
        } else {
          let {index} = await $ui.menu([$l10n("COPY"), $l10n("SHARE")]);
          if (index === 0) {
            copyImage();
          } else {
            shareImage();
          }
        }
      });
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

function renderImage(canvas, handler) {
  let bounds = canvas.$bounds();
  let size = {"width": bounds.width, "height": bounds.height};
  let scale = lowMemory ? 1 : $device.info.screen.scale;
  let renderer = $objc("PKImageRenderer").$alloc().$initWithSize_scale_useMetal(size, scale, true);
  let drawing = canvas.$drawing();

  let block = $block("void, UIImage *", image => {
    $thread.main({
      handler: () => {
        handler(image);
      }
    });
  });

  renderer.$renderDrawing_completion(drawing, block);
}

let _handler = null;
exports.open = handler => {
  _handler = handler;
  let canvasVC = $objc("PKCanvasVC").$new();
  let navigator = $objc("PKNavigator").$alloc().$initWithRootViewController(canvasVC);
  let rootVC = $ui.controller.runtimeValue();
  rootVC.$presentViewController_animated_completion(navigator, true, null);
}