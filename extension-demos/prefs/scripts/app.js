function sayHello() {
  $ui.alert($l10n('HELLO_WORLD'));
}

module.exports = {
  sayHello: sayHello
}