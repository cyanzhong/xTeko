$ui.render({
  props:{
    title:"随心便签"
  },
  views:[
  {
    type: "button",
    props: {
      id: "Add",
      type: 5
    },
    layout: function(make, view) {
      make.top.inset(40)
      make.right.inset(10)
    },
    events: {
      tapped: function(sender) {
        Edit()
      }
    }
  },
  {
    type: "list",
    props: {
      id: "Fileslist",
    },
    layout: function(make, view) {
      make.top.equalTo($("button").bottom).offset(5)
      make.right.left.bottom.inset(0)
    },
    events: {
      didSelect: function(sender, indexPath, data) {
        Edit(data.replace(".txt", ""), $file.read("Files/" + data).string)
      },
      pulled: function(sender) {
        
      }
    }
  }
  ]
})

$file.mkdir("Files")

var file = $file.list("Files")
for (var i = 0; i < file.length; i++) {
  $("Fileslist").insert({
    indexPath: $indexPath(0, 0),
    value: file[i]
  })
}

function Edit(title, context) {
  $ui.push({
    props: {
      title: "编辑器"
    },
    views: [
    {
      type: "list",
      props: {
        data: [
        {
          rows: [
          {
            type: "input",
            props: {
              id: "Title",
              text: title,
              darkKeyboard: true,
              align: $align.center,
              placeholder: "输入标题"
            },
            layout: function(make, view) {
              make.left.right.top.bottom.inset(5)
            }            
          }
          ]
        }
        ]
      },
      layout: $layout.fill
    },
    {
      type: "text",
      props: {
        id: "Context",
        text: context
      },
      layout: function(make, view) {
        make.left.right.inset(0)
        make.top.inset(45)
        make.bottom.inset(52)
      }
    },
    {
      type: "button",
      props: {
        id: "Save",
        type: 1,
        title: "保存"
      },
      layout: function(make, view) {
        make.bottom.right.inset(10)
        make.size.equalTo($size(100, 32))
      },
      events: {
        tapped: function(sender) {
          $file.write({
            data: $data({string: $("Context").text}),
            path: "Files/" + $("Title").text + ".txt"
          })
          $app.close()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "Cancel",
        type: 1,
        title: "取消"
      },
      layout: function(make, view) {
        make.bottom.left.inset(10)
        make.size.equalTo($size(100, 32))
      },
      events: {
        tapped: function(sender) {
          $ui.pop()
        }
      }
    }
    ]
  })
}