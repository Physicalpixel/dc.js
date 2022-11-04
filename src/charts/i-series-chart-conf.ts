import { ICompositeChartConf } from './i-composite-chart-conf.js';
import { LineChart } from './line-chart.js';
import { BaseAccessor, CompareFn } from '../core/types.js';

export type LineChartFunction = (parent, chartGroup) => LineChart;

export interface ISeriesChartConf extends ICompositeChartConf {
    readonly valueSort?: CompareFn;
    readonly seriesSort?: CompareFn;
    readonly seriesAccessor?: BaseAccessor<string>;
    readonly chartFunction?: LineChartFunction;
}
