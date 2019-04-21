const imageFolder = "images";
const thumbFolder = "images/thumb";

exports.openImagePicker = async(args) => {
  const options = [$l10n("PHOTO_LIBRARY"), $l10n("CAMERA"), $l10n("SCAN_DOCUMENTS"), $l10n("ADD_SKETCH")];
  if (args.localEnabled) {
    options.push($l10n("LOCAL_IMAGES"));
  }
  
  const {index} = await $ui.menu(options);

  const INDEX = {
    PHOTOS: 0,
    CAMERA: 1,
    SCANNER: 2,
    SKETCH: 3,
    LOCAL: 4,
  }

  function handleImage(image) {
    if (image == null) {
      return;
    }

    const screen = $device.info.screen;
    const scale = screen.scale;
    const dimension = screen.width * screen.height * scale * scale * 1.5;
    
    const type = (image.size.width * image.size.height > dimension) ? "jpg" : "png";
    const hash = saveImage(image, type);
    if (args.selectedPath) {
      args.selectedPath(`${hash}.${type}`);
    }
  }

  if (index == INDEX.PHOTOS) {
    const result = await $photo.pick();
    handleImage(result.image.orientationFixedImage);
  } else if (index == INDEX.CAMERA) {
    const result = await $photo.take();
    handleImage(result.image.orientationFixedImage);
  } else if (index == INDEX.SCANNER) {
    const scanner = require("../images/scanner");
    scanner.open(images => {
      if (images.length > 0) {
        handleImage(images[0]);
      }
    });
  } else if (index == INDEX.SKETCH) {
    const sketcher = require("../images/sketcher");
    sketcher.open(image => {
      handleImage(image);
    });
  } else if (index == INDEX.LOCAL) {
    args.selectLocalImage();
  }
}

exports.deleteImage = path => {
  $file.delete(`${imageFolder}/${path}`);
  $file.delete(`${thumbFolder}/${path}`);
}

exports.clearImages = () => {
  $file.delete(imageFolder);
  $file.mkdir(thumbFolder);
}

function saveImage(image, type) {
  const hash = $objc("NSUUID").$UUID().$UUIDString().rawValue();
  const screen = $device.info.screen;
  const scale = screen.scale;
  const width = screen.width;
  const height = Math.ceil(image.size.height * width / image.size.width);

  function resize(size) {
    const resized = image.resized(size);
    if (type === "png") {
      return resized.png;
    } else {
      return resized.jpg(0.7);
    }
  }
  
  const rawData = resize($size(width * scale, height * scale));
  const thumbData = resize($size(width * scale * 0.5, width * scale * 0.5));

  if (!$file.exists(imageFolder)) {
    $file.mkdir(imageFolder);
  }

  if (!$file.exists(thumbFolder)) {
    $file.mkdir(thumbFolder);
  }

  $file.write({
    data: rawData,
    path: `${imageFolder}/${hash}.${type}`
  });

  $file.write({
    data: thumbData,
    path: `${thumbFolder}/${hash}.${type}`
  });

  return hash;
}