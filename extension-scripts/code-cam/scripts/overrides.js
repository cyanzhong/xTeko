function inject() {
  cancel();
  $define({
    type: "WKContentView",
    props: ["inputView"],
    events: {
      "inputAccessoryView": () => {
        return null;
      }
    }
  });
}

function cancel() {
  $objc_clean("WKContentView");
}

exports.setup = () => {
  $app.listen({
    ready: inject,
    exit: cancel,
  });
}