$ui.toast([
  "当前没有网络",
  $device.ssid.SSID == null ? "当前 Wi-Fi 未连接" : "当前使用 Wi-Fi: " + $device.ssid.SSID,
  "当前使用蜂窝数据"
][$device.networkType])