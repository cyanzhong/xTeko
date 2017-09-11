$http.get({
  url: "https://api.ipify.org",
  handler: function(resp) {
    $ui.toast("IP Address: " + resp.data)
  }
})
