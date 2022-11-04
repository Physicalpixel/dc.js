import { IColorMixinConf } from '../base/i-color-mixin-conf.js';
import { IMarginMixinConf } from '../base/i-margin-mixin-conf.js';
import { BaseAccessor, CompareFn, HeatMapClickHandler } from '../core/types.js';

export interface IHeatMapConf extends IColorMixinConf, IMarginMixinConf {
    readonly boxOnClick?: HeatMapClickHandler;
    readonly yAxisOnClick?: HeatMapClickHandler;
    readonly xAxisOnClick?: HeatMapClickHandler;
    readonly rowsLabel?: BaseAccessor<any>;
    readonly colsLabel?: BaseAccessor<any>;
    readonly yBorderRadius?: number;
    readonly xBorderRadius?: number;
    readonly rowOrdering?: CompareFn;
    readonly colOrdering?: CompareFn;
    readonly rows?: undefined;
    readonly cols?: undefined;
}
