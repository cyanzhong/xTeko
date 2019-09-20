/*
* @author https://t.me/Neurogram
*/

var numbers = "1234567890QWERTYUIOP";

var aTol = "ASDFGHJKL";

var zTom = "♞ZXCVBNM•—";

var symbols = [numbers, aTol, zTom];

$ui.push({
  props: {
    id: "mainView",
    title: $l10n("Morse")
  }
});

function keyboard() {
  var itemsWidth = ($device.info.screen.width - 11 * 5) / 20;
  var view0 = {
    type: "matrix",
    props: {
      id: "numbersMatrix",
      scrollEnabled: false,
      columns: 10,
      spacing: 5,
      itemHeight: 36,
      bgcolor: $color("#CFD3DA"),
      data: dataPush(numbers),
      template: {
        props: {},
        views: [
          {
            type: "label",
            props: {
              id: "label",
              textColor: $color("black"),
              bgcolor: $color("white"),
              radius: 5,
              align: $align.center,
              font: $font(20)
            },
            layout: $layout.fill
          }
        ]
      }
    },
    layout: function(make, view) {
      make.edges.insets($insets(0, 0, 0, 0));
    },
    events: {
      didSelect: function(sender, indexPath, data) {
        morseCode(data.label.text);
      }
    }
  };

  var view1 = {
    type: "matrix",
    props: {
      id: "aTolMatrix",
      scrollEnabled: false,
      columns: 9,
      spacing: 5,
      itemHeight: 36,
      bgcolor: $color("#CFD3DA"),
      data: dataPush(aTol),
      template: {
        props: {},
        views: [
          {
            type: "label",
            props: {
              id: "label",
              textColor: $color("black"),
              bgcolor: $color("white"),
              radius: 5,
              align: $align.center,
              font: $font(20)
            },
            layout: $layout.fill
          }
        ]
      }
    },
    layout: function(make, view) {
      make.edges.insets($insets(82, itemsWidth, 0, itemsWidth));
    },
    events: {
      didSelect: function(sender, indexPath, data) {
        morseCode(data.label.text);
      }
    }
  };

  var view2 = {
    type: "matrix",
    props: {
      id: "zTomMatrix",
      scrollEnabled: false,
      columns: 10,
      spacing: 5,
      itemHeight: 36,
      bgcolor: $color("#CFD3DA"),
      data: dataPush(zTom),
      template: {
        props: {},
        views: [
          {
            type: "label",
            props: {
              id: "label",
              textColor: $color("black"),
              bgcolor: $color("white"),
              radius: 5,
              align: $align.center,
              font: $font(20)
            },
            layout: $layout.fill
          }
        ]
      }
    },
    layout: function(make, view) {
      make.edges.insets($insets(123, 0, 0, 0));
    },
    events: {
      didSelect: function(sender, indexPath, data) {
        morseCode(data.label.text);
      }
    }
  };

  $("mainView").add(view0);
  $("mainView").add(view1);
  $("mainView").add(view2);
}

function dataPush(data) {
  var dataX = [];
  for (var i in data) {
    dataX.push({
      label: {
        text: data[i]
      }
    });
  }
  return dataX;
}

function morseCode(letter) {
  var code = {
    "A": "• —   ",
    "B": "— • • •   ",
    "C": "— • — •   ",
    "D": "— • •   ",
    "E": "•   ",
    "F": "• • — •   ",
    "G": "— — •   ",
    "H": "• • • •   ",
    "I": "• •   ",
    "J": "• — — —   ",
    "K": "— • —   ",
    "L": "• — • •   ",
    "M": "— —   ",
    "N": "— •   ",
    "O": "— — —   ",
    "P": "• — — •   ",
    "Q": "— — • —   ",
    "R": "• — •   ",
    "S": "• • •   ",
    "T": "—   ",
    "U": "• • —   ",
    "V": "• • • —   ",
    "W": "• — —   ",
    "X": "— • • —   ",
    "Y": "— • — —   ",
    "Z": "— — • •   ",
    "0": "— — — — —   ",
    "1": "• — — — —   ",
    "2": "• • — — —   ",
    "3": "• • • — —   ",
    "4": "• • • • —   ",
    "5": "• • • • •   ",
    "6": "— • • • •   ",
    "7": "— — • • •   ",
    "8": "— — — • •   ",
    "9": "— — — — •   ",
    "♞": "  ",
    "•": "• ",
    "—": "— "
  };
  $audio.play({
    id: 1104
  });
  $keyboard.insert(code[letter]);
}

keyboard();