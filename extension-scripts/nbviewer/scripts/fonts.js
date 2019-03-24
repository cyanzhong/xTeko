module.exports = {
  regular: (size = 14) => {
    return $font("Iosevka", size)
  },
  system: (size = 12) => {
    return $objc("UIFont").$systemFontOfSize_weight(size, 0.2).rawValue();
  }
}