/**
 * Plugin Scroll
 *
 * @author: vzangloo <vzangloo@7mayday.com>
 *
 * @link: https://www.7mayday.com
 * @since 1.0.0
 * @copyright 2020 Web Discovery Solutions
 *
 */
;(function (root, factory) {
    /*Set the plugin name*/
    const pluginName = 'Scroll';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {/* Universal module definition (amd, commonjs, browser)*/
        define([], factory());
    } else {
        root[pluginName] = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    'use strict';

    /** Set scroll direction */
    let scrollAxis = '';

    /** All Callables */
    const callables = [];

    /** Current percentage */
    let pctStep = -1;

    /** debug */
    let debugMode = false;

    /**
     * Constructor.
     *
     * @param axis Scroll axis. 'x' for width, 'y' for height. Default: 'y'
     * @constructor
     * @return {void}
     */
    function Plugin(axis = 'y') {
        scrollAxis = axis.toLowerCase();
        this.init();
    }

    /**
     * Get current X position in pixel
     * @returns {number}
     */
    const scrollX = () => window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    /**
     * Get current Y position in pixel
     * @returns {number}
     */
    const scrollY = () => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    /**
     * Get current X position in percentage
     * @returns {number}
     */
    const scrollXPCT = () => Math.ceil(scrollX() / docWidth() * 100);

    /**
     * Get current Y position in percentage
     * @returns {number}
     */
    const scrollYPCT = () => Math.ceil(scrollY() / docHeight() * 100);

    /**
     * Get width viewport of current document
     * @returns {number}
     */
    const clientWidth = () => document.documentElement.clientWidth || document.body.clientWidth || 0;

    /**
     * Get height viewport of current document
     * @returns {number}
     */
    const clientHeight = () => document.documentElement.clientHeight || document.body.clientHeight || 0;

    /**
     * Get maximum width of current document
     * @returns {number}
     */
    const docWidth = () => {
        const body = document.body;
        const html = document.documentElement;

        return Math.max(
            body.scrollWidth, body.offsetWidth, body.clientWidth,
            html.scrollWidth, html.offsetWidth, html.clientWidth
        ) - clientWidth();
    };

    /**
     * Get maximum height of current document
     * @returns {number}
     */
    const docHeight = () => {
        const body = document.body;
        const html = document.documentElement;

        return Math.max(
            body.scrollHeight, body.offsetHeight, body.clientHeight,
            html.scrollHeight, html.offsetHeight, html.clientHeight
        ) - clientHeight();
    };

    /**
     * Get current X or Y position in percentage
     * @returns {number}
     */
    const currentPCT = () => (scrollAxis === 'x') ? scrollXPCT() : scrollYPCT();

    /**
     * Get current X or Y position in pixel
     * @returns {number}
     */
    const currentPos = () => (scrollAxis === 'x') ? scrollX() : scrollY();

    /**
     * Get maximum width or height of current document
     * @returns {number}
     */
    const docMax = () => (scrollAxis === 'x') ? docWidth() : docHeight();

    /**
     * Public variables and methods.
     * @type {object}
     */
    Plugin.prototype = {
        /**
         * Initialize the plugin.
         * @return {void}
         */
        init: function () {
            window.onscroll = this.run;
        },

        /**
         * Emit the callable when reach the specific position
         *
         * @param position Percentage value. range from 0 - 100
         * @param callable Callable to be execute
         * @param maxInvoke Maximum invoke to the callable. Use 0 for infinite. Default: 1
         */
        emit: function (position = 0, callable, maxInvoke = 1) {
            if (position <= 0) {
                position = 1;
            }
            if (position <= 100) {
                if (maxInvoke < 0) {
                    maxInvoke = 1;
                }
                callables.push({p: position, c: callable, i: maxInvoke});
                if (position === 0 && currentPCT() === 0) {
                    this.run();
                }
            }
        },

        /**
         * Execute the position callables
         */
        run: () => {
            if (debugMode) {
                console.log('scroll-' + scrollAxis.toUpperCase(), currentPCT() + '/100', currentPos() + '/' + docMax())
            }

            if (callables.length) {
                const pct = currentPCT();
                if (pctStep === pct) {
                    return 0;
                }
                pctStep = pct;
                const p = currentPos();
                const max = docMax();
                callables.forEach((entry, index) => {/*console.log('percent', p, entry.p);*/
                    if (pct === entry.p) {
                        entry.c(pct, p, max);
                        if (--callables[index].i === 0) {
                            delete callables[index];
                        }
                    }
                });
            }
        },

        /**
         * Get X or Y position of the selector element in percentage
         * @param selector Selector of the element
         * @returns {number} Percentage
         */
        pos: function (selector) {
            return scrollAxis === 'x' ? this.xPCT(selector) : this.yPCT(selector);
        },

        /**
         * Get the element's X position value in percentage
         * @param selector Selector of the element
         * @returns {number} Percentage
         */
        xPCT: (selector) => {
            const e = document.querySelector(selector);
            if (e) {
                const r = e.getBoundingClientRect();
                if (r.left > 0) {
                    const p = r.left + scrollX();
                    const cw = clientWidth();
                    const left = (p < cw) ? p : p - cw;
                    if (debugMode) {
                        console.log('scroll-Y:' + selector, Math.ceil(left / docWidth() * 100) + '/100', Math.ceil(left) + '/' + docWidth());
                    }
                    return Math.ceil(left / docWidth() * 100);
                }
            }
            return 0;
        },

        /**
         * Get the element's Y position value in percentage
         * @param selector Selector of the element
         * @returns {number} Percentage
         */
        yPCT: (selector) => {
            const e = document.querySelector(selector);
            if (e) {
                const r = e.getBoundingClientRect();
                if (r.top >= 0) {
                    const p = r.top + scrollY();
                    const ch = clientHeight();
                    const top = (p < ch) ? p : p - ch;
                    if (debugMode) {
                        console.log('scroll-Y:' + selector, Math.ceil(top / docHeight() * 100) + '/100', Math.ceil(top) + '/' + docHeight());
                    }
                    return Math.ceil(top / docHeight() * 100);
                }
            }
            return 0;
        },

        /**
         * Enable debug mode
         * @param enable
         */
        debug: function (enable = true) {
            debugMode = enable;
        }
    };

    // Return the plugin
    return Plugin;
}));