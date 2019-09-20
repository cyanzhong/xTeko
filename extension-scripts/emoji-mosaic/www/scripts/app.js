window.onload = function() {
  var image = document.getElementById("render");
  var dataURI = getImageDataURI(image);
  new EmojiMosaic(dataURI);
};

var emojiMap = loadEmojis();
var emojiInts = emojiPoints();

function loadEmojis() {
  var colorMap = {};
  for (var i = 0; i < emojiColors.length; i++) {
    if (emojiColors[i] == "false") {
      continue;
    }
    fileNumber = pad(i + 1, 4);
    img = "http://localhost:7070/images/" + fileNumber + ".png";
    colorMap[emojiColors[i]] = img;
  }
  return colorMap;
}

function pad(num, size) {
  return ("000" + num).substr(-size);
}
/**
 * For a given RGB color, find the closest match Emoji.
 *
 * @param  {array}  RGB color value.
 * @return {string} Emoji filepath.
 */
var closestEmoji = function(color) {
  var distance = 99999999;
  var c, d, p;
  for (var i = 0; i < emojiInts.length; i++) {
    p = emojiInts[i];
    d = Math.sqrt(Math.pow(color[0] - p[0], 2) + Math.pow(color[1] - p[1], 2) + Math.pow(color[2] - p[2], 2));
    if (d < distance) {
      distance = d;
      c = p[3];
    }
  }
  return emojiMap[c];
};

function emojiPoints() {
  var pointArray = [];
  var c, r, g, b;
  for (var i = 0; i < emojiColors.length; i++) {
    c = emojiColors[i];
    r = parseInt("0x" + c.substr(1, 2));
    g = parseInt("0x" + c.substr(3, 2));
    b = parseInt("0x" + c.substr(5, 2));
    pointArray.push([r, g, b, c]);
  }
  return pointArray;
}

/**
 * Create a new Emoji Mosaic.
 *
 * @param {string} dataURI
 */
function EmojiMosaic(dataURI) {
  var img = (this.img = new Image());
  this.dataURI = dataURI;
  img.addEventListener("load", this.imageLoaded.bind(this));
  img.src = this.dataURI;
}

/**
 * After the image is loaded, create the layout.
 */
EmojiMosaic.prototype.imageLoaded = function() {
  var margin, width, height, createSample, samples, ratio;
  margin = 0;
  // If the image is too big, make the dimensions smaller.
  ratio = window.innerWidth / (this.img.width + margin * 2);
  this.img.height *= ratio;
  this.img.width *= ratio;
  // A canvas element for extracting image pixel color data.
  this.extractionCanvas = document.createElement("canvas");
  this.extractionCanvas.width = this.img.width;
  this.extractionCanvas.height = this.img.height;
  this.extractionCanvasContext = this.extractionCanvas.getContext("2d");
  this.extractionCanvasContext.drawImage(this.img, 0, 0, this.extractionCanvas.width, this.extractionCanvas.height);

  var self = this;

  // A canvas element that will be drawn to with Emoji.
  this.targetCanvas = document.getElementById("canvas");
  this.targetCanvas.width = this.extractionCanvas.width + margin * 2;
  this.targetCanvas.height = this.extractionCanvas.height + margin * 2;

  this.targetCanvasContext = this.targetCanvas.getContext("2d");

  // Fill a background.
  this.targetCanvasContext.fillStyle = "#ffffff";
  this.targetCanvasContext.fillRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);

  createSample = poissonDiscSampler(this.targetCanvas.width, this.targetCanvas.height, 8);
  samples = [];

  // Create an array of samples (x,y coordinates) to place Emoji in.
  while (true) {
    var s = createSample();
    // If no new sample was can be made, all samples have been created.
    if (!s) break;

    // Bail if the sample is out of bounds.
    if (s[0] < margin || s[1] < margin) {
      continue;
    }
    if (s[0] > this.targetCanvas.width - margin || s[1] > this.targetCanvas.height - margin) {
      continue;
    }
    samples.push(s);
  }

  var emojisRendered = 0;

  // At each sample, place an Emoji according to the image data at that point.
  samples.forEach(function(sample) {
    var imageData, sums, i, red, green, blue, closest;
    // Get image pixel data.
    imageData = this.extractionCanvasContext.getImageData(Math.round(sample[0] - margin), Math.round(sample[1] - margin), 1, 1);

    // Get average color data for an area.
    sums = { red: 0, green: 0, blue: 0 };
    for (i = 0; i < imageData.data.length; i++) {
      switch (i % 4) {
        case 0:
          sums.red += imageData.data[i];
          break;
        case 1:
          sums.green += imageData.data[i];
          break;
        case 2:
          sums.blue += imageData.data[i];
          break;
      }
    }
    red = sums.red / (imageData.data.length / 4);
    green = sums.green / (imageData.data.length / 4);
    blue = sums.blue / (imageData.data.length / 4);

    closest = closestEmoji([red, green, blue]);

    emojiImage = new Image();
    emojiImage.src = closest;
    emojiImage.setAttribute("data-x", sample[0] - 10);
    emojiImage.setAttribute("data-y", sample[1] - 10);

    // After the image is loaded, draw it onto the canvas.
    emojiImage.onload = function(event) {
      var image = event.target;
      this.targetCanvasContext.save();
      this.targetCanvasContext.translate(image.getAttribute("data-x"), image.getAttribute("data-y"));
      this.targetCanvasContext.rotate((Math.ceil(Math.random() * 360) * Math.PI) / 180);
      this.targetCanvasContext.drawImage(image, -15, -15, 30, 30);
      this.targetCanvasContext.restore();

      emojisRendered++;
      if (emojisRendered === samples.length) {
        $notify("didFinishRender", {});
      }
    }.bind(this);
  }, this);
};

function getImageDataURI(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg");
}

function exportImage() {
  return document.getElementById("canvas").toDataURL("image/jpeg");
}