/**
 * Plugin Copy
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
    const pluginName = 'Copy';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {// Universal module definition (amd, commonjs, browser)
        define([], factory());
    } else {
        root[pluginName] = factory(pluginName);
    }
}(typeof self !== 'undefined' ? self : this, function () {

    'use strict';

    // Set the plugin defaults
    const defaults = {
        addBtn: '', // add button selector
        removeBtn: '',  // remove button selector
        target: '', // container selector
        min: 1, // minimum item. Default: 1
        max: 10, // maximum item. Default: 10
        clear: true, // auto clear form input element value. Default: true
        prepend: false, // insert new item before old items, else 'append' the new item. Default: false
        autoInputIndex: true, // auto rename/ rearrange input array's names with index. Default: true
        beforeAdd: () => {
        }, // callable before add.
        afterAdd: (element) => {
        }, // callable after add. The new row element is available as argument.
        beforeRemove: () => {
        }, // callable before remove.
        afterRemove: () => {
        } // callable after remove.
    };

    /**
     * Constructor.
     *
     * @param {object}   options  The plugin options.
     * @constructor
     */
    function Plugin(options) {
        this.options = Object.assign({}, defaults, options);
        if (this.options.addBtn && this.options.removeBtn && this.options.target) {
            this.init();
        }
    }

    const resetInputName = (o) => {
        const rows = document.querySelectorAll(o.target);
        rows.forEach((row, i) => {
            const inputs = row.querySelectorAll('select,input,textarea') // find all child input elements
            inputs.forEach((input) => {
                input.name = input.name.replace(/\[(\d+)?\]/gi, '[' + i + ']');
            });
        });
    };

    /**
     * An example of a private method.
     * @return {void}
     */
    const resetInput = (rowElement) => {
        const els = rowElement.querySelectorAll('select,input,textarea') // find all child input elements
        els.forEach(input => {
            switch (input.type) {
                case 'checkbox':
                case 'radio':
                    input.checked = false;
                    break;
                case 'select-one':
                case 'select-multiple':
                    input.selectedIndex = -1;
                    if (input.firstElementChild.disabled && input.firstElementChild.hidden) {
                        input.firstElementChild.selected = true;
                    }
                    break;
                default:
                    input.value = '';
            }
        })
    };

    const addHandler = (e) => {
        const o = e.currentTarget.options;
        o.beforeAdd();
        const rows = document.querySelectorAll(o.target);
        if (rows.length < o.max) {
            const row = rows[o.prepend ? 0 : rows.length - 1];
            const latest = row.insertAdjacentElement(o.prepend ? 'beforebegin' : 'afterend', row.cloneNode(true));
            if (latest) {
                if (o.clear) {
                    resetInput(latest);
                }
                const r = latest.querySelector(o.removeBtn);
                if (r.style.visibility === 'hidden') {
                    r.style.visibility = 'visible';
                }
                r.options = o;
                r.addEventListener('click', removeHandler);

                if ((rows.length + 1) >= o.max) {
                    e.currentTarget.style.visibility = 'hidden';
                }
                o.afterAdd(latest);
                if (o.autoInputIndex) {
                    resetInputName(o);
                }
            }
        }
    };

    const removeHandler = (e) => {
        const o = e.currentTarget.options;
        o.beforeRemove();
        const row = e.currentTarget.closest(o.target);
        if (row) {
            const rows = document.querySelectorAll(o.target);
            if (rows.length > o.min) {
                row.remove();
                const a = document.querySelector(o.addBtn);
                if (a) {
                    a.style.visibility = rows.length > o.max ? 'hidden' : 'visible';
                }
                o.afterRemove();
                if (o.autoInputIndex) {
                    resetInputName(o);
                }
            }
        }
    }

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
            const rows = document.querySelectorAll(this.options.removeBtn);
            const baseIndex = this.options.prepend ? rows.length - 1 : 0;
            rows.forEach((r, index) => {
                if (index === baseIndex) {
                    r.style.visibility = 'hidden';
                } else {
                    r.options = this.options;
                    r.addEventListener('click', removeHandler);
                }
            });

            if (rows.length) {
                const a = document.querySelector(this.options.addBtn);
                if (a) {
                    if (rows.length >= this.options.max) {
                        a.style.visibility = 'hidden';
                    }
                    a.options = this.options;
                    a.removeHandler = this.removeHandler;
                    a.addEventListener('click', addHandler);
                }
                resetInputName(this.options);
            }
        },

        /**
         * Trigger add copy
         */
        add: function () {
            const a = document.querySelector(this.options.addBtn);
            if (a) {
                a.click();
            }
        },

        /**
         * Trigger remove copy at specific position
         * @param position Position value must be greater than 0. Default: 1
         */
        remove: function (position = 1) {
            if (position < 1 || position >= this.options.max) {
                return; // out of range
            }

            const rows = document.querySelectorAll(this.options.target);
            if (rows.length && rows.length > position) {
                rows.forEach((node, index) => {
                    if (index === position) {
                        const r = node.querySelector(this.options.removeBtn)
                        if (r) {
                            r.click();
                        }
                    }
                });
            }
        }
    }

    // Return the plugin
    return Plugin;
}));