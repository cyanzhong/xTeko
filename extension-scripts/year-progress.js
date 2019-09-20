Date.prototype.isLeapYear = function () {
  var year = this.getFullYear();
  if ((year & 3) != 0) return false;
  return ((year % 100) != 0 || (year % 400) == 0);
};

Date.prototype.getDaysOfYear = function () {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && this.isLeapYear()) dayOfYear++;
  return dayOfYear;
};

var now = new Date()
var percentage = now.getDaysOfYear() * 1.0 / (now.isLeapYear ? 366 : 365)

$ui.render({
  views: [
    {
      type: "view",
      layout: function(make, view) {
        make.height.equalTo(32)
        make.left.top.right.inset(20)
      },
      views: [
        {
          type: "label",
          props: {
            text: (percentage * 100).toFixed(2) + "%",
            font: $font("bold", 24)
          },
          layout: function(make, view) {
            make.right.equalTo(0)
            make.centerY.equalTo(view.super)
          }
        },
        {
          type: "view",
          props: {
            bgcolor: $rgba(21, 126, 251, 0.2),
            smoothRadius: 8
          },
          layout: function(make, view) {
            make.left.equalTo(0)
            make.height.equalTo(32)
            make.centerY.equalTo(view.super)
            make.right.equalTo($("label").left).offset(-10)
          },
          views: [
            {
              type: "view",
              props: {
                bgcolor: $rgb(21, 126, 251)
              },
              layout: function(make, view) {
                make.left.top.bottom.equalTo(0)
                make.width.equalTo(view.super).multipliedBy(percentage)
              }
            }
          ]
        }
      ]
    },
    {
      type: "label",
      props: {
        id: "quote-label",
        align: $align.center,
        lines: 2,
        textColor: $color("gray"),
        font: $objc("UIFont").invoke("italicSystemFontOfSize", 15).rawValue()
      },
      layout: function(make, view) {
        make.left.bottom.right.inset(10)
      },
      events: {
        tapped: refreshQuote
      }
    }
  ]
})

function refreshQuote() {
  $http.get({
    url: "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json",
    handler: function(resp) {
      var label = $("quote-label").runtimeValue()
      label.invoke("fadeToText", resp.data.quoteText)
    }
  })
}

refreshQuote()