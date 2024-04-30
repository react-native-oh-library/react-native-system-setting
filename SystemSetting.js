import { NativeModules, NativeEventEmitter, Linking, Platform, TurboModuleRegistry, DeviceEventEmitter } from 'react-native'

import Utils from './Utils'

const SystemSettingNative = TurboModuleRegistry ? TurboModuleRegistry.get('ReactNativeSystemSetting') : NativeModules.SystemSetting

const SCREEN_BRIGHTNESS_MODE_UNKNOW = -1
const SCREEN_BRIGHTNESS_MODE_MANUAL = 0
const SCREEN_BRIGHTNESS_MODE_AUTOMATIC = 1

const isHarmony = Platform.OS === 'harmony'

const eventEmitter = new NativeEventEmitter(SystemSettingNative)

export default class SystemSetting {
    static saveBrightnessVal = -1
    static saveScreenModeVal = SCREEN_BRIGHTNESS_MODE_AUTOMATIC

    /**
     * @deprecated
     */
    static setAppStore() {
        console.warn("You don't need call setAppStore() anymore since V1.7.0")
    }

    static async getBrightness() {
        if (!isHarmony) {
            return await SystemSettingNative.getBrightness()
        } else {
            return await SystemSetting.getAppBrightness()
        }

    }

    static async setBrightness(val) {
        try {
            if (!isHarmony) {
                await SystemSettingNative.setBrightness(val)
                return true
            } else {
                await SystemSetting.setAppBrightness(val)
            }

        } catch (e) {
            return false
        }
    }

    static async setBrightnessForce(val) {
        if (Utils.isAndroid) {
            const success = await SystemSetting.setScreenMode(SCREEN_BRIGHTNESS_MODE_MANUAL)
            if (!success) {
                return false
            }
        }
        return await SystemSetting.setBrightness(val)
    }

    static setAppBrightness(val) {
        if (Utils.isAndroid || isHarmony) {
            SystemSettingNative.setAppBrightness(val)
        } else {
            SystemSetting.setBrightness(val)
        }
        return Promise.resolve(true)
    }

    static async getAppBrightness() {
        if (Utils.isAndroid || isHarmony) {
            return SystemSettingNative.getAppBrightness()
        } else {
            return SystemSetting.getBrightness()
        }
    }

    /**
     * @deprecated use grantWriteSettingPermission instead
     */
    static grantWriteSettingPremission() {
        __DEV__ && console.warn('grantWriteSettingPremission has been renamed to grantWriteSettingPermission, see https://github.com/c19354837/react-native-system-setting/pull/98')
        SystemSetting.grantWriteSettingPermission()
    }

    /**
     * since v1.7.4
     */
    static grantWriteSettingPermission() {
        if (Utils.isAndroid) {
            SystemSettingNative.openWriteSetting()
        }
    }

    static async getScreenMode() {
        if (Utils.isAndroid) {
            return await SystemSettingNative.getScreenMode()
        }
        return -1 // cannot get iOS screen mode
    }

    static async setScreenMode(val) {
        if (Utils.isAndroid || isHarmony) {
            try {
                await SystemSettingNative.setScreenMode(val)
            } catch (e) {
                return false
            }
        }
        return true
    }

    static async saveBrightness() {
        if (!isHarmony) {
            SystemSetting.saveBrightnessVal = await SystemSetting.getBrightness()
            SystemSetting.saveScreenModeVal = await SystemSetting.getScreenMode()
        } else {
            SystemSetting.saveBrightnessVal = await SystemSetting.getAppBrightness()
        }
    }

    static restoreBrightness() {
        if (SystemSetting.saveBrightnessVal == -1) {
            console.warn('you should call saveBrightness() at least once')
        } else {
            if (!isHarmony) {
                SystemSetting.setBrightness(SystemSetting.saveBrightnessVal)
                SystemSetting.setScreenMode(SystemSetting.saveScreenModeVal)
            } else {
                SystemSettingNative.setAppBrightness(SystemSetting.saveBrightnessVal)
            }
        }
        return SystemSetting.saveBrightnessVal
    }

    static async getVolume(type = 'music') {
        if (!isHarmony) {
            return await SystemSettingNative.getVolume(type)
        } else {
            const vol = await SystemSettingNative.getVolume(type)
            if (Object.prototype.toString.call(vol) === '[object Number]') {
                return Math.round(vol / 15 * 100) / 100
            }
        }
    }

    static setVolume(val, config = {}) {
        if (typeof (config) === 'string') {
            console.log('setVolume(val, type) is deprecated since 1.2.2, use setVolume(val, config) instead')
            config = { type: config }
        }
        config = Object.assign({
            playSound: false,
            type: 'music',
            showUI: false
        }, config)
        SystemSettingNative.setVolume(val, config)
    }

