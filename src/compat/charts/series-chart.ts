import { SeriesChart as SeriesChartNeo } from '../../charts/series-chart.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { ColorMixinExt } from '../base/color-mixin.js';
import { BaseAccessor, ChartGroupType, ChartParentType, CompareFn } from '../../core/types.js';
import { MarginMixinExt } from '../base/margin-mixin.js';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin.js';
import { CompositeChartExt } from './composite-chart.js';
import { LineChartFunction } from '../../charts/i-series-chart-conf.js';

export class SeriesChart extends CompositeChartExt(
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(SeriesChartNeo))))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Get or set the chart function, which generates the child charts.
     * @example
     * // put curve on the line charts used for the series
     * chart.chart(function(c) { return new LineChart(c).curve(d3.curveBasis); })
     * // do a scatter series chart
     * chart.chart(anchor => new ScatterPlot(anchor))
     * @param [chartFunction= (anchor) =>  new LineChart(anchor)]
     */
    public chart(): LineChartFunction;
    public chart(chartFunction: LineChartFunction): this;
    public chart(chartFunction?) {
        if (!arguments.length) {
            return this._conf.chartFunction;
        }
        this.configure({ chartFunction: chartFunction });
        return this;
    }

    /**
     * **mandatory**
     *
     * Get or set accessor function for the displayed series. Given a datum, this function
     * should return the series that datum belongs to.
     * @example
     * // simple series accessor
     * chart.seriesAccessor(function(d) { return "Expt: " + d.key[0]; })
     */
    public seriesAccessor(): BaseAccessor<string>;
    public seriesAccessor(accessor: BaseAccessor<string>): this;
    public seriesAccessor(accessor?) {
        if (!arguments.length) {
            return this._conf.seriesAccessor;
        }
        this.configure({ seriesAccessor: accessor });
        return this;
    }

    /**
     * Get or set a function to sort the list of series by, given series values.
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#ascending d3.ascending}
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#descending d3.descending}
     * @example
     * chart.seriesSort(d3.descending);
     * @param [sortFunction=d3.ascending]
     */
    public seriesSort(): CompareFn;
    public seriesSort(sortFunction: CompareFn): this;
    public seriesSort(sortFunction?) {
        if (!arguments.length) {
            return this._conf.seriesSort;
        }
        this.configure({ seriesSort: sortFunction });
        return this;
    }

    /**
     * Get or set a function to sort each series values by. By default this is the key accessor which,
     * for example, will ensure a lineChart series connects its points in increasing key/x order,
     * rather than haphazardly.
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#ascending d3.ascending}
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#descending d3.descending}
     * @example
     * // Default value sort
     * _chart.valueSort(function keySort (a, b) {
     *     return d3.ascending(_chart.keyAccessor()(a), _chart.keyAccessor()(b));
     * });
     */
    public valueSort(): CompareFn;
    public valueSort(sortFunction: CompareFn): this;
    public valueSort(sortFunction?) {
        if (!arguments.length) {
            return this._conf.valueSort;
        }
        this.configure({ valueSort: sortFunction });
        return this;
    }
}

export const seriesChart = (parent, chartGroup) => new SeriesChart(parent, chartGroup);
