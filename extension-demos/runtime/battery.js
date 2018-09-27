$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/BatteryCenter.framework").$load();

let deviceController = $objc("BCBatteryDeviceController").$sharedInstance();
let devices = deviceController.$connectedDevices();

for (var idx=0; idx<devices.$count(); ++idx) {
  let device = devices.$objectAtIndex(idx);
  console.log(`name: ${device.$name().rawValue()}`);
  console.log(`percentCharge: ${device.$percentCharge()}%`);
  console.log(`charging: ${device.$isCharging()}`);
  console.log(`connected: ${device.$isConnected()}`);
  console.log(`lowBattery: ${device.$isLowBattery()}`);
}