const appName = "MarkMe";

exports.appName = appName;

exports.localFolder = "files";

exports.cloudFolder = `drive://${appName}`;

exports.notchInset = $device.isIphoneX ? 32 : 0;

exports.onePixel = 1.0 / $device.info.screen.scale;