> Template version: v0.2.2

<p align="center">
  <h1 align="center"> <code>react-native-system-setting</code> </h1>
</p>
<p align="center">
    <a href="https://github.com/c19354837/react-native-system-setting/tree/master">
        <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20harmony%20-lightgrey.svg" alt="Supported platforms" />
    </a>
    <a href="https://github.com/c19354837/react-native-system-setting/blob/master/LICENSE.md">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
        <!-- <img src="https://img.shields.io/badge/license-Apache-blue.svg" alt="License" /> -->
    </a>
</p>

> [!TIP] [GitHub address](https://github.com/react-native-oh-library/react-native-system-setting)

## Installation and Usage

Find the matching version information in the release address of a third-party library: [@react-native-oh-library/react-native-system-setting Releases](https://github.com/react-native-oh-library/react-native-system-setting/releases).For older versions that are not published to npm, please refer to the [installation guide](/en/tgz-usage-en.md) to install the tgz package.

Go to the project directory and execute the following instruction:



<!-- tabs:start -->

#### npm

```bash
npm install @react-native-oh-tpl/react-native-system-setting
```

#### yarn

```bash
yarn add @react-native-oh-tpl/react-native-system-setting
```

<!-- tabs:end -->

The following code shows the basic use scenario of the repository:

> [!WARNING] The name of the imported repository remains unchanged.

```tsx
import React, { useState } from "react";
import SystemSetting from "react-native-system-setting";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SystemSettingDemo: React.FC = (): JSX.Element => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>();
  const isBluetoothEnabled = async () => {
    const enabled = await SystemSetting.isBluetoothEnabled();
    setBluetoothEnabled(enabled);
  };
  let bluetoothEvent: Function = () => {};
  return (
    <>
      <ScrollView>
        <View style={styles.module}>
          <Text style={styles.moduleName}>Bluetooth(Bluetooth module)</Text>
          <Text style={styles.moduleContent}>
            Bluetooth status:{bluetoothEnabled === true ? "open" : "close"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              isBluetoothEnabled();
            }}
            style={styles.moduleButton}
          >
            <Text style={styles.buttonText}>Get Bluetooth status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SystemSetting.switchBluetooth(() => {
                console.log("Jump completed");
              });
            }}
            style={styles.moduleButton}
          >
            <Text style={styles.buttonText}>
              Switch Bluetooth status(Jump settings)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SystemSetting.switchBluetoothSilence(() => {
                console.log("Switching completed");
              });
            }}
            style={styles.moduleButton}
          >
            <Text style={styles.buttonText}>Switch Bluetooth status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              bluetoothEvent = await SystemSetting.addBluetoothListener((e) => {
                console.log(JSON.stringify(e));
                setBluetoothEnabled(e);
              });
            }}
            style={styles.moduleButton}
          >
            <Text style={styles.buttonText}>
              Enable Bluetooth status listener
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SystemSetting.removeListener(bluetoothEvent);
            }}
            style={styles.moduleButton}
          >
            <Text style={styles.buttonText}>
              Turn off Bluetooth status listener
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  module: {
    margin: 15,
  },
  moduleName: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 4,
  },
  moduleContent: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  moduleButton: {
    marginBottom: 4,
    backgroundColor: "deepskyblue",
    height: 34,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "400",
    color: "white",
    textAlign: "center",
    lineHeight: 32,
    verticalAlign: "middle",
  },
});

export default SystemSettingDemo;
```

## Use Codegen

If this repository has been adapted to `Codegen`, generate the bridge code of the third-party library by using the `Codegen`. For details, see [Codegen Usage Guide](/en/codegen.md).

## Link

Currently, HarmonyOS does not support AutoLink. Therefore, you need to manually configure the linking.

Open the `harmony` directory of the HarmonyOS project in DevEco Studio.

### 1. Adding the overrides Field to oh-package.json5 File in the Root Directory of the Project

```json
{
  ...
  "overrides": {
    "@rnoh/react-native-openharmony" : "./react_native_openharmony"
  }
}
```

### 2. Introducing Native Code

Currently, two methods are available:

Method 1 (recommended): Use the HAR file.

> [!TIP] The HAR file is stored in the `harmony` directory in the installation path of the third-party library.

Open `entry/oh-package.json5` file and add the following dependencies:

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "file:../react_native_openharmony",
    "@react-native-oh-tpl/react-native-system-setting": "../../node_modules/@react-native-oh-tpl/react-native-system-setting/harmony/react_native_system_setting.har"
  }
```

Click the `sync` button in the upper right corner.

Alternatively, run the following instruction on the terminal:

```bash
cd entry
ohpm install
```

Method 2: Directly link to the source code.

> [!TIP] For details, see [Directly Linking Source Code](/en/link-source-code.md).

### 3. Introducing RNSystemSettingPackage to ArkTS

Open the `entry/src/main/ets/RNPackagesFactory.ts` file and add the following code:

```diff
  ...
+ import { RNSystemSettingPackage } from '@react-native-oh-tpl/react-native-system-setting/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new SamplePackage(ctx),
+   new RNSystemSettingPackage(ctx)
  ];
}
```

### 4. Running

Click the `sync` button in the upper right corner.

Alternatively, run the following instruction on the terminal:

```bash
cd entry
ohpm install
```

Then build and run the code.

## Constraints

### Compatibility

To use this repository, you need to use the correct React-Native and RNOH versions. In addition, you need to use DevEco Studio and the ROM on your phone.

Check the release version information in the release address of the third-party library: [@react-native-oh-library/react-native-system-setting Releases](https://github.com/react-native-oh-library/react-native-system-setting/releases)。

### Permission Requirements

This library involves system control functions such as Bluetooth and brightness. Therefore, you need to configure the corresponding permission in the **module.json5** file in the **entry/src/main** directory when using the corresponding APIs. Some permissions need to be requested from users in a pop-up window. For details about the permission configuration, see [Application Access Control](https://gitee.com/openharmony/docs/blob/master/en/application-dev/security/AccessToken/Readme-EN.md#/openharmony/docs/blob/master/en/application-dev/security/AccessToken/app-permission-mgmt-overview.md)。

Some functions and APIs of this library require the **normal** permissions **ohos.permission.ACCESS_BLUETOOTH** and **ohos.permission.GET_WIFI_INFO**.

Some functions and APIs of this library require the [**full sdk**](https://eco-betaclub.rnd.huawei.com/#/download/DevEco%20Studio/newest) and [**system_basic**](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V5/determine-application-mode-0000001774120042-V5) permissions, such as **ohos.permission.MANAGE_SECURE_SETTINGS** and **ohos.permission.MANAGE_WIFI_CONNECTION**.

## API

> [!TIP] The **Platform** column indicates the platform where the properties are supported in the original third-party library.

> [!TIP] If the value of **HarmonyOS Support** is **yes**, it means that the HarmonyOS platform supports this property; **no** means the opposite; **partially** means some capabilities of this property are supported. The usage method is the same on different platforms and the effect is the same as that of iOS or Android.

For details, see [react-native-system-setting](https://github.com/c19354837/react-native-system-setting/tree/master)

| Name                        | Description                                                                                                                                                                               | Type                     | Required | Platform    | HarmonyOS Support |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------- | ----------- | ----------------- |
| getVolume                   | Get the system volume.                                                                                                                                                                    | (type:string) => Promise | No       | iOS/Android | yes               |
| setVolume                   | Set the system volume by specified value, from 0 to 1. 0 for mute, and 1 is max volume.                                                                                                   | (val:float, config:object) => void | No       | iOS/Android | no                |
| addVolumeListener           | Listen the volume changing, and it will return the listener.                                                                                                                              | callback                 | No       | iOS/Android | yes               |
| removeVolumeListener        | Remove listener when it no longer needed.                                                                                                                                                 | listener                 | No       | iOS/Android | no                |
| getBrightness               | Get the system brightness.                                                                                                                                                                | () => Promise            | No       | iOS/Android | no                |
| setBrightness               | Set the system brightness by specified value, from 0 to 1. 0 for brightless, and 1 is max.                                                                                                | (val:float) => Promise   | No       | iOS/Android | no                |
| setBrightnessForce          | In Android, if the screen mode is auto, SystemSetting.setBrightness() will not work. You can call this to change the screen mode to MANUAL first.                                         | (val:float) => Promise   | No       | Android     | no                |
| setAppBrightness            | For Android and Harmony, `setBrightness()` or `setBrightnessForce()` will change the system's brightness, while this just changes the app's brightness, and it has no permission trouble. | (val:float) => boolean   | No       | Android     | yes               |
| getAppBrightness            | Get the app brightness, and it will returns system brightness if you haven't call `setAppBrightness(val)` yet. (iOS allways returns system brightness)                                    | () => Promise            | No       | Android     | yes               |
| getScreenMode               | (Only for Android, iOS and Harmony will return -1). Get the screen mode, 0 is manual, while 1 is automatic.                                                                               | () => Promise            | No       | Android     | no                |
| setScreenMode               | (Only for Android, iOS and Harmony cannot change it). Change the screen mode, 0 is manual, while 1 is automatic.                                                                          | (mode:int) => Promise    | No       | Android     | no                |
| grantWriteSettingPermission | open app setting page. It's user-friendly when you need some permission. Normally, you can call it if `setScreenMode()`, `setBrightness()` or `setBrightnessForce()` return false         | callback                 | No       | iOS/Android | no                |
| saveBrightness              | It will save current brightness and screen mode.                                                                                                                                          | callback                 | No       | iOS/Android | yes               |
| restoreBrightness           | Restore brightness and screen mode back to saveBrightness(). While iOS only restore the brightness, Android will restore both, Harmony will restore the app's rightness.                  | () => Promise            | No       | iOS/Android | yes               |
| isWifiEnabled               | Get wifi state, true if wifi is on.                                                                                                                                                       | () => Promise            | No       | iOS/Android | yes               |
| switchWifi                  | It will open **Wifi Setting Page**, and you can change it by yourself. When come back to the app, the `complete` will be call.                                                            | (complete) => void       | No       | iOS/Android | yes               |
| switchWifiSilence           | It will open wifi if the wifi is off, and close wifi when the wifi is on now. When it has done, the `complete` will be call.                                                              | (complete) => void       | No       | Android     | no                |
| addWifiListener             | Listen the wifi state changing, and it will return the listener. (Android only)                                                                                                           | (callback) => Promise    | No       | Android     | no                |
| isLocationEnabled           | Get location state, true if location is on.                                                                                                                                               | () => Promise            | No       | iOS/Android | yes               |
| switchLocation              | It will open **System Location Setting Page**, and you can change it by yourself. When come back to the app, the `complete` will be call.                                                 | (complete) => void       | No       | iOS/Android | yes               |
| addLocationListener         | Listen the location state changing, and it will return the listener. (Android only)                                                                                                       | (callback) => Promise    | No       | Android     | no                |
| getLocationMode             | Get current location mode code: `0` - 'off', `1` - 'gps', `2` - 'network', `3` - 'gps & network'. (Android only)                                                                          | () => Promise            | No       | Android     | no                |
| addLocationModeListener     | Listen the location mode changing, and it will return the listener. (Android only)                                                                                                        | (callback) => Promise    | No       | Android     | no                |
| isBluetoothEnabled          | Get bluetooth state, true if bluetooth is on.                                                                                                                                             | () => Promise            | No       | iOS/Android | yes               |
| switchBluetooth             | It will open **System Bluetooth Setting Page**, and you can change it by yourself. When come back to the app, the `complete` will be call.                                                | (complete) => void       | No       | iOS/Android | yes               |
| switchBluetoothSilence      | It will open bluetooth if the bluetooth is off, and close bluetooth when the bluetooth is on now. When it has done, the `complete` will be call. In android, it's done programmatically.  | (complete) => void       | No       | Android     | yes               |
| addBluetoothListener        | Listen the bluetooth state changing, and it will return the listener.                                                                                                                     | (callback) => Promise    | No       | iOS/Android | yes               |
| isAirplaneEnabled           | Get airplane state, true if airplane is on.                                                                                                                                               | () => Promise            | No       | iOS/Android | no                |
| switchAirplane              | It will open **System Setting Page**, and you can change it by yourself.                                                                                                                  | (complete) => void       | No       | iOS/Android | yes               |
| addAirplaneListener         | Listen the airplane state changing, and it will return the listener. (Android only)                                                                                                       | (callback) => Promise    | No       | Android     | no                |
| setAppStore                 | `true` means that you'll submit your app to App Store,`false` means that your app will not upload to App Store, and you can use any APIs at will.                                         | (isAppStore:bool) => void| No       | iOS         | no                |
| removeListener              | you can use this to remove the listener which return by `add*Listener(callback)`                                                                                                          | (listener) => void       | No       | iOS/Android | yes               |
| openAppSystemSettings       | open app's setting page                                                                                                                                                                   | callback                 | No       | iOS/Android | yes               |

## Others

HarmonyOS does not support certain APIs that are exclusive to Android/iOS: [issue#11](https://github.com/react-native-oh-library/react-native-system-setting/issues/11).

## Known Issues

- [ ] HarmonyOS does not support certain APIs due to the system volume permission: [issue#3](https://github.com/react-native-oh-library/react-native-system-setting/issues/3).
- [ ] HarmonyOS does not support certain APIs due to the system brightness and brightness mode permission: [issue#4](https://github.com/react-native-oh-library/react-native-system-setting/issues/4).
- [ ] HarmonyOS does not support certain APIs due to the system Wi-Fi permission: [issue#5](https://github.com/react-native-oh-library/react-native-system-setting/issues/5).
- [ ] HarmonyOS does not support certain APIs because the system does not support the deletion of volume listeners: [issue#6](https://github.com/react-native-oh-library/react-native-system-setting/issues/6).
- [ ] HarmonyOS does not support certain APIs because the system does not support the location service mode listener APIs: [issue#7](https://github.com/react-native-oh-library/react-native-system-setting/issues/7).
- [ ] HarmonyOS does not support certain APIs because the system does not support the API for obtaining the location service mode: [issue#8](https://github.com/react-native-oh-library/react-native-system-setting/issues/8).
- [ ] HarmonyOS does not support certain APIs because the system does not support the API for obtaining the airplane mode status: [issue#9](https://github.com/react-native-oh-library/react-native-system-setting/issues/9).
- [ ] HarmonyOS does not support certain APIs because the system does not support the API for enabling or disabling the airplane mode listener: [issue#10](https://github.com/react-native-oh-library/react-native-system-setting/issues/10).

## License

This project is licensed under [The MIT License (MIT)](https://github.com/c19354837/react-native-system-setting/blob/master/LICENSE.md).