    static addVolumeListener(callback) {
        if (!isHarmony) {
            return eventEmitter.addListener('EventVolume', callback)
        } else {
            SystemSettingNative.addVolumeListener()
            const obj =  DeviceEventEmitter.addListener('EventVolume', e => {
                callback(e)
            })
            obj.type = 'volume'
            return obj
        }
    }

    static removeVolumeListener(listener) {
        
        listener && listener.remove()
    }

    static async isWifiEnabled() {
        const result = await SystemSettingNative.isWifiEnabled()
        if (!isHarmony) {
            return (result) > 0
        } else {
            return result
        }

    }

    static switchWifiSilence(complete) {
        if (Utils.isAndroid) {
            SystemSetting.listenEvent(complete)
            SystemSettingNative.switchWifiSilence()
        } else {
            SystemSetting.switchWifi(complete)
        }
    }

    static switchWifi(complete) {
        if (!isHarmony) {
            SystemSetting.listenEvent(complete)
            SystemSettingNative.switchWifi()
        } else {
            SystemSettingNative.switchWifi(complete)
        }
    }

    static async isLocationEnabled() {
        return await SystemSettingNative.isLocationEnabled()
    }

    static async getLocationMode() {
        if (Utils.isAndroid) {
            return await SystemSettingNative.getLocationMode()
        } else {
            return await SystemSetting.isLocationEnabled() ? 1 : 0
        }
    }

    static switchLocation(complete) {
        if (!isHarmony) {
            SystemSetting.listenEvent(complete)
            SystemSettingNative.switchLocation()
        } else {
            SystemSettingNative.switchLocation(complete)
        }
    }

    static async isBluetoothEnabled() {
        return await SystemSettingNative.isBluetoothEnabled()
    }

    static switchBluetooth(complete) {
        if (!isHarmony) {
            SystemSetting.listenEvent(complete)
            SystemSettingNative.switchBluetooth()
        } else {
            SystemSettingNative.switchBluetooth(complete)
        }

    }

    static switchBluetoothSilence(complete) {
        if (Utils.isAndroid) {
            SystemSetting.listenEvent(complete)
            SystemSettingNative.switchBluetoothSilence()
        } else if (isHarmony) {
            SystemSettingNative.switchBluetoothSilence(complete)
        } else {
            SystemSettingNative.switchBluetooth(complete)
        }
    }

    static async isAirplaneEnabled() {
        return await SystemSettingNative.isAirplaneEnabled()
    }

    static switchAirplane(complete) {
        SystemSetting.listenEvent(complete)
        SystemSettingNative.switchAirplane()
    }

    static async openAppSystemSettings() {
        switch (Platform.OS) {
            case 'ios': {
                const settingsLink = 'app-settings:';
                const supported = await Linking.canOpenURL(settingsLink)
                if (supported) await Linking.openURL(settingsLink);
                break;
            }
            case 'android':
                await SystemSettingNative.openAppSystemSettings()
                break;
            case 'harmony':
                SystemSettingNative.openAppSystemSettings()
                break;
            default:
                throw new Error('unknown platform')
                break;
        }
    }

    static async addBluetoothListener(callback) {
        if (!isHarmony) {
            return await SystemSetting._addListener(false, 'bluetooth', 'EventBluetoothChange', callback)
        } else {
            SystemSettingNative.addBluetoothListener()
            const obj =  DeviceEventEmitter.addListener('EventBluetooth', e => {
                callback(e)
            })
            obj.type = 'bluetooth'
            return obj
        }
    }

    static async addWifiListener(callback) {
        return await SystemSetting._addListener(true, 'wifi', 'EventWifiChange', callback)
    }

    static async addLocationListener(callback) {
        return await SystemSetting._addListener(true, 'location', 'EventLocationChange', callback)
    }

    static async addLocationModeListener(callback) {
        return await SystemSetting._addListener(true, 'locationMode', 'EventLocationModeChange', callback)
    }

    static async addAirplaneListener(callback) {
        return await SystemSetting._addListener(true, 'airplane', 'EventAirplaneChange', callback)
    }

    static async _addListener(androidOnly, type, eventName, callback) {
        if (!androidOnly || Utils.isAndroid) {
            const result = await SystemSetting._activeListener(type)
            if (result) {
                return eventEmitter.addListener(eventName, callback)
            }
        }
        return null
    }

    static async _activeListener(name) {
        try {
            await SystemSettingNative.activeListener(name)
        } catch (e) {
            console.warn(e.message)
            return false;
        }
        return true;
    }

    static removeListener(listener) {
        if (!isHarmony) {
            listener && listener.remove()
        } else {
            if (listener.type === 'bluetooth') {
                SystemSettingNative.removeListener('bluetooth')
                listener && listener.remove()
            }
        }

    }

    static listenEvent(complete) {
        if (!complete) return

        const listener = eventEmitter.addListener('EventEnterForeground', () => {
            listener.remove()
            complete()
        })
    }
}