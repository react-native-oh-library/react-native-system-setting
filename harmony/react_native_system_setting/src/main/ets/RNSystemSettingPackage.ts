import { RNPackage, TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type {
  TurboModule,
  TurboModuleContext,
} from '@rnoh/react-native-openharmony/ts';
import { TM, RNC } from "@rnoh/react-native-openharmony/generated/ts"
import { RNSystemSettingTurboModule } from './RNSystemSettingTurboModule';


class RNSystemSettingTurboModuleFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (this.hasTurboModule(name)) {
      globalThis.uiAbilityContext = this.ctx.uiAbilityContext;
      return new RNSystemSettingTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === TM.ReactNativeSystemSetting.NAME;
  }
}

export class RNSystemSettingPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new RNSystemSettingTurboModuleFactory(ctx);
  }
}