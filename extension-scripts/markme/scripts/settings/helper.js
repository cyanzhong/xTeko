exports.selectItem = (item, indexPath, selectedIndex) => {
  const contentView = item.runtimeValue();
  const cell = contentView.$superview();
  const type = indexPath.row == selectedIndex ? 3 : 0;
  cell.$setAccessoryType(type);
}

exports.scrollToIndex = (sender, index) => {
  $delay(0.05, () => {
    sender.scrollTo({
      indexPath: $indexPath(0, index),
      position: 2,
      animated: false
    });
  });
}