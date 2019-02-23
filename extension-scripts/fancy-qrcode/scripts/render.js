exports.process = async(options) => {

  let backgroundImage = options.backgroundImage;
  let logoImage = options.logoImage;
  var code = null;
  var core =
  `
  AwesomeQR.create({
    text: _decodeBase64("${$text.base64Encode(options.text)}"),
    size: ${options.size},
    margin: ${options.margin},
    dotScale: ${options.dotScale},
    autoColor: ${options.autoColor},
    colorDark: "${options.darkColor}",
    colorLight: "${options.lightColor}",
    logoScale: ${options.logoScale},
    logoMargin: ${options.logoMargin},
    logoCornerRadius: ${options.logoCornerRadius},
    whiteMargin: ${options.whiteMargin},
    binarize: ${options.binarize},
    binarizeThreshold: ${options.binarizeThreshold},
    gifBackground: {{buffer}},
    backgroundImage: {{img}},
    logoImage: {{logo}},
    bindElement: "qrcode",
    callback: () => {
      $notify("didFinishRender", {});
    }
  })
  `;

  core = core.replace("{{logo}}", logoImage != null ? "logo" : "undefined");

  if (backgroundImage) {
    // GIF
    let mimeType = backgroundImage.info.mimeType;
    if (mimeType.toLowerCase().includes("gif")) {
      core = core.replace("{{buffer}}", "buffer");
      core = core.replace("{{img}}", "undefined");
      code =
      `
      fetch("http://localhost:9090/img/background-image")
      .then(response => response.blob())
      .then(blob => {
        let reader = new FileReader();
        reader.onload = event => {
          let buffer = event.target.result;
          setTimeout(() => {
            ${core}
          }, 100);
        };
        reader.readAsArrayBuffer(blob);
      });
      `;
    } else {
      // JPG
      core = core.replace("{{buffer}}", "undefined");
      core = core.replace("{{img}}", "img");
      code =
      `
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        ${core}
      }
      img.src = "http://localhost:9090/img/background-image";
      `;
    }
  } else {
    // No background
    core = core.replace("{{buffer}}", "undefined");
    core = core.replace("{{img}}", "undefined");
    code = core;
  }

  var template = $file.read("www/template.html").string;
  template = template.replace("{{code}}", logoImage != null ? 
  `
  let logo = new Image();
  logo.crossOrigin = "Anonymous";
  logo.onload = () => {
    ${code}
  };
  logo.src = "http://localhost:9090/img/logo-image";
  ` : code);

  $file.write({
    data: $data({"string": template}),
    path: "www/index.html"
  });

  $ui.push({
    props: {
      title: "",
      clipsToSafeArea: true
    },
    views: [
      {
        type: "web",
        props: {
          id: "renderer",
          url: "http://localhost:9090/index.html",
          showsProgress: false
        },
        layout: (make, view) => {
          make.left.top.right.equalTo(0);
          make.bottom.inset(64);
        },
        events: {
          didFinishRender: () => {
            $("spinner").loading = false;
          }
        }
      },
      {
        type: "spinner",
        props: {
          id: "spinner",
          loading: true,
          style: 0,
          color: $color("gray")
        },
        layout: (make, view) => {
          make.center.equalTo($("renderer"));
        }
      },
      {
        type: "button",
        props: {
          title: $l10n("SHARE")
        },
        layout: (make, view) => {
          make.left.right.inset(32);
          make.height.equalTo(44);
          make.bottom.inset(10);
        },
        events: {
          tapped: share
        }
      }
    ]
  });
}

async function share() {
  let dataURI = (await $("renderer").eval("exportImage()"))[0];
  let data = $data({"base64": dataURI});
  $share.sheet(data);
}