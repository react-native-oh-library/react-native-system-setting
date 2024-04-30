import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from "@rnoh/react-native-openharmony/generated/ts"
import window from '@ohos.window';
import { access } from '@kit.ConnectivityKit';
import { AbilityLifecycleCallback, common, UIAbility, Want } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { audio } from '@kit.AudioKit';
import wifiManager from '@ohos.wifiManager';
import geoLocationManager from '@ohos.geoLocationManager';

export class RNSystemSettingTurboModule extends TurboModule implements TM.ReactNativeSystemSetting.Spec {
  constructor(protected ctx: TurboModuleContext) {
    super(ctx)
    this.setWindowClass()
  }

  private _windowClass: window.Window | undefined = undefined
  private _context: window.Window | undefined = undefined

  private async setWindowClass(): Promise<void> {
    let context = this.ctx.uiAbilityContext;
    let promise = await window.getLastWindow(context);
    this._windowClass = promise
    return
  }

  private startSettingsAppInfoAbilityExplicit(action: string, complete?: () => void) {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.settings',
      abilityName: 'com.huawei.hmos.settings.MainAbility',
      action: 'action.settings',
      uri: action
    };
    context.startAbility(want)
      .then(() => {
        let applicationContext = context.getApplicationContext();
        let callback: AbilityLifecycleCallback = {
          onWindowStageCreate: (ability: UIAbility, windowStage: window.WindowStage): void => {
          },
          onWindowStageActive: (ability: UIAbility, windowStage: window.WindowStage): void => {
          },
          onWindowStageInactive: (ability: UIAbility, windowStage: window.WindowStage): void => {
          },
          onWindowStageDestroy: (ability: UIAbility, windowStage: window.WindowStage): void => {
          },
          onAbilityDestroy: (ability: UIAbility): void => {
            applicationContext.off('abilityLifecycle', lis)
          },
          onAbilityForeground: (ability: UIAbility): void => {
            console.log('111')
            if (complete) {
              complete()
            }
            console.log('222')
            applicationContext.off('abilityLifecycle', lis)
          },
          onAbilityBackground: (ability: UIAbility): void => {
          },
          onAbilityContinue: (ability: UIAbility): void => {
          },
          onAbilityCreate: (ability: UIAbility): void => {
          }
        }
        const lis = applicationContext.on('abilityLifecycle', callback)
      })
      .catch((err: BusinessError) => {
        console.error(`Failed to startAbility. Code: ${err.code}, message: ${err.message}`);
      });
  }

  getBrightness(): Promise<number> {
    // 待实现
    return
  }

  setBrightness(val: number): Promise<boolean> {
    // 待实现
    return
  }

  setBrightnessForce(val: number): Promise<boolean> {
    // 无需实现
    return
  }

  getAppBrightness(): Promise<number> {
    let properties = this._windowClass.getWindowProperties();
    if (properties.brightness === -1) {
      return Promise.resolve(properties.brightness)
    } else {
      return Promise.resolve(Math.round(255 * properties.brightness))
    }
  }

  setAppBrightness(val: number): Promise<boolean> {
    if (val === -1) {
      this._windowClass.setWindowBrightness(val)
        .then(() => {
          return Promise.resolve(true)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    } else {
      const value = val / 255
      this._windowClass.setWindowBrightness(Math.round(value * 1000) / 1000)
        .then(() => {
          return Promise.resolve(true)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    return Promise.resolve(false)
  }

  grantWriteSettingPremission(): void {
    // 待实现
  }

  getScreenMode(): Promise<number> {
    // 待实现
    return
  }

  setScreenMode(val: number): Promise<boolean> {
    this.startSettingsAppInfoAbilityExplicit('display_settings')
    return Promise.resolve(true)
  }

  saveBrightness(): Promise<void> {
    // js层实现
    return
  }

  restoreBrightness(): number {
    // js层实现
    return
  }

  getVolume(type: string): Promise<number> {
    let groupid = audio.DEFAULT_VOLUME_GROUP_ID;
    let audioManager = audio.getAudioManager();
    let audioVolumeManager = audioManager.getVolumeManager();
    let audioVolumeGroupManager: audio.AudioVolumeGroupManager;
    const getVolumeGroupManager = async () => {
      audioVolumeGroupManager = await audioVolumeManager.getVolumeGroupManager(groupid);
      let promise
      if (type === 'music' || type === 'system') {
        promise = audioVolumeGroupManager.getVolume(audio.AudioVolumeType.MEDIA)
      } else if (type === 'ring' || type === 'notification') {
        promise = audioVolumeGroupManager.getVolume(audio.AudioVolumeType.RINGTONE);
      } else if (type === 'call') {
        promise = audioVolumeGroupManager.getVolume(audio.AudioVolumeType.VOICE_CALL)
      } else if (type === 'alarm') {
        promise = audioVolumeGroupManager.getVolume(audio.AudioVolumeType.ALARM)
      } else {
        promise = Promise.reject('Argument must be one of "music,system,ring,notification,call,alarm"')
      }
      return promise
    }
    return getVolumeGroupManager();
  }

  setVolume(value: number, config: Object): void {
    // 待实现
  }

  addVolumeListener(): void {
    let audioManager = audio.getAudioManager();
    let audioVolumeManager = audioManager.getVolumeManager();
    audioVolumeManager.on('volumeChange', (volumeEvent: audio.VolumeEvent) => {
      if (volumeEvent.volumeType === audio.AudioVolumeType.MEDIA) {
        this.ctx.rnInstance.emitDeviceEvent("EventVolume", {
          value: Math.round(volumeEvent.volume / 15 * 100) / 100,
          system: Math.round(volumeEvent.volume / 15 * 100) / 100,
          music: Math.round(volumeEvent.volume / 15 * 100) / 100,
        })
      } else if (volumeEvent.volumeType === audio.AudioVolumeType.RINGTONE) {
        this.ctx.rnInstance.emitDeviceEvent("EventVolume", {
          value: Math.round(volumeEvent.volume / 15 * 100) / 100,
          ring: Math.round(volumeEvent.volume / 15 * 100) / 100,
          notification: Math.round(volumeEvent.volume / 15 * 100) / 100
        })
      } else if (volumeEvent.volumeType === audio.AudioVolumeType.VOICE_CALL) {
        this.ctx.rnInstance.emitDeviceEvent("EventVolume", {
          value: Math.round(volumeEvent.volume / 15 * 100) / 100,
          call: Math.round(volumeEvent.volume / 15 * 100) / 100
        })
      } else if (volumeEvent.volumeType === audio.AudioVolumeType.ALARM) {
        this.ctx.rnInstance.emitDeviceEvent("EventVolume", {
          value: Math.round(volumeEvent.volume / 15 * 100) / 100,
          alarm: Math.round(volumeEvent.volume / 15 * 100) / 100
        })
      }
    });
  }

  removeVolumeListener(listener: TM.ReactNativeSystemSetting.EmitterSubscription): void {
    let audioManager = audio.getAudioManager();
    let audioVolumeManager = audioManager.getVolumeManager();
    audioVolumeManager.on('volumeChange', (volumeEvent: audio.VolumeEvent) => {
      // 暂未支持该接口
    });
  }

  isWifiEnabled(): Promise<boolean> {
    try {
      let isWifiActive = wifiManager.isWifiActive();
      return Promise.resolve(isWifiActive)
    } catch (error) {
      console.error("failed:" + JSON.stringify(error));
    }
  }


  switchWifiSilence(onComplete: () => void): void {
    // 待实现
  }

  switchWifi(onComplete: () => void): void {
    if (onComplete) {
      this.startSettingsAppInfoAbilityExplicit('wifi_entry', onComplete)
    } else {
      this.startSettingsAppInfoAbilityExplicit('wifi_entry')
    }
  }

  isLocationEnabled(): Promise<boolean> {
    let locationEnabled = geoLocationManager.isLocationEnabled();
    return Promise.resolve(locationEnabled)
  }

  getLocationMode(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  switchLocation(onComplete: () => void): void {
    if (onComplete) {
      this.startSettingsAppInfoAbilityExplicit('location_manager_settings', onComplete)
    } else {
      this.startSettingsAppInfoAbilityExplicit('location_manager_settings')
    }
  }

  isBluetoothEnabled(): Promise<boolean> {
    try {
      return Promise.resolve<boolean>(access.getState() === 0 ? false : true)
    } catch (exception) {
      return Promise.reject('Failed to get bluetooth enabled. Cause: ' + JSON.stringify(exception))
    }
  }

  switchBluetooth(onComplete?: () => void): void {
    if (onComplete) {
      this.startSettingsAppInfoAbilityExplicit('bluetooth_entry', onComplete)
    } else {
      this.startSettingsAppInfoAbilityExplicit('bluetooth_entry')
    }
  }

  switchBluetoothSilence(onComplete?: () => void): void {
    const bluetoothState = access.getState()
    if (bluetoothState === 0 || bluetoothState === 3) {
      access.enableBluetooth()
    } else if (bluetoothState === 2 || bluetoothState === 1) {
      access.disableBluetooth()
    }
    if (onComplete) {
      onComplete()
    }
  }

  isAirplaneEnabled(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  switchAirplane(onComplete: () => void): void {
    if (onComplete) {
      this.startSettingsAppInfoAbilityExplicit('mobile_network_entry', onComplete);
    } else {
      this.startSettingsAppInfoAbilityExplicit('mobile_network_entry');
    }
  }

  openAppSystemSettings(): void {
    this.startSettingsAppInfoAbilityExplicit('application_info_entry');
  }

  addBluetoothListener(): void {
    access.on('stateChange', e => {
      if (e === 0) {
        this.ctx.rnInstance.emitDeviceEvent("EventBluetooth", false);
      } else if (e === 2) {
        this.ctx.rnInstance.emitDeviceEvent("EventBluetooth", true);
      }
    });
  }

  addWifiListener(callback: (wifiEnabled: boolean) => void): Promise<TM.ReactNativeSystemSetting.EmitterSubscription | null> {
    throw new Error('Method not implemented.');
  }

  addLocationListener(callback: (locationEnabled: boolean) => void): Promise<TM.ReactNativeSystemSetting.EmitterSubscription | null> {
    throw new Error('Method not implemented.');
  }

  addLocationModeListener(callback: (locationMode: number) => void): Promise<TM.ReactNativeSystemSetting.EmitterSubscription | null> {
    throw new Error('Method not implemented.');
  }

  addAirplaneListener(callback: (airplaneModeEnabled: boolean) => void): Promise<TM.ReactNativeSystemSetting.EmitterSubscription | null> {
    throw new Error('Method not implemented.');
  }

  removeListener(type): void {
    if (type === 'bluetooth') {
      access.off('stateChange');
    }
  }
}