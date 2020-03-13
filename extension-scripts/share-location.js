$location.fetch({
  handler({lat, lng}) {
    const query = `${lat},${lng}`;
    const url = `https://maps.apple.com/?q=${query}&ll=${query}`;
    $share.sheet(url);
  }
});