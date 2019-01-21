var _color = $color("#000000");
var _size = 10;
let file = $file.read("assets/index.html");
let html = file.string;

exports.render = () => {

  $ui.render({
    props: {
      title: $l10n("MAIN_TITLE")
    },
    views: [
      {
        type: "view",
        props: {
          id: "toolbar"
        },
        layout: (make, view) => {
          make.left.top.right.equalTo(0);
          make.height.equalTo(32);
        },
        views: [
          {
            type: "button",
            props: {
              title: $l10n("SHARE"),
              font: $font(13),
              smoothRadius: 5
            },
            layout: (make, view) => {
              make.top.right.inset(4);
              make.bottom.equalTo(0);
              make.width.equalTo(64);
            },
            events: {
              tapped: shareImage
            }
          },
          {
            type: "button",
            props: {
              title: $l10n("COPY"),
              font: $font(13),
              smoothRadius: 5
            },
            layout: (make, view) => {
              make.top.inset(4);
              make.bottom.equalTo(0);
              make.right.inset(72);
              make.width.equalTo(64);
            },
            events: {
              tapped: copyImage
            }
          },
          {
            type: "button",
            props: {
              title: $l10n("CLEAR"),
              font: $font(13),
              smoothRadius: 5
            },
            layout: (make, view) => {
              make.top.inset(4);
              make.bottom.equalTo(0);
              make.right.inset(140);
              make.width.equalTo(64);
            },
            events: {
              tapped: clearImage
            }
          },
          {
            type: "button",
            props: {
              id: "color-button",
              bgcolor: $color("black"),
              radius: 0
            },
            layout: (make, view) => {
              make.left.top.inset(4);
              make.bottom.equalTo(0);
              make.width.equalTo($("color-button").height);
            },
            events: {
              tapped: sender => {
                let colors = require("./colors");
                colors.select(color => {
                  sender.bgcolor = color;
                  _color = color;
                  updateOptions();
                });
              }
            }
          },
          {
            type: "button",
            props: {
              id: "size-button",
              bgcolor: $color("clear"),
              radius: 0
            },
            layout: (make, view) => {
              make.left.equalTo($("color-button").right).offset(4);
              make.top.inset(4);
              make.bottom.equalTo(0);
              make.width.equalTo($("size-button").height);
            },
            events: {
              tapped: async() => {
                let items = Array(25).fill(1).map((x, y) => x + y).map(n => "" + n);
                let {index} = await $ui.menu(items);
                _size = index + 1;
                updateOptions();
              }
            },
            views: [
              {
                type: "view",
                props: {
                  bgcolor: $color("black")
                },
                layout: (make, view) => {
                  make.height.equalTo(4);
                  make.left.right.equalTo(0);
                  make.top.equalTo(2);
                }
              },
              {
                type: "view",
                props: {
                  bgcolor: $color("black")
                },
                layout: (make, view) => {
                  make.height.equalTo(3);
                  make.left.right.equalTo(0);
                  make.centerY.equalTo(view.super).offset(0);
                }
              },
              {
                type: "view",
                props: {
                  bgcolor: $color("black")
                },
                layout: (make, view) => {
                  make.height.equalTo(2);
                  make.left.right.equalTo(0);
                  make.bottom.inset(2);
                }
              }
            ]
          }
        ]
      },
      {
        type: "web",
        props: {
          id: "canvas",
          html: html,
          showsProgress: false
        },
        layout: (make, view) => {
          make.top.equalTo($("toolbar").bottom);
          make.left.right.equalTo(0);
          if ($app.env == $env.app || $app.env == $env.action) {
            make.height.equalTo($("canvas").width);
          } else {
            make.bottom.equalTo(4);
          }
        }
      }
    ]
  });
}

function updateOptions() {
  let options = {
    color: _color.hexCode,
    size: _size
  };
  $("canvas").eval({
    script: `_setOption('${JSON.stringify(options)}');`
  });
}

async function shareImage() {
  $quicklook.open({image: await getImage()});
}

async function copyImage() {
  $clipboard.image = await getImage();
}

function clearImage() {
  $("canvas").html = html;
}

async function getImage() {
  let dataURI = (await $("canvas").eval("getImage();"))[0];
  let data = $data({"base64": dataURI});
  return data.image;
}