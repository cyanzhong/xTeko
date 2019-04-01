const util = require("../common/util");

$define({
  type: "MMTextObserver: NSObject<UITextViewDelegate>",
  events: {
    "textViewDidBeginEditing": sender => {
      util.enableBackGesture(false);
      sender.$setEditingModeEnabled(true);
      sender.$setEdited(true);
    },
    "textViewDidEndEditing": sender => {
      util.enableBackGesture(true);
      sender.$setEditingModeEnabled(false);
    }
  }
});

const observer = $objc("MMTextObserver").$new();
$objc_retain(observer);

exports.observe = textView => {
  textView.$setDelegate(observer);
}