const util = require("../common/util");

$define({
  type: "MMTextObserver: NSObject<UITextViewDelegate>",
  events: {
    "textViewDidBeginEditing": sender => {
      sender.$setEditingModeEnabled(true);
      sender.$setEdited(true);
    },
    "textViewDidEndEditing": sender => {
      sender.$setEditingModeEnabled(false);
    }
  }
});

const observer = $objc("MMTextObserver").$new();
$objc_retain(observer);

exports.observe = textView => {
  textView.$setDelegate(observer);
}