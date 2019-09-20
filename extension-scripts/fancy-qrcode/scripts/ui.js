const helper = require("./helper");

$file.delete("www/img/background-image");
$file.delete("www/img/logo-image");

exports.init = () => {
  $ui.render({
    props: {
      title: $l10n("MAIN_TITLE"),
      clipsToSafeArea: true,
      bgcolor: $color("#F9F9F9")
    },
    views: [
      menuView(),
      bottomView(),
      basicView(),
      colorsView(),
      imagesView(),
      othersView(),
    ]
  });
  
  $app.keyboardToolbarEnabled = true;
  setVisibleViewIndex(0);
}

// Views

function menuView() {
  return {
    type: "menu",
    props: {
      items: ["BASIC", "COLORS", "IMAGES", "OTHERS"].map(x => $l10n(x))
    },
    layout: (make, view) => {
      make.left.top.right.equalTo(0);
      make.height.equalTo(44);
    },
    events: {
      changed: sender => {
        setVisibleViewIndex(sender.index);
      }
    }
  }
}

function bottomView() {
  return {
    type: "button",
    props: {
      title: $l10n("GENERATE")
    },
    layout: (make, view) => {
      make.left.right.inset(32);
      make.height.equalTo(44);
      make.bottom.inset(10);
    },
    events: {
      tapped: generate
    }
  }
}

function basicView() {
  return {
    type: "list",
    props: {
      id: "#0",
      header: {
        props: {
          height: 110
        },
        views: [
          {
            type: "text",
            props: {
              id: "content-text",
              text: "https://sspai.com",
              bgcolor: $color("#F0F0F0"),
              smoothRadius: 5,
              placeholder: $l10n("CONTENTS")
            },
            layout: (make, view) => {
              make.left.top.right.inset(15);
              make.height.equalTo(80);
            }
          }
        ]
      },
      data: [
        {
          "rows": [
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "size-label",
                    text: `${$l10n("SIZE")} 800px`
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "slider",
                  props: {
                    id: "size-slider",
                    min: 100,
                    max: 1600,
                    value: 800
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.width.equalTo(150);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let value = parseInt(sender.value);
                      $("size-label").text = `${$l10n("SIZE")} ${value}px`;
                    }
                  }
                }
              ]
            },
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "margin-label",
                    text: `${$l10n("MARGIN")} 20px`
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "slider",
                  props: {
                    id: "margin-slider",
                    min: 0,
                    max: 1600,
                    value: 20
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.width.equalTo(150);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let value = parseInt(sender.value);
                      $("margin-label").text = `${$l10n("MARGIN")} ${value}px`;
                    }
                  }
                }
              ]
            },
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "dot-scale-label",
                    text: `${$l10n("DOT_SCALE")} 0.35`
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "slider",
                  props: {
                    id: "dot-scale-slider",
                    min: 0,
                    max: 1,
                    value: 0.35
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.width.equalTo(150);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let value = sender.value.toFixed(1);
                      $("dot-scale-label").text = `${$l10n("DOT_SCALE")} ${value}`;
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    layout: (make, view) => {
      make.left.right.equalTo(0);
      make.bottom.inset(64);
      make.top.equalTo(44);
    }
  }
}

