$define({
  type: "MMLayoutManager: NSObject<NSLayoutManagerDelegate>",
  props: ["linePadding"],
  events: {
    "layoutManager:lineSpacingAfterGlyphAtIndex:withProposedLineFragmentRect:": (mgr, idx, rect) => {
      return self.$linePadding();
    }
  }
});

exports.new = () => {
  const manager = $objc("MMLayoutManager").$new();
  $objc_retain(manager);
  return manager;
}