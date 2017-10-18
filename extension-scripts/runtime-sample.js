$define({
  type: "Helper",
  classEvents: {
    open: function(scheme) {
      var url = $objc("NSURL").invoke("URLWithString", scheme)
      $objc("UIApplication").invoke("sharedApplication.openURL", url)
    }
  }
})

$ui.render({
  views: [
    {
      type: "button",
      props: {
        bgcolor: $objc("UIColor").invoke("blackColor").rawValue(),
        titleColor: $color("#FFFFFF").runtimeValue().rawValue(),
        title: "WeChat"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(100, 32))
      },
      events: {
        tapped: function(sender) {
          $objc("Helper").invoke("open", "weixin://")
        }
      }
    }
  ]
})

var window = $ui.window.runtimeValue()
var label = $objc("UILabel").invoke("alloc.init")
label.invoke("setTextAlignment", 1)
label.invoke("setText", "Runtime")
label.invoke("setFrame", { x: $device.info.screen.width * 0.5 - 50, y: 240, width: 100, height: 32 })
window.invoke("addSubview", label)