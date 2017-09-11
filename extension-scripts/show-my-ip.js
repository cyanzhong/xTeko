$http.get({
  url: "https://api.ipify.org",
  handler: function(respose) {
    $ui.toast("IP Adress: "+respose.data)
  }
})
