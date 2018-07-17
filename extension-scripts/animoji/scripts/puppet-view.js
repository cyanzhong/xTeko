$define({
  type: "PuppetView: AVTPuppetView",
  events: {
    startRecording: startRecording,
    stopRecording: stopRecording,
    audioPlayerItemDidReachEnd: audioPlayerItemDidReachEnd
  }
});

function startRecording() {
  self.$super().$startRecording();
  $app.notify({ "name": "puppetDidStartRecording", "object": self });
  // TODO: - Increase duration to 60s, or recording with ReplayKit
}

function stopRecording() {
  self.$super().$stopRecording();
  $app.notify({ "name": "puppetDidStopRecording", "object": self });
}

function audioPlayerItemDidReachEnd(arg) {
  self.$super().$audioPlayerItemDidReachEnd(arg);
  $app.notify({ "name": "puppetDidFinishPlaying", "object": self });
}