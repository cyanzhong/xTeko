'use strict';

// TODO: Support Action Extension
// TODO: Save reversed gif


$app.strings = {
    "en": {
        "is_not_gif": "This is not gif",
        "oops": "Oops",
        "please_feedback": "Please submit an issue",
        "not_now": "Not now",
        "open_github": "Open Github",
    },
    "zh-Hans": {
        "is_not_gif": "这不是GIF",
        "oops": "出错了",
        "please_feedback": "请提交一个 issue",
        "not_now": "以后再说",
        "open_github": "打开 GitHub",
    },
};


function isGif(info) {
    return info.mimeType === "image/gif";
}


// decode a gif data to frames, reverse the frames,
// then encode it to a new data.
// TODO: do I need free decoder & encoder? I was spoiled by gc...
function reverseGif(data, cb) {
    let decoder = $objc("YYImageDecoder").invoke("decoderWithData:scale", data, 1);

    let encoder = $objc("YYImageEncoder").invoke("alloc.initWithType", 7);  // 7 -> YYImageTypeGIF

    let frameCount = decoder.invoke("frameCount");

    for (let i = frameCount - 1; i >= 0; i --) {
        let duration = decoder.invoke("frameDurationAtIndex", i);
        let frame = decoder.invoke("frameAtIndex:decodeForDisplay", i, 0);
        encoder.invoke("addImage:duration", frame.invoke("image"), duration);
        if (cb) {
            cb(frameCount - i, frameCount);
        }
    }

    return encoder.invoke("encode");
}


function pickGif() {
    $photo.pick({
        format: 'data',
        handler: function(resp) {
            if (resp.status == '1') {
                if (isGif(resp.data.info)) {
                    try {
                        $thread.background({
                            handler: function() {
                                let fig = reverseGif(resp.data, function(value, total) {
                                    $thread.main({
                                        handler: function() {
                                            progressBar.value = value / total;
                                        },
                                    });
                                });
                                $thread.main({
                                    handler: function() {
                                        progressBar.remove();
                                        imgView.hidden = false;
                                        imgView.data = fig.rawValue();
                                    },
                                });
                            },
                        });
                    } catch (e) {
                        $ui.alert({
                            title: $l10n("oops"),
                            message: `${$l10n("please_feedback")}\n${e}`,
                            actions: [
                                {
                                    title: $l10n("not_now"),
                                    handler: function() {
                                        $app.close();
                                    },
                                },
                                {
                                    title: $l10n("open_github"),
                                    handler: function() {
                                        $app.openURL("https://github.com/wr1241/xTeko/issues/new");
                                        $app.close();
                                    },
                                },
                            ]
                        })
                    }
                } else {
                    $ui.alert({
                        message: $l10n("is_not_gif"),
                        actions: [
                            {
                                title: "OK",
                                handler: function() {
                                    $app.close();
                                },
                            }
                        ],
                    });
                }
            } else {
                // maybe cancel
                $app.close();
            }
        }
    });
}

$ui.render({
    views: [
        {
            type: "image",
            props: {
                id: "imgView",  // actually this is YYAnimatedImageView
                bgcolor: $color("black"),
                hidden: true,
            },
            layout: function(make, view) {
                make.size.equalTo(view.super);
            },
            events: {
                tapped: function(sender) {
                    let playing = yyImgView.invoke("currentIsPlayingAnimation");
                    yyImgView.invoke(playing ? "stopAnimating" : "startAnimating");
                },
            },
        },
        {
            type: "progress",
            props: {
                id: "progressBar",
                value: 0,
            },
            layout: function(make, view) {
                make.center.equalTo(view.super);
                make.left.right.inset(32);
            },
        },
    ],
});

let imgView = $("imgView");
let yyImgView = imgView.runtimeValue();
yyImgView.invoke("setContentMode", 1); // 1 -> UIViewContentModeScaleAspectFit
let progressBar = $("progressBar");

pickGif();
