/**
 * Plugin Toggle
 *
 * @author: vzangloo <vzangloo@7mayday.com>
 *
 * @link: https://www.7mayday.com
 * @since 1.0.0
 * @copyright 2020 Web Discovery Solutions
 *
 */
;(function (root, factory) {
    // Set the plugin name
    const pluginName = 'Toggle';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {// Universal module definition (amd, commonjs, browser)
        define([], factory());
    } else {
        root[pluginName] = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    'use strict';

    // Set the plugin defaults
    const defaults = {
        onClass: 'toggle-on', // add this class when the button is ON mode
        offClass: 'toggle-off', // add this class when the button is OFF mode
        waitingClass: 'waiting', // add this class when the button is WAITING mode
        disabledClass: 'disabled', // add this class when the button is disabled
        onOn: (element) => {
        }, // handler when the button is ON mode
        onOff: (element) => {
        }, // handler when the button is OFF mode
        onWait: (element) => {
        }, // handler when the button is WAITING mode
        success: (element) => {
            return true;
        } // handler for determine ON mode or OFF mode
    };

    /**
     * Constructor.
     * @param  {element}  selector  The selector element(s).
     * @param  {object}   options  The plugin options.
     * @return {void}
     */
    function Plugin(selector, options) {
        this.options = Object.assign({}, defaults, options);
        this.selector = selector;
        if (this.selector) {
            this.init();
        } else {
            this.els = [];
        }
    }

    /**
     * Toggle handler
     * @return {void}
     */
    const toggleHandler = (e) => {
        const a = e.currentTarget;
        const o = a.options;
        const nClass = a.classList;
        if (!nClass.contains(o.disabledClass) && !nClass.contains(o.waitingClass)) {
            nClass.add(o.waitingClass);
            o.onWait(a);
            if (o.success(a)) {
                if (nClass.contains(o.onClass)) {
                    offMode(a, o);
                } else {
                    onMode(a, o);
                }
            }
        }
    };

    /**
     * Make "ON" mode
     * @param el The button element
     * @param o Plugin options
     */
    const onMode = (el, o) => {
        el.classList.add(o.onClass);
        el.classList.remove(o.offClass, o.waitingClass);
        o.onOn(el);
    };

    /**
     * Make "OFF" mode
     * @param el The button element
     * @param o Plugin options
     */
    const offMode = (el, o) => {
        el.classList.add(o.offClass);
        el.classList.remove(o.onClass, o.waitingClass);
        o.onOff(el);
    };

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
            this.els = document.querySelectorAll(this.selector);
            this.els.forEach(el => {
                el.options = this.options;
                el.addEventListener('click', toggleHandler);
            });
        },

        /**
         * Trigger ON mode for element at specific position
         *
         * @param el Button element
         */
        triggerOn: function (el) {
            onMode(el, this.options);
        },

        /**
         * Trigger OFF mode for element at specific position
         *
         * @param el Button el
         */
        triggerOff: function (el) {
            offMode(el, this.options);
        },

        /**
         * Disable the button element
         *
         * @param el Button element
         */
        disable: function (el) {
            el.classList.add(this.options.disabledClass);
        }
    };

    // Return the plugin
    return Plugin;
}));