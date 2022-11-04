import { IBaseMixinConf } from '../base/i-base-mixin-conf.js';
import { BaseAccessor, CompareFn } from '../core/types.js';

export interface ICboxMenuConf extends IBaseMixinConf {
    readonly order?: CompareFn;
    readonly filterDisplayed?: BaseAccessor<boolean>;
    readonly promptValue?: any;
    readonly promptText?: string;
    readonly multiple?: boolean;
}
