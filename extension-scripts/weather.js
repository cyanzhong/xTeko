$ui.loading("感谢饥人谷提供的开放API")
$http.get({
  url: "http://weixin.jirengu.com/weather",
  handler: function(resp) {
    $ui.loading(false)
    $ui.alert({
      title: resp.data.weather[0].city_name + "当下\n天气：" + resp.data.weather[0].now.text + "\n温度：" + resp.data.weather[0].now.temperature + "\n" + resp.data.weather[0].now.wind_direction + "风" + resp.data.weather[0].now.wind_scale + "级\nPM2.5：" + resp.data.weather[0].now.air_quality.city.pm25 + "\n日出：" + resp.data.weather[0].today.sunrise + "\n日落：" + resp.data.weather[0].today.sunset,
      actions: [
        {
          title: "知道了",
          handler: function() {}
        },
        {
          title: "查看未来三天",
          handler: function() {
            $ui.menu({
              items: [resp.data.weather[0].future[1].date, resp.data.weather[0].future[2].date, resp.data.weather[0].future[3].date],
              handler: function(title, idx) {
                $ui.alert(resp.data.weather[0].city_name + "\n" + resp.data.weather[0].future[idx + 1].date + "\n天气：" + resp.data.weather[0].future[idx + 1].text + "\n温度：" + resp.data.weather[0].future[idx + 1].low + "~" + resp.data.weather[0].future[idx + 1].high + "\n" + resp.data.weather[0].future[idx + 1].wind)
              },
              finished: function(cancelled) {}
            })
          }
        }
      ]
    })
  }
})
