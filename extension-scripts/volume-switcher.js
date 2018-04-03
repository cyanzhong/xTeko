var items = [
  {
    title: "音量设为 100%",
    action: function() {
      $system.volume = 1.0
    }
  },
  {
    title: "音量设为 60%",
    action: function() {
      $system.volume = 0.6
    }
  },
  {
    title: "音量设为 40%",
    action: function() {
      $system.volume = 0.4
    }
  },
  {
    title: "音量设为 10%",
    action: function() {
      $system.volume = 0.1
    }
  }
]

$ui.menu({
  items: items.map(function(item) {
    return item.title
  }),
  handler: function(title,idx) {
    items[idx].action()
  }
})