function colorsView() {

  async function selectColor() {
    let color = await $picker.color();
    return color;
  }

  return {
    type: "list",
    props: {
      id: "#1",
      data: [
        {
          "title": " ",
          "rows": [
            {
              type: "view",
              props: {
                bgcolor: $color("white")
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: $l10n("AUTO_COLOR")
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "switch",
                  props: {
                    id: "auto-color-switch",
                    on: true
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let alpha = sender.on ? 0.4 : 1.0;
                      $("dark-color-cell").alpha = alpha;
                      $("light-color-cell").alpha = alpha;
                    }
                  }
                }
              ]
            },
            {
              type: "view",
              props: {
                id: "dark-color-cell",
                bgcolor: $color("white"),
                alpha: 0.4
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: $l10n("DARK_COLOR")
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "button",
                  props: {
                    id: "dark-color-btn",
                    radius: 16,
                    bgcolor: $color("#000000"),
                    borderWidth: 2,
                    borderColor: $color("gray")
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.centerY.equalTo(view.super);
                    make.size.equalTo($size(32, 32));
                  },
                  events: {
                    tapped: async(sender) => {
                      let color = await selectColor();
                      if (color) {
                        sender.bgcolor = color;
                      }
                    }
                  }
                }
              ]
            },
            {
              type: "view",
              props: {
                id: "light-color-cell",
                bgcolor: $color("white"),
                alpha: 0.4
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: $l10n("LIGHT_COLOR")
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "button",
                  props: {
                    id: "light-color-btn",
                    radius: 16,
                    bgcolor: $color("#FFFFFF"),
                    borderWidth: 2,
                    borderColor: $color("gray")
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.centerY.equalTo(view.super);
                    make.size.equalTo($size(32, 32));
                  },
                  events: {
                    tapped: async(sender) => {
                      let color = await selectColor();
                      if (color) {
                        sender.bgcolor = color;
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    layout: (make, view) => {
      make.edges.equalTo($("#0"));
    }
  }
}

function imagesView() {

  const Row = {
    backgroundImage: 0,
    logoImage: 1,
    logoScale: 2,
    logoMargin: 3,
    logoCornerRadius: 4,
  }

  async function selectImage() {
    return await $photo.pick({
      format: "data"
    });
  }

  async function showImageMenu(id) {
    let {index} = await $ui.menu([$l10n("SELECT"), $l10n("REMOVE")]);
    let path = `www/img/${id}`;

    if (index == 0) {
      let {data} = await selectImage();
      let image = data.image;
      $(id).image = image;
      $file.write({
        data: data,
        path: path
      });
    } else {
      $(id).image = null;
      $file.delete(path);
    }
  }

  return {
    type: "list",
    props: {
      id: "#2",
      data: [
        {
          "title": " ",
          "rows": [
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: $l10n("BACKGROUND_IMAGE")
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "image",
                  props: {
                    id: "background-image",
                    bgcolor: $color("#F9F9F9")
                  },
                  layout: (make, view) => {
                    make.top.bottom.inset(5);
                    make.right.equalTo(0);
                    make.width.equalTo(view.height);
                  }
                }
              ]
            },
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: $l10n("LOGO_IMAGE")
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "image",
                  props: {
                    id: "logo-image",
                    bgcolor: $color("#F9F9F9")
                  },
                  layout: (make, view) => {
                    make.top.bottom.inset(5);
                    make.right.equalTo(0);
                    make.width.equalTo(view.height);
                  }
                }
              ]
            },
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "logo-scale-label",
                    text: `${$l10n("LOGO_SCALE")} 0.2`
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "slider",
                  props: {
                    id: "logo-scale-slider",
                    min: 0,
                    max: 1,
                    value: 0.2
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.width.equalTo(150);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let value = sender.value.toFixed(1);
                      $("logo-scale-label").text = `${$l10n("LOGO_SCALE")} ${value}`;
                    }
                  }
                }
              ]
            },
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "logo-margin-label",
                    text: `${$l10n("LOGO_MARGIN")} 6px`
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "slider",
                  props: {
                    id: "logo-margin-slider",
                    min: 0,
                    max: 100,
                    value: 6
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.width.equalTo(150);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let value = parseInt(sender.value);
                      $("logo-margin-label").text = `${$l10n("LOGO_MARGIN")} ${value}px`;
                    }
                  }
                }
              ]
            },
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "logo-corner-label",
                    text: `${$l10n("LOGO_CORNER_RADIUS")} 8px`
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "slider",
                  props: {
                    id: "logo-corner-slider",
                    min: 0,
                    max: 200,
                    value: 8
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.width.equalTo(150);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let value = parseInt(sender.value);
                      $("logo-corner-label").text = `${$l10n("LOGO_CORNER_RADIUS")} ${value}px`;
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    layout: (make, view) => {
      make.edges.equalTo($("#0"));
    },
    events: {
      didSelect: async(sender, indexPath) => {

        function showBlink() {
          let view = sender.cell(indexPath);
          helper.blinkView(view);
        }

        switch (indexPath.row) {
          case Row.backgroundImage:
            showBlink();
            showImageMenu("background-image");
            break;
          case Row.logoImage:
            showBlink();
            showImageMenu("logo-image");
            break;
        }
      }
    }
  }
}

