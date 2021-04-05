/**
 * Plugin Keep
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
    const pluginName = 'Keep';

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
        max: 10,    // maximum item
        autoRemove: false, // auto remove old item when max is reach. default: false
        append: false,  // add item to the last position. default: false
        unique: false, // add unique item only. If item is an object, use property name that needed to be unique. default: false
        filter: function (content) { // custom closure item filtering.
            if (this.unique === false) {
                return content;
            }

            const temp = [];
            const map = new Map();
            const isObj = (this.unique !== true);
            var key;
            for (var item of content) {
                key = (isObj) ? item[this.unique] : item;
                if (!map.has(key)) {
                    map.set(key, true);
                    temp.push(item);
                }
            }
            return temp;
        }
    };

    /**
     * Constructor.
     * @param  {element}  element  The selector element(s).
     * @param  {object}   options  The plugin options.
     * @return {void}
     */
    function Plugin(options) {
        this.settings = Object.assign({}, defaults, options);
    }

    /**
     * An example of a private method.
     * @return {void}
     */
    const privateMethod = () => {
        // Your private method code here...
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
        init: () => {
        },

        /**
         * Get all items
         *
         * @param name
         * @returns {any[]|any}
         */
        get: function (name) {
            var content = localStorage.getItem(name);
            return (content === null) ? new Array() : JSON.parse(content);
        },

        /**
         * An example of a public method.
         * @return {void}
         */
        add: function (name, value) {
            var content = this.get(name);

            if (content.length >= this.settings.max) {
                if (this.settings.autoRemove) {
                    (this.settings.append) ? content.shift() : content.pop()
                } else {
                    return;
                }
            }

            (this.settings.append) ? content.push(value) : content.unshift(value);
            localStorage.setItem(name, JSON.stringify(this.settings.filter(content)));
        }


    };

    // Return the plugin
    return Plugin;
}));