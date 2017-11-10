$ui.loading("感谢饥人谷提供的开放API")
$location.fetch({
  handler: function(location) {
    var query = location.lat + ":" + location.lng
    getCityID(query)
  }
})

function getCityID(query) {
  $http.get({
    url: "https://weixin.jirengu.com/weather/cityid?location=" + query,
    handler: function(resp) {
      getWheatherData(resp.data.results[0].id)
    }
  })
}

function getWheatherData(cityID) {
  $http.get({
    url: "https://weixin.jirengu.com/weather/now?cityid=" + cityID,
    handler: function(resp) {
      $ui.loading(false)
      $ui.alert({
        title: resp.data.weather[0].city_name + "当下\n天气：" + resp.data.weather[0].now.text + "\n温度：" + resp.data.weather[0].now.temperature + "\n" + resp.data.weather[0].now.wind_direction + "风" + resp.data.weather[0].now.wind_scale + "级\nPM2.5：" + resp.data.weather[0].now.air_quality.city.pm25 + "  " + resp.data.weather[0].now.air_quality.city.quality + "\n日出：" + resp.data.weather[0].today.sunrise + "\n日落：" + resp.data.weather[0].today.sunset,
        actions: [{
            title: "知道了",
            handler: function() {}
          },
          {
            title: "查看未来三天",
            handler: function() {
              showMenu(resp)
            }
          }
        ]
      })
    }
  })
}

function showMenu(resp) {
  $ui.menu({
    items: [resp.data.weather[0].future[1].date, resp.data.weather[0].future[2].date, resp.data.weather[0].future[3].date],
    handler: function(title, idx) {
      $ui.alert({
        title: resp.data.weather[0].city_name + "\n" + resp.data.weather[0].future[idx + 1].date + "\n天气：" + resp.data.weather[0].future[idx + 1].text + "\n温度：" + resp.data.weather[0].future[idx + 1].low + "~" + resp.data.weather[0].future[idx + 1].high + "\n" + resp.data.weather[0].future[idx + 1].wind,
        actions: [{
            title: "知道了",
            handler: function() {}
          },
          {
            title: "继续查看",
            handler: function() {
              showMenu(resp)
            }
          }
        ]
      })
    },
    finished: function(cancelled) {}
  })
}