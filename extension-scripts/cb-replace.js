$ui.render({
  views: [
    {
      type: "label",
      props: {
        id: "lblFind",
        text: "Find",
        align: $align.left
      },
      layout: function(make, view) {
        make.left.top.inset(10)
        make.size.equalTo($size(100, 25))
      }
    },
    {
      type: "input",
      props: {
        id: "txtPattern",
        type: $kbType.default,
        placeholder: "Input Regex pattern for search"
      },
      layout: function(make, view) {
        make.left.equalTo($("lblFind").right).offset(10)
        make.top.offset(10)
        make.height.equalTo(25)
        make.right.equalTo(view.super).offset(-10)
      },
      events: {
        changed: function(sender) {}
      }
    },
    {
      type: "label",
      props: {
        id: "lblReplaceTo",
        text: "Replace",
        align: $align.left
      },
      layout: function(make, view) {
        make.left.offset(10)
        make.top.equalTo($("lblFind").bottom).offset(10)
        make.size.equalTo($size(100, 25))
      }
    },
    {
      type: "input",
      props: {
        id: "txtReplaceTo",
        type: $kbType.default,
        placeholder: "Input text to replace to"
      },
      layout: function(make, view) {
        make.left.equalTo($("lblReplaceTo").right).offset(10)
        make.top.equalTo($("lblReplaceTo").top)
        make.height.equalTo(25)
        make.right.equalTo(view.super).offset(-10)
      },
      events: {
        changed: function(sender) {}
      }
    },
    {
      type: "label",
      props: {
        id: "lblIgnoreCase",
        text: "Ignore Case",
        align: $align.left
      },
      layout: function(make, view) {
        make.left.offset(10)
        make.top.equalTo($("lblReplaceTo").bottom).offset(10)
        make.size.equalTo($size(100, 25))
      }
    },
    {
      type: "switch",
      props: {
        id: "swchIgnoreCase",
      },
      layout: function(make, view) {
        make.right.equalTo(view.super).offset(-10)
        make.top.equalTo($("lblIgnoreCase").top)
        make.height.equalTo(25)
      },
      events: {
        changed: function(sender) {}
      }
    },
    {
      type: "label",
      props: {
        id: "lblWholeWords",
        text: "Whole Words",
        align: $align.left
      },
      layout: function(make, view) {
        make.left.offset(10)
        make.top.equalTo($("lblIgnoreCase").bottom).offset(10)
        make.size.equalTo($size(100, 25))
      }
    },
    {
      type: "switch",
      props: {
        id: "swchWholeWords",
      },
      layout: function(make, view) {
        make.right.equalTo(view.super).offset(-10)
        make.top.equalTo($("lblWholeWords").top)
        make.height.equalTo(25)
      },
      events: {
        changed: function(sender) {}
      }
    },
    {
      type: "label",
      props: {
        id: "lblMultiLines",
        text: "Multiple Lines",
        align: $align.left
      },
      layout: function(make, view) {
        make.left.offset(10)
        make.top.equalTo($("lblWholeWords").bottom).offset(10)
        make.size.equalTo($size(100, 25))
      }
    },
    {
      type: "switch",
      props: {
        id: "swchMultiLines",
      },
      layout: function(make, view) {
        make.right.equalTo(view.super).offset(-10)
        make.top.equalTo($("lblMultiLines").top)
        make.height.equalTo(25)
      },
      events: {
        changed: function(sender) {}
      }
    },
    {
      type: "label",
      props: {
        id: "lblRegexp",
        text: "Regexp",
        align: $align.left
      },
      layout: function(make, view) {
        make.left.offset(10)
        make.top.equalTo($("lblMultiLines").bottom).offset(10)
        make.size.equalTo($size(100, 25))
      }
    },
    {
      type: "switch",
      props: {
        id: "swchRegexp",
      },
      layout: function(make, view) {
        make.right.equalTo(view.super).offset(-10)
        make.top.equalTo($("lblRegexp").top)
        make.height.equalTo(25)
      },
      events: {
        changed: function(sender) {}
      }
    },
    {
      type: "button",
      props: {
        title: "Replace"
      },
      layout: function(make, view) {
        make.left.offset(10);
        make.top.equalTo($("lblRegexp").bottom).offset(10)
        make.size.equalTo($size(100, 25))
        make.width.equalTo(80)
      },
      events: {
        tapped: function(sender) {
          $ui.toast("Tapped");
          var pattern = $("txtPattern").text;
          if (!$("swchRegexp").on) {
            pattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(" ", "\\s")
          }
          if ($("swchWholeWords").on) {
            pattern = "\\b" + pattern + "\\b"
          }
          var reg = new RegExp(pattern, ($("swchIgnoreCase").on ? "i" : "") + ($("swchMultiLines").on ? "m" : "") + "g")
          $clipboard.text = $clipboard.text.replace(reg, $("txtReplaceTo").text)
        }
      }
    }
  ]
})