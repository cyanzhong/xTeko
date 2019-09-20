$input.text({
  text: $context.text || $clipboard.text,
  handler: function(result) {
    save(result)
  }
})

function save(text) {
  $reminder.create({
    title: text,
    handler: function(resp) {
      $ui.toast(resp.status ? "保存成功" : "保存失败")
    }
  })
}