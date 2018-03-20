$app.strings = {
  "en": {
    "DISK_TITLE": "Disk: ",
    "MEMORY_TITLE": "Memory: "
  },
  "zh-Hans": {
    "DISK_TITLE": "硬盘：",
    "MEMORY_TITLE": "内存："
  }
}

var space = $device.space

$ui.render({
  views: [
    {
      type: "view",
      layout: function(make, view) {
        make.left.right.inset(20)
        make.centerY.equalTo(-22)
        make.height.equalTo(44)
      },
      views: [
        {
          type: "label",
          props: {
            text: $l10n("DISK_TITLE") + space.disk.free.string + " / " + space.disk.total.string,
            textColor: $color("gray"),
            font: $font("medium", 15)
          },
          layout: function(make, view) {
            make.centerX.equalTo(view.super)
            make.top.equalTo(0)
          }
        },
        {
          type: "view",
          props: {
            bgcolor: $rgba(21, 126, 251, 0.2),
            radius: 5
          },
          layout: function(make, view) {
            make.left.right.equalTo(0)
            make.bottom.equalTo(0)
            make.height.equalTo(24)
          },
          views: [
            {
              type: "view",
              props: {
                bgcolor: $rgb(21, 126, 251)
              },
              layout: function(make, view) {
                make.left.top.bottom.equalTo(0)
                make.width.equalTo(view.super).multipliedBy(space.disk.free.bytes / space.disk.total.bytes)
              }
            }
          ]
        }
      ]
    },
    {
      type: "view",
      layout: function(make, view) {
        make.left.right.inset(20)
        make.centerY.equalTo(22)
        make.height.equalTo(44)
      },
      views: [
        {
          type: "label",
          props: {
            text: $l10n("MEMORY_TITLE") + space.memory.free.string + " / " + space.memory.total.string,
            textColor: $color("gray"),
            font: $font("medium", 15)
          },
          layout: function(make, view) {
            make.centerX.equalTo(view.super)
            make.top.equalTo(0)
          }
        },
        {
          type: "view",
          props: {
            bgcolor: $rgba(255, 59, 48, 0.2),
            radius: 5
          },
          layout: function(make, view) {
            make.left.right.equalTo(0)
            make.bottom.equalTo(0)
            make.height.equalTo(24)
          },
          views: [
            {
              type: "view",
              props: {
                bgcolor: $rgb(255, 59, 48)
              },
              layout: function(make, view) {
                make.left.top.bottom.equalTo(0)
                make.width.equalTo(view.super).multipliedBy(space.memory.free.bytes / space.memory.total.bytes)
              }
            }
          ]
        }
      ]
    }
  ]
})