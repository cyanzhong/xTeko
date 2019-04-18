const imageFolder = "images";
const thumbFolder = "images/thumb";

exports.openImagePicker = async(args) => {
  const options = [$l10n("PHOTO_LIBRARY"), $l10n("CAMERA")];
  if (args.localEnabled) {
    options.push($l10n("LOCAL_IMAGES"));
  }
  
  const {index} = await $ui.menu(options);
  let result = null;

  if (index == 0) {
    result = await $photo.pick();
  } else if (index == 1) {
    result = await $photo.take();
  } else {
    args.selectLocalImage();
    return;
  }

  const image = result.image.orientationFixedImage;
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