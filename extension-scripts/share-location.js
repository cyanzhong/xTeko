$location.fetch({
  handler: function(location) {
    var query = location.lat + "," + location.lng
    var url = "https://maps.apple.com/?q=" + query + "&ll=" + query
    $share.sheet(url)
  }
})