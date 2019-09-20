const Constants = {
  api: "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&page=1&per=20&code=",
  redColor: $color("#e74c3c"),
  greenColor: $color("#2ecc71"),
  boldFont: $font("bold", 18),
  regularFont: $font(15)
}

const data = [
  {
    name: "易方达消费行业股票",
    code: "110022"
  },
  {
    name: "天弘中证食品饮料指数A",
    code: "001631"
  }
]

function query(code, callback) {
  $http.get({
    url: Constants.api + code,
    handler: function(resp) {
      var regex = /(\d{4}\-\d{1,2}\-\d{1,2}).*?<td class='tor bold (grn|red)'>(.*?)<\/td>/g
      var match = regex.exec(resp.data)
      var data = {"date": match[1], "rate": match[3]}
      callback(data)
    }
  })
}

function fetch() {
  $ui.render({
    props: {
      title: "基金查询"
    },
    views: [
      {
        type: "list",
        props: {
          rowHeight: 64,
          data: data.map(function(item) {
            var views = {
              type: "view",
              layout: function(make, view) {
                make.edges.equalTo(view.super)
              },
              views: [
                {
                  type: "label",
                  props: {
                    text: item.name,
                    font: Constants.boldFont
                  },
                  layout: function(make, view) {
                    make.left.equalTo(10)
                    make.top.equalTo(10)
                  }
                },
                {
                  type: "label",
                  props: {
                    text: item.code,
                    textColor: $color("lightGray"),
                    font: Constants.regularFont
                  },
                  layout: function(make, view) {
                    make.left.equalTo(10)
                    make.bottom.inset(10)
                  }
                },
                {
                  type: "spinner",
                  props: {
                    id: "spinner" + item.code,
                    loading: true
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.inset(10)
                  }
                },
                {
                  type: "label",
                  props: {
                    id: "label-rate" + item.code,
                    font: Constants.boldFont
                  },
                  layout: function(make, view) {
                    make.right.inset(10)
                    make.top.equalTo(10)
                  }
                },
                {
                  type: "label",
                  props: {
                    id: "label-date" + item.code,
                    textColor: $color("lightGray"),
                    font: Constants.regularFont
                  },
                  layout: function(make, view) {
                    make.right.inset(10)
                    make.bottom.inset(10)
                  }
                }
              ]
            }

            query(item.code, function(resp) {
              $("spinner" + item.code).loading = false
              $("label-rate" + item.code).text = resp.rate.startsWith("-") ? resp.rate : "+" + resp.rate
              $("label-rate" + item.code).textColor = resp.rate.startsWith("-") ? Constants.greenColor : Constants.redColor
              $("label-date" + item.code).text = resp.date
            })

            return views
          })
        },
        layout: $layout.fill
      },
      {
        type: "button",
        props: {
          title: "刷新数据",
          hidden: $app.env == $env.notification
        },
        layout: function(make, view) {
          make.left.bottom.right.inset(10)
          make.height.equalTo(44)
        },
        events: {
          tapped: fetch
        }
      }
    ]
  })
}

fetch()