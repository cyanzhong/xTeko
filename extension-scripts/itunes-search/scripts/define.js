String.prototype.replaceAll = function(key, replacement) {
  return this.replace(new RegExp(key, 'g'), replacement)
}