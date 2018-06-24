$ui.render({
  views: [
    {
      type: "label",
      props: {
        lines: 0
      },
      layout: make => {
        make.left.top.right.inset(10);
      }
    },
    {
      type: "slider",
      layout: (make, view) => {
        make.left.bottom.right.inset(64);
      },
      events: {
        changed: sender => {
          setLineSpacing(sender.value);
        }
      }
    }
  ]
})

function setLineSpacing(value) {
  
  var string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin enim nibh, accumsan sed lectus sit amet, lobortis ultricies augue. Phasellus placerat at felis vel faucibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce mollis pharetra sapien vitae tempus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam finibus et felis id facilisis. Curabitur libero justo, egestas vitae pellentesque vitae, viverra eget orci.";
  var spacing = 8 + value * 16;
  var attrText = $objc("NSMutableAttributedString").invoke("alloc").invoke("initWithString", string);

  var style = $objc("NSMutableParagraphStyle").invoke("alloc.init");
  style.invoke("setLineSpacing", spacing);
  attrText.invoke("addAttribute:value:range:", "NSParagraphStyle", style, $range(0, string.length));
  $("label").runtimeValue().invoke("setAttributedText", attrText);
}

setLineSpacing(0);