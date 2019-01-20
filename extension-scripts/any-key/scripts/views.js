exports.button = (title, layout, handler) => {
  return {
    type: "button",
    props: {
      title: title,
      font: $font("medium", 14),
      bgcolor: $color("#bdc1c6"),
      titleColor: $color("black")
    },
    events: {
      tapped: handler
    },
    layout: layout
  }
}