function othersView() {
  return {
    type: "list",
    props: {
      id: "#3",
      data: [
        {
          "title": " ",
          "rows": [
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: $l10n("WHITE_MARGIN")
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "switch",
                  props: {
                    id: "white-margin-switch"
                  },
                  layout: (make, view) => {
                    make.right.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                }
              ]
            },
            {
              type: "view",
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: $l10n("BINARIZE")
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "switch",
                  props: {
                    id: "binarize-switch"
                  },
                  layout: (make, view) => {
                    make.right.equalTo(0);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let alpha = sender.on ? 1.0 : 0.4;
                      $("binarize-cell").alpha = alpha;
                    }
                  }
                }
              ]
            },
            {
              type: "view",
              props: {
                id: "binarize-cell",
                alpha: 0.4
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "threshold-label",
                    text: `${$l10n("BINARIZE_THRESHOLD")} 128px`
                  },
                  layout: (make, view) => {
                    make.left.equalTo(0);
                    make.centerY.equalTo(view.super);
                  }
                },
                {
                  type: "slider",
                  props: {
                    id: "threshold-slider",
                    min: 0,
                    max: 255,
                    value: 128
                  },
                  layout: (make, view) => {
                    make.right.inset(0);
                    make.width.equalTo(150);
                    make.centerY.equalTo(view.super);
                  },
                  events: {
                    changed: sender => {
                      let value = parseInt(sender.value);
                      $("threshold-label").text = `${$l10n("BINARIZE_THRESHOLD")} ${value}px`;
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    layout: (make, view) => {
      make.edges.equalTo($("#0"));
    }
  }
}

function setVisibleViewIndex(index) {
  for (var idx=0; idx<4; ++idx) {
    let view = $(`#${idx}`);
    view.hidden = idx != index;
  }

  $("content-text").blur();
}

function generate() {
  let text = $("content-text").text;
  let size = $("size-slider").value;
  let margin = $("margin-slider").value;
  let dotScale = parseFloat($("dot-scale-slider").value.toFixed(2));
  let autoColor = $("auto-color-switch").on;
  let darkColor = $("dark-color-btn").bgcolor.hexCode;
  let lightColor = $("light-color-btn").bgcolor.hexCode;
  let logoScale = parseFloat($("logo-scale-slider").value.toFixed(1));
  let logoMargin = parseInt($("logo-margin-slider").value);
  let logoCornerRadius = parseInt($("logo-corner-slider").value);
  let whiteMargin = $("white-margin-switch").on;
  let binarize = $("binarize-switch").on;
  let binarizeThreshold = parseInt($("threshold-slider").value);

  let options = {
    text: text,
    size: size,
    margin: margin,
    dotScale: dotScale,
    autoColor: autoColor,
    darkColor: darkColor,
    lightColor: lightColor,
    backgroundImage: $file.read("www/img/background-image"),
    logoImage: $file.read("www/img/logo-image"),
    logoScale: logoScale,
    logoMargin: logoMargin,
    logoCornerRadius: logoCornerRadius,
    whiteMargin: whiteMargin,
    binarize: binarize,
    binarizeThreshold: binarizeThreshold,
  }

  const render = require("./render");
  render.process(options);
}