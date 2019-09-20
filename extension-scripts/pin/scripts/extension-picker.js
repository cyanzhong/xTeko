$defc("UIImagePNGRepresentation", "NSData *, UIImage *");

var _image = $objc("UIImage").invoke("imageNamed", "AppIcon60x60");
var _data = UIImagePNGRepresentation(_image);
var _text = $objc("NSString").invoke("stringWithString", "text");
var _url = $objc("NSURL").invoke("URLWithString", "https://apple.com");

var list = $objc("NSMutableArray").invoke("alloc.init");
list.invoke("addObject", _image);
list.invoke("addObject", _data);
list.invoke("addObject", _text);
list.invoke("addObject", _url);

var activities = $objc("UIApplicationExtensionActivity").invoke("_applicationExtensionActivitiesForItems", list);
var count = activities.invoke("count");
var items = [];

for (var idx=0; idx<count; ++idx) {
  var activity = activities.invoke("objectAtIndex", idx);
  var category = activity.invoke("class").invoke("activityCategory");
  var name = activity.invoke("activityTitle").rawValue();
  var type = activity.invoke("activityType").rawValue();
  var image = activity.invoke("_activityImage").rawValue();
  items.push({
    name: name,
    type: type,
    image: image
  });
}

function show(completionHandler) {
  $ui.push({
    props: {
      title: $l10n("ACTION_SHARE")
    },
    views: [
      {
        type: "list",
        props: {
          rowHeight: 64,
          template: [
            {
              type: "image",
              props: {
                id: "image",
                bgcolor: $color("clear")
              },
              layout: function(make, view) {
                make.left.top.bottom.inset(10);
                make.width.equalTo(view.height);
              }
            },
            {
              type: "label",
              props: {
                id: "picker-name-label",
                font: $font("bold", 18)
              },
              layout: function(make, view) {
                var image = $("image");
                make.left.equalTo(image.right).offset(10);
                make.top.equalTo(image);
              }
            },
            {
              type: "label",
              props: {
                id: "picker-id-label"
              },
              layout: function(make, view) {
                var name = $("picker-name-label");
                make.left.equalTo(name);
                make.top.equalTo(name.bottom);
                make.right.inset(10);
              }
            }
          ],
          data: items.map(function(item) {
            var props = {
              "picker-name-label": {text: item.name},
              "picker-id-label": {text: item.type}
            };
            if (item.image.size) {
              props["image"] = {image: item.image};
            }
            return props;
          })
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            var item = items[indexPath.row];
            var name = item.name;
            var type = item.type;
            var scheme = "compose://?id=" + type;
            completionHandler(name, scheme);
            $ui.pop();
          }
        }
      }
    ]
  });
}

module.exports = {
  show: show
}