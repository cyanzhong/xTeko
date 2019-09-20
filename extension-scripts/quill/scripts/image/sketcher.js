$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/MarkupUI.framework").$load();
$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/PencilKit.framework").$load();

let majorVersion = parseInt($device.info.version.split(".")[0]);
let ios13 = majorVersion >= 13;

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
    "paletteViewSelectedToolInkDidChange:": sender => {
      self.$ORIGpaletteViewSelectedToolInkDidChange(sender);
      self.$selectInk(sender.$selectedToolInk());
    },
    "inlineInkPicker:didSelectColor:": (picker, color) => {
      self.$ORIGinlineInkPicker_didSelectColor(picker, color);
      self.$selectInk(picker.$selectedInk());
    },
    "inlineInkPicker:didSelectTool:": (picker, tool) => {
      self.$ORIGinlineInkPicker_didSelectTool(picker, tool);
      self.$selectInk(picker.$selectedInk());
    },
    "selectInk:": ink => {
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
  type: `MMCanvasVC: ${ios13 ? "UIViewController<PKToolPickerObserver>" : "MarkupViewController"}`,
  props: ["canvas", "topLine", "bottomLine"],
  events: {
    "viewDidLoad": () => {
      self.$super().$viewDidLoad();
      self.$setBackgroundColor($color("white").ocValue());
      self.$view().$setBackgroundColor($color("white").ocValue());
      self.$setShowShareButtonInToolbar(true);
      self.$didReceiveMemoryWarning(null);
      self.$resetCanvas();
      self.$setImage($objc("UIImage").$new());

      if (ios13) {
        const that = self;
        const barItem = (name, action) => {
          const image = $objc("UIImage").$systemImageNamed(name);
          const item = $objc("UIBarButtonItem").$alloc().$initWithImage_style_target_action(image, 0, that, action);
          return item;
        }

        const share = barItem("square.and.arrow.up", "shareButtonTapped");
        const undo = barItem("arrow.uturn.left.circle", "undoButtonTapped");
        const redo = barItem("arrow.uturn.right.circle", "redoButtonTapped");
        const items = $objc("NSMutableArray").$array();
        items.$addObject(share);
        items.$addObject(redo);
        items.$addObject(undo);

        self.$navigationItem().$setRightBarButtonItems(items);
      } else {
        let canvas = self.$canvas();
        let toolbar = self.$modernToolbar();
        toolbar.$setCanvas(canvas);

        let tintColor = $color("tint").runtimeValue();
        let picker = toolbar.$inkPicker();
        let ink = getInk();

        if (ink) {
          picker.$setSelectedInk_animated(ink, true);
        } else {
          let identifier = picker.$inkIdentifiers().$objectAtIndex(0);
          picker.$setSelectedInkIdentifier_animated(identifier, true);
        }

        picker.$notifyToolSelected(true);

        let attributes = [
          "_shareButton",
          "_shapesPickerButton",
          "_attributesPickerButton",
          "_currentColorButton"
        ];
        attributes.forEach(key => {
          toolbar.$valueForKey(key).$setTintColor(tintColor);
        });
      }

      let doneButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action($l10n("DONE"), 0, self, "doneButtonTapped");
      let clearButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action($l10n("CLEAR"), 0, self, "clearButtonTapped");
      let settingButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action($l10n("SETTINGS"), 0, self, "settingButtonTapped");

      let navButtons = NSMutableArray.$new();
      navButtons.$addObject(doneButton);
      navButtons.$addObject(clearButton);

      if (!lowMemory) {
        navButtons.$addObject(settingButton);
      }
      
      self.$navigationItem().$setLeftBarButtonItems(navButtons);
    },
    "viewDidAppear:": animated => {
      self.$super().$viewDidAppear(animated);
      if (ios13) {
        self.$resetToolbar();
      }
    },
    "viewWillDisappear:": animated => {
      self.$super().$viewWillDisappear(animated);
      if (ios13) {
        self.$toolbar().$setVisible_forFirstResponder(false, null);
      }
    },
    "viewDidLayoutSubviews": () => {
      self.$super().$viewDidLayoutSubviews();

      let canvas = self.$canvas();
      let maxBounds = self.$view().$bounds();
      let toolbarHeight = ios13 ? 76 : self.$modernToolbar().$bounds().height;
      let pageHeight = maxBounds.height - toolbarHeight;

      let canvasWidth = maxBounds.width;
      let canvasHeight = (() => {
        let pageSize = $cache.get("page-size") || 2;
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
    "resetCanvas": () => {
      (() => {
        const canvas = self.$canvas();
        if (canvas) {
          canvas.$removeFromSuperview();
        }

        const topLine = self.$topLine();
        if (topLine) {
          topLine.$removeFromSuperview();
        }

        const bottomLine = self.$bottomLine();
        if (bottomLine) {
          bottomLine.$removeFromSuperview();
        }
      })();

      const canvas = $objc("PKCanvasView").$new();
      canvas.$setBackgroundColor($color("#FFFFFF").runtimeValue());
      canvas.$setBackgroundImage(null);
      self.$view().$addSubview(canvas);
      self.$setCanvas(canvas);

      let lineColor = $color("lightGray").runtimeValue();
      let topLine = $objc("UIView").$new();
      topLine.$setBackgroundColor(lineColor);
      self.$setTopLine(topLine);
      self.$view().$addSubview(topLine);

      let bottomLine = $objc("UIView").$new();
      bottomLine.$setBackgroundColor(lineColor);
      self.$setBottomLine(bottomLine);
      self.$view().$addSubview(bottomLine);
    },
    "resetToolbar": () => {
      const window = $objc("UIApplication").$sharedApplication().$keyWindow();
      const picker = $objc("PKToolPicker").$sharedToolPickerForWindow(window);
      self.$setToolbar(picker);

      const canvas = self.$canvas();
      picker.$addObserver(canvas);
      picker.$setVisible_forFirstResponder(true, canvas);
      canvas.$becomeFirstResponder();
    },
    "doneButtonTapped": () => {
      exportImage(self.$canvas(), image => {
        _handler(image);
      });

      self.$dismissViewControllerAnimated_completion(true, null);
      $widget.height = widgetHeight;
    },
    "clearButtonTapped": () => {
      if (ios13) {
        self.$resetCanvas();
        self.$resetToolbar();
      } else {
        self.$canvas().$eraseAll();
      }
    },
    "settingButtonTapped": () => settingButtonTapped(),
    "_toolbarShareButtonTapped:": () => {
      self.$shareButtonTapped();
    },
    "shareButtonTapped": () => {
      exportImage(self.$canvas(), async(image) => {
        
        function copyImage() {
          $clipboard.image = image;
          $device.taptic(2);
          $ui.toast($l10n("COPIED"));

          if ($cache.get("auto-clear")) {
            canvasVC.$clearButtonTapped();
          }
        }

        function shareImage() {
          $share.sheet(image);
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
    },
    "undoButtonTapped": () => {
      const manager = self.$canvas().$undoManager();
      if (manager.$canUndo()) {
        manager.$undo();
      }
    },
    "redoButtonTapped": () => {
      const manager = self.$canvas().$undoManager();
      if (manager.$canRedo()) {
        manager.$redo();
      }
    }
  },
  classEvents: {
    "_isInLowMemoryEnvironment": () => {
      return lowMemory;
    }
  }
});

if (!lowMemory) {
  $define({
    type: "PKSettingVC: UIViewController<UITableViewDataSource, UITableViewDelegate>",
    props: ["cells", "tableView", "completionBlock"],
    events: {
      "viewDidLoad": () => {
        self.$super().$viewDidLoad();
        self.$view().$setBackgroundColor($color("white").runtimeValue());
  
        let sizeCell = (() => {
  
          let cell = $objc("UITableViewCell").$alloc().$initWithStyle_reuseIdentifier(0, "sizeCell");
          cell.$textLabel().$setText($l10n("CANVAS_SIZE"));
  
          let items = NSMutableArray.$new();
          items.$addObject($l10n("FULL_SCREEN"));
          items.$addObject($l10n("A4_PAPER"));
          items.$addObject($l10n("SQUARE"));
  
          let control = $objc("UISegmentedControl").$alloc().$initWithItems(items);
          control.$setTintColor($color("tint").runtimeValue());
          control.$setSelectedSegmentIndex($cache.get("page-size") || 0);
          control.$addTarget_action_forControlEvents(self, "pageSizeChanged:", 1 << 12);
          cell.$setAccessoryView(control);
  
          return cell;
        })();
  
        let clearCell = (() => {
  
          let cell = $objc("UITableViewCell").$alloc().$initWithStyle_reuseIdentifier(0, "clearCell");
          cell.$textLabel().$setText($l10n("CLEAR_AFTER_COPYING"));
  
          let switcher = $objc("UISwitch").$new();
          switcher.$setOnTintColor($color("tint").runtimeValue());
          switcher.$setOn($cache.get("auto-clear") || false);
          switcher.$addTarget_action_forControlEvents(self, "clearBehaviorChanged:", 1 << 12);
          cell.$setAccessoryView(switcher);
  
          return cell;
        })();
  
        let cells = NSMutableArray.$new();
        cells.$addObject(sizeCell);
        cells.$addObject(clearCell);
        self.$setCells(cells);
  
        let tableView = $objc("UITableView").$alloc().$initWithFrame_style({
          "x": 0,
          "y": 0,
          "width": 0,
          "height": 0
        }, 1);
  
        tableView.$setAllowsSelection(false);
        tableView.$setDataSource(self);
        tableView.$setDelegate(self);
  
        self.$setTableView(tableView);
        self.$view().$addSubview(tableView);
      },
      "viewDidLayoutSubviews": () => {
        self.$super().$viewDidLayoutSubviews();
  
        let frame = self.$view().$bounds();
        self.$tableView().$setFrame(frame);
      },
      "tableView:numberOfRowsInSection:": (tableView, section) => {
        return self.$cells().$count();
      },
      "tableView:cellForRowAtIndexPath:": (tableView, indexPath) => {
        return self.$cells().$objectAtIndex(indexPath.$row());
      },
      "tableView:didSelectRowAtIndexPath:": (tableView, indexPath) => {
        tableView.$deselectRowAtIndexPath_animated(indexPath, true);
      },
      "pageSizeChanged": sender => {
        let index = sender.$selectedSegmentIndex();
        $cache.set("page-size", index);
        self.$notifyChanges();
      },
      "clearBehaviorChanged": sender => {
        let on = sender.$isOn();
        $cache.set("auto-clear", on);
        self.$notifyChanges();
      },
      "notifyChanges": () => self.$completionBlock()()
    }
  });
}

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

function settingButtonTapped() {
  let settingVC = $objc("PKSettingVC").$new();
  settingVC.$setCompletionBlock(() => {
    let view = _canvasVC.$view();
    view.$setNeedsLayout();
    view.$layoutIfNeeded();
  });
  
  let rootVC = $ui.controller.runtimeValue();
  _navigator.$pushViewController_animated(settingVC, true);
}

function exportImage(canvas, handler) {
  let bounds = canvas.$bounds();
  let size = {"width": bounds.width, "height": bounds.height};
  let scale = lowMemory ? 1 : $device.info.screen.scale;
  let renderer = $objc("PKImageRenderer").$alloc().$initWithSize_scale_useMetal(size, scale, true);
  let drawing = canvas.$drawing();
  let block = $block("void, UIImage *", image => {
    $thread.main({
      handler: async() => {
        handler(image.rawValue());
      }
    });
  });
  renderer.$renderDrawing_completion(drawing, block);
}

let _handler = null;
let _navigator = null;
let _canvasVC = null;
exports.open = handler => {
  _handler = handler;
  
  let canvasVC = $objc("MMCanvasVC").$new();
  _canvasVC = canvasVC;

  let navigator = $objc("PKNavigator").$alloc().$initWithRootViewController(canvasVC);
  _navigator = navigator;
  navigator.$setModalPresentationStyle(0);
  
  let rootVC = $ui.controller.runtimeValue();
  rootVC.$presentViewController_animated_completion(navigator, true, null);
}