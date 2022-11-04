import { descending, max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { transition } from '../core/core.js';
import { events } from '../core/events.js';
import { Constructor, MinimalRadiusScale, SVGGElementSelection } from '../core/types.js';
import { IBubbleMixinConf } from './i-bubble-mixin-conf.js';
import { IBaseMixinConf } from './i-base-mixin-conf.js';

interface MinimalBase {
    configure(conf: IBaseMixinConf);
    data();
    redrawGroup();
    filter(filter: any);
    selectAll(arg0: string);
    hasFilter(f?);
    /**
     * @hidden
     */
    highlightSelected(e): void;
    /**
     * @hidden
     */
    fadeDeselected(e): void;
    /**
     * @hidden
     */
    resetHighlight(e): void;
}

/**
 * This Mixin provides reusable functionalities for any chart that needs to visualize data using bubbles.
 */
// tslint:disable-next-line:variable-name
export function BubbleMixin<TBase extends Constructor<MinimalBase>>(Base: TBase) {
    // @ts-ignore
    return class extends Base {
        public _conf: IBubbleMixinConf;

        /**
         * @hidden
         */
        public BUBBLE_NODE_CLASS: string;
        /**
         * @hidden
         */
        public BUBBLE_CLASS: string;
        /**
         * @hidden
         */
        public MIN_RADIUS: number;
        /**
         * @hidden
         */
        public _r: MinimalRadiusScale;

        constructor(...args: any[]) {
            super(...args);

            this.configure({
                renderLabel: true,
                maxBubbleRelativeSize: 0.3,
                minRadiusWithLabel: 10,
                sortBubbleSize: false,
                elasticRadius: false,
                excludeElasticZero: true,
                radiusValueAccessor: d => d.r,
            });

            // These cane be used by derived classes as well, so member status
            this.BUBBLE_NODE_CLASS = 'node';
            this.BUBBLE_CLASS = 'bubble';
            this.MIN_RADIUS = 10;

            this._r = scaleLinear().domain([0, 100]);
        }

        /**
         * @see {@link BaseMixin.configure}
         */
        public configure(conf: IBubbleMixinConf): any {
            super.configure(conf);
            return this;
        }

        /**
         * @see {@link BaseMixin.conf}
         */
        public conf(): IBubbleMixinConf {
            return this._conf;
        }

        public data() {
            const data = super.data();
            if (this._conf.sortBubbleSize) {
                // sort descending so smaller bubbles are on top
                const radiusAccessor = this._conf.radiusValueAccessor;
                data.sort((a, b) => descending(radiusAccessor(a), radiusAccessor(b)));
            }
            return data;
        }

        /**
         * Get or set the bubble radius scale. By default the bubble chart uses
         * {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear | d3.scaleLinear().domain([0, 100])}
         * as its radius scale.
         * @see {@link https://github.com/d3/d3-scale/blob/master/README.md | d3.scale}
         */
        public r(): MinimalRadiusScale;
        public r(bubbleRadiusScale: MinimalRadiusScale): any;
        public r(bubbleRadiusScale?) {
            if (!arguments.length) {
                return this._r;
            }
            this._r = bubbleRadiusScale;
            return this;
        }

        /**
         * @hidden
         */
        public calculateRadiusDomain(): void {
            if (this._conf.elasticRadius) {
                this.r().domain([this.rMin(), this.rMax()]);
            }
        }

        /**
         * @hidden
         */
        public rMin(): number {
            let values: number[] = this.data().map(this._conf.radiusValueAccessor);
            if (this._conf.excludeElasticZero) {
                values = values.filter(value => value > 0);
            }
            return min(values);
        }

        /**
         * @hidden
         */
        public rMax(): number {
            return max(this.data(), e => this._conf.radiusValueAccessor(e));
        }

        /**
         * @hidden
         */
        public bubbleR(d): number {
            const value = this._conf.radiusValueAccessor(d);
            let r = this.r()(value);
            if (isNaN(r) || value <= 0) {
                r = 0;
            }
            return r;
        }

        /**
         * @hidden
         */
        public _labelFunction(d): string | number {
            return this._conf.label(d);
        }

        /**
         * @hidden
         */
        public _shouldLabel(d): boolean {
            return this.bubbleR(d) > this._conf.minRadiusWithLabel;
        }

        /**
         * @hidden
         */
        public _labelOpacity(d): number {
            return this._shouldLabel(d) ? 1 : 0;
        }

        /**
         * @hidden
         */
        public _labelPointerEvent(d): string {
            return this._shouldLabel(d) ? 'all' : 'none';
        }

        /**
         * @hidden
         */
        public _doRenderLabel(bubbleGEnter): void {
            if (this._conf.renderLabel) {
                let label = bubbleGEnter.select('text');

                if (label.empty()) {
                    label = bubbleGEnter
                        .append('text')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.3em')
                        .on('click', (evt, d) => this.onClick(d));
                }

                label
                    .attr('opacity', 0)
                    .attr('pointer-events', d => this._labelPointerEvent(d))
                    .text(d => this._labelFunction(d));
                transition(
                    label,
                    this._conf.transitionDuration,
                    this._conf.transitionDelay
                ).attr('opacity', d => this._labelOpacity(d));
            }
        }

        /**
         * @hidden
         */
        public doUpdateLabels(bubbleGEnter): void {
            if (this._conf.renderLabel) {
                const labels = bubbleGEnter
                    .select('text')
                    .attr('pointer-events', d => this._labelPointerEvent(d))
                    .text(d => this._labelFunction(d));
                transition(
                    labels,
                    this._conf.transitionDuration,
                    this._conf.transitionDelay
                ).attr('opacity', d => this._labelOpacity(d));
            }
        }

        /**
         * @hidden
         */
        public _titleFunction(d): string | number {
            return this._conf.title(d);
        }

        /**
         * @hidden
         */
        public _doRenderTitles(g): void {
            if (this._conf.renderTitle) {
                const title = g.select('title');

                if (title.empty()) {
                    g.append('title').text(d => this._titleFunction(d));
                }
            }
        }

        /**
         * @hidden
         */
        public doUpdateTitles(g): void {
            if (this._conf.renderTitle) {
                g.select('title').text(d => this._titleFunction(d));
            }
        }

        /**
         * Get or set the minimum radius. This will be used to initialize the radius scale's range.
         */
        public minRadius(): number;
        public minRadius(radius: number);
        public minRadius(radius?) {
            if (!arguments.length) {
                return this.MIN_RADIUS;
            }
            this.MIN_RADIUS = radius;
            return this;
        }

        public fadeDeselectedArea(selection: SVGGElementSelection): void {
            if (this.hasFilter()) {
                const chart = this;
                this.selectAll(`g.${chart.BUBBLE_NODE_CLASS}`).each(function (d) {
                    if (chart.isSelectedNode(d)) {
                        chart.highlightSelected(this);
                    } else {
                        chart.fadeDeselected(this);
                    }
                });
            } else {
                const chart = this;
                this.selectAll(`g.${chart.BUBBLE_NODE_CLASS}`).each(function () {
                    chart.resetHighlight(this);
                });
            }
        }

        /**
         * @hidden
         */
        public isSelectedNode(d: any) {
            return this.hasFilter(d.key);
        }

        public onClick(d: any) {
            const filter = d.key;
            events.trigger(() => {
                this.filter(filter);
                this.redrawGroup();
            });
        }
    };
}
