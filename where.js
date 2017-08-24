$photo.pick({
  handler: function(resp) {
    var metadata = resp.metadata
    if (metadata) {
      var gps = metadata["{GPS}"]
      var query = gps.Latitude + "," + gps.Longitude
      var url = "https://maps.apple.com/?q=" + query + "&ll=" + query
      $app.openURL(url)
    }
  }
})