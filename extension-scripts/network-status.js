switch ($device.networkType) {
  case 0: $ui.toast("当前没有网络"); break
  case 1: $ui.toast("当前使用 Wi-Fi: " + $device.ssid.SSID); break
  case 2: $ui.toast("当前使用蜂窝数据"); break
  default: break
}