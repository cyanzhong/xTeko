$app.validEnv = $env.app;

$app.strings = {
    "en": {
        "not_wifi": "Not WiFi Network",
        "password": "Password",
        "save_successful": "Save successful",
        "save_failed": "Save failed",
        "feedback": "Not Work?",
    },
    "zh-Hans": {
        "not_wifi": "当前网络不是 WiFi",
        "password": "请输入密码",
        "save_successful": "保存成功",
        "save_failed": "保存失败",
        "feedback": "功能不正常？",
    },
}


function mecardEncode(text) {
    // escape special characters with backslash
    // https://github.com/zxing/zxing/wiki/Barcode-Contents#wifi-network-config-android
    return text.replace(/\\/g, "\\\\")
               .replace(/"/g, '\\"')
               .replace(/;/g, "\\;")
               .replace(/:/g, "\\:")
               .replace(/,/g, "\\,");
}


function generateWiFiQR(ssid, password, noPass=false) {
    let authType = noPass ? "nopass" : "WPA"; 
    let wifiInfo = `WIFI:T:${authType};S:${mecardEncode(ssid)};P:${mecardEncode(password)};;`;
    $console.info(`wifiInfo=${wifiInfo}`);
    return $qrcode.encode(wifiInfo);
}


function getShorterEdgeOfParentView(view) {
    return Math.min(view.super.frame.width, view.super.frame.height);
}


function displayQR(ssid, qrImage) {
    $ui.push({
        props: {
            title: "WiFi QR code"
        },
        views: [
            {
                type: "label",
                props: {
                    id: "ssid",
                    text: ssid,
                    autoFontSize: true,
                    lines: 1,
                },
                layout: function(make, view) {
                    const shorterEdge = getShorterEdgeOfParentView(view);
                    make.height.equalTo(shorterEdge / 8);
                    make.centerX.equalTo(view.super);
                },
            },
            {
                type: "image",
                props: {
                    id: "qrImage",
                    image: qrImage
                },
                layout: function(make, view) {
                    const shorterEdge = getShorterEdgeOfParentView(view);
                    let edge = shorterEdge / 8 * 7;

                    if ($app.env === $env.today) {
                        edge *= 0.7;
                    }

                    make.top.equalTo($("ssid").bottom);
                    make.width.height.equalTo(edge);
                    make.centerX.equalTo(view.super);
                },
                events: {
                    longPressed: function(sender) {
                        $photo.save({
                            image: qrImage,
                            handler: function(success) {
                                if (success) {
                                    $ui.toast($l10n("save_successful"));
                                } else {
                                    $ui.toast($l10n("save_failed"));
                                }
                            },
                        });
                    }
                },
            },
        ],
    });
}


function main() {
    $ui.render({
        props: {
            title: "Share WiFi by QrCode",
        },
        views: [
            {
                type: "input",
                props: {
                    id: "password",
                    font: $font(24),
                    placeholder: $l10n("password"),
                    autoFontSize: true,
                    secure: true,
                    clearsOnBeginEditing: true,
                },
                layout: function(make, view) {
                    make.center.equalTo(view.super);
                    make.height.equalTo(64);
                    make.width.equalTo(view.super).offset(-96);
                },
                events: {
                    returned: function(sender) {
                        let ssid = $("ssid").text;
                        let password = sender.text;
                        displayQR(ssid, generateWiFiQR(ssid, password, password===""));
                    },
                },
            },
            {
                type: "label",
                props: {
                    id: "ssid",
                    text: $device.ssid.SSID || $l10n("not_wifi"),
                    font: $font(32),
                },
                layout: function(make, view) {
                    make.bottom.equalTo($("password").top).offset(-32);
                    make.centerX.equalTo(view.super);
                    make.height.equalTo(64);
                },
            },
            {
                type: "button",
                props: {
                    title: $l10n("feedback"),
                    font: $font(16),
                    textColor: $color("#0000FF"),
                },
                layout: function(make, view) {
                    make.right.equalTo(view.super).offset(-12);
                    make.top.equalTo(view.super).offset(24);
                    make.width.equalTo(128);
                },
                events: {
                    tapped: function(sender) {
                        let issueUrl = "https://github.com/wr1241/xTeko/issues/new";
                        $app.openURL(issueUrl);
                    },
                },
            },
        ],
    });    
}

// entry
main();
