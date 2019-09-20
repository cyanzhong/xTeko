require("./cell");

const util = require("./util");
const manager = $objc("PHImageManager").$defaultManager();
const columns = 4;
const spacing = 5;
let assets = null;
let selectedAssets = $objc("NSMutableSet").$set();

$define({
  type: "PhotosWaterfallController: UIViewController<UICollectionViewDataSource, CHTCollectionViewDelegateWaterfallLayout>",
  props: ["deleteButton", "shareButton", "assetCollection", "collectionView"],
  events: {
    "viewDidLoad": () => {
      self.$super().$viewDidLoad();

      const deleteButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action($l10n("DELETE"), 0, self, "delete");
      deleteButton.$setEnabled(false);
      self.$setDeleteButton(deleteButton);
      
      const shareButton = $objc("UIBarButtonItem").$alloc().$initWithTitle_style_target_action($l10n("SHARE"), 0, self, "share");
      shareButton.$setEnabled(false);
      self.$setShareButton(shareButton);

      const navButtons = $objc("NSMutableArray").$array();
      navButtons.$addObject(deleteButton);
      navButtons.$addObject(shareButton);
      self.$navigationItem().$setRightBarButtonItems(navButtons);
      
      const frame = {"x": 0, "y": 0, "width": 0, "height": 0};
      const layout = $objc("CHTCollectionViewWaterfallLayout").$new();
      layout.$setColumnCount(columns);
      layout.$setSectionInset({"top": spacing, "left": spacing, "bottom": spacing, "right": spacing});
      layout.$setMinimumColumnSpacing(spacing);
      layout.$setMinimumInteritemSpacing(spacing);

      const collectionView = $objc("UICollectionView").$alloc().$initWithFrame_collectionViewLayout(frame, layout);
      collectionView.$setBackgroundColor($color("white").ocValue());
      collectionView.$setAlwaysBounceVertical(true);
      collectionView.$registerClass_forCellWithReuseIdentifier($objc("PhotosWaterfallCell").$class(), "id");
      collectionView.$setDataSource(self);
      collectionView.$setDelegate(self);

      self.$setCollectionView(collectionView);
      self.$view().$addSubview(collectionView);
      self.$reloadData();

      const center = $objc("NSNotificationCenter").$defaultCenter();
      center.$addObserver_selector_name_object(self, "enterForeground", "UIApplicationWillEnterForegroundNotification", null);
    },
    "viewDidLayoutSubviews": () => {
      self.$super().$viewDidLayoutSubviews();
      self.$collectionView().$setFrame(self.$view().$bounds());
    },
    "reloadData": () => {
      const options = $objc("PHFetchOptions").$new();
      const descriptor = $objc("NSSortDescriptor").$sortDescriptorWithKey_ascending("creationDate", false);
      const descriptors = $objc("NSMutableArray").$array();
      descriptors.$addObject(descriptor);
      options.$setSortDescriptors(descriptors);

      selectedAssets.$removeAllObjects();
      const collection = self.$assetCollection();
      const name = collection ? collection.$localizedTitle().jsValue() : $l10n("ALL_PHOTOS");
      assets = (() => {
        if (collection) {
          return $objc("PHAsset").$fetchAssetsInAssetCollection_options(collection, options);
        } else {
          return $objc("PHAsset").$fetchAssetsWithOptions(options);
        }
      })();

      const title = `${name} (${assets.$count()})`;
      self.$navigationItem().$setTitle(title);

      const deleteButton = self.$deleteButton();
      if (deleteButton) {
        deleteButton.$setEnabled(false);
      }

      const shareButton = self.$shareButton();
      if (shareButton) {
        shareButton.$setEnabled(false);
      }
    },
    "enterForeground": () => {
      self.$reloadData();
      self.$collectionView().$reloadData();
    },
    "delete": () => {
      const library = $objc("PHPhotoLibrary").$sharedPhotoLibrary();
      const that = self;
      const assetsToDelete = selectedAssets.$allObjects();
      const indexPaths = $objc("NSMutableArray").$array();

      for (let idx=0; idx<assetsToDelete.$count(); ++idx) {
        const asset = assetsToDelete.$objectAtIndex(idx);
        const index = assets.$indexOfObject(asset);
        const indexPath = $objc("NSIndexPath").$indexPathForItem_inSection(index, 0);
        indexPaths.$addObject(indexPath);
      }

      library.$performChanges_completionHandler($block("void", () => {
        $objc("PHAssetChangeRequest").$deleteAssets(assetsToDelete);
      }), $block("void, BOOL, NSError *", (success, error) => {
        if (!success) {
          return;
        }

        util.successTaptic();
        $thread.main({
          handler: () => {
            that.$reloadData();
            that.$collectionView().$deleteItemsAtIndexPaths(indexPaths);
          }
        });
      }));
    },
    "share": () => {
      const assets = selectedAssets.$allObjects();
      const images = [];

      const options = $objc("PHImageRequestOptions").$new();
      options.$setSynchronous(true);
      options.$setDeliveryMode(1);
      options.$setResizeMode(0);
      const size = {"width": -1, "height": -1};

      for (let idx=0; idx<assets.$count(); ++idx) {
        const asset = assets.$objectAtIndex(idx);
        const handler = $block("void, UIImage *, NSDictionary *", (image, info) => {
          images.push(image.jsValue());
        });
        manager.$requestImageForAsset_targetSize_contentMode_options_resultHandler(asset, size, 0, options, handler);
      }

      $share.sheet(images);
    },
    "collectionView:numberOfItemsInSection:": (view, section) => {
      return assets.$count();
    },
    "collectionView:layout:sizeForItemAtIndexPath:": (view, layout, indexPath) => {
      const asset = self.$assetAtIndexPath(indexPath);
      return {"width": asset.$pixelWidth(), "height": asset.$pixelHeight()};
    },
    "collectionView:cellForItemAtIndexPath:": (view, indexPath) => {
      const cell = view.$dequeueReusableCellWithReuseIdentifier_forIndexPath("id", indexPath);

      const asset = self.$assetAtIndexPath(indexPath);
      cell.$setAssetIdentifier(asset.$localIdentifier());
      const selected = selectedAssets.$containsObject(asset);
      cell.$setSelected(selected);

      const pixelWidth = asset.$pixelWidth();
      const pixelHeight = asset.$pixelHeight();
      const maxWidth = $device.info.screen.width * $device.info.screen.scale;
      const scale = maxWidth * (1.0 / columns) / pixelWidth;
      const size = {"width": pixelWidth * scale, "height": pixelHeight * scale};

      const handler = $block("void, UIImage *, NSDictionary *", (image, info) => {
        if (cell.$assetIdentifier().$isEqualToString(asset.$localIdentifier())) {
          cell.$setImage(image);
        }
      });
    
      manager.$requestImageForAsset_targetSize_contentMode_options_resultHandler(asset, size, 0, null, handler);
      return cell;
    },
    "collectionView:didSelectItemAtIndexPath:": (view, indexPath) => {
      view.$deselectItemAtIndexPath_animated(indexPath, true);

      const asset = self.$assetAtIndexPath(indexPath);
      const cell = view.$cellForItemAtIndexPath(indexPath);
      if (selectedAssets.$containsObject(asset)) {
        selectedAssets.$removeObject(asset);
        cell.$setSelected(false);
      } else {
        selectedAssets.$addObject(asset);
        cell.$setSelected(true);
      }

      const buttonEnabled = selectedAssets.$count() > 0;
      self.$deleteButton().$setEnabled(buttonEnabled);
      self.$shareButton().$setEnabled(buttonEnabled);
      $device.taptic();
    },
    "assetAtIndexPath:": indexPath => {
      const asset = assets.$objectAtIndex(indexPath.$item());
      return asset;
    }
  }
});

exports.newInstance = collection => {
  const controller = $objc("PhotosWaterfallController").$new();
  controller.$setAssetCollection(collection);
  return controller;
}