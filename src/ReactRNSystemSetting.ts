import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    getBrightness: () => Promise<number>;

    setBrightness: (val: number) => Promise<boolean>;

    setBrightnessForce: (val: number) => Promise<boolean>;

    getAppBrightness: () => Promise<number>;

    setAppBrightness: (val: number) => Promise<boolean>;

    grantWriteSettingPremission: () => void;

    getScreenMode: () => Promise<number>;

    setScreenMode: (val: number) => Promise<boolean>;

    saveBrightness: () => Promise<void>;

    restoreBrightness: () => number;

    getVolume: (type?: VolumeType) => Promise<number>;

    setVolume: (value: number, config?: VolumeConfig | VolumeType) => void;

    addVolumeListener: () => void;

    removeVolumeListener: (listener?: EmitterSubscription) => void;

    isWifiEnabled: () => Promise<boolean>;

    switchWifiSilence: (onComplete?: CompleteFunc) => void;

    switchWifi: (onComplete?: CompleteFunc) => void;

    isLocationEnabled: () => Promise<boolean>;

    getLocationMode: () => Promise<number>;

    switchLocation: (onComplete?: CompleteFunc) => void;

    isBluetoothEnabled: () => Promise<boolean>;

    switchBluetooth: (onComplete?: CompleteFunc) => void;

    switchBluetoothSilence: (onComplete?: CompleteFunc) => void;

    isAirplaneEnabled: () => Promise<boolean>;

    switchAirplane: (onComplete?: CompleteFunc) => void;

    openAppSystemSettings: () => void;

    addBluetoothListener: () => void;

    addWifiListener: (
        callback: (wifiEnabled: boolean) => void
    ) => Promise<EmitterSubscription | null>;

    addLocationListener: (
        callback: (locationEnabled: boolean) => void
    ) => Promise<EmitterSubscription | null>;

    addLocationModeListener: (
        callback: (locationMode: number) => void
    ) => Promise<EmitterSubscription | null>;

    addAirplaneListener: (
        callback: (airplaneModeEnabled: boolean) => void
    ) => Promise<EmitterSubscription | null>;

    removeListener: (type: string) => void;
}

type EmitterSubscription = {
    remove: unknown;
    type: 'bluetooth' | 'wifi' | 'location' | 'locationMode' | 'airplane'
}

type CompleteFunc = () => void

type VolumeType =
    | "call"
    | "system"
    | "ring"
    | "music"
    | "alarm"
    | "notification";

type VolumeConfig = {
    type?: VolumeType;
    playSound?: boolean;
    showUI?: boolean;
}

type VolumeData = {
    value: number;
    call?: number;
    system?: number;
    ring?: number;
    music?: number;
    alarm?: number;
    notification?: number;
}

export default TurboModuleRegistry.get<Spec>('ReactNativeSystemSetting') as Spec | null;