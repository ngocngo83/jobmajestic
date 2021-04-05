"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
;

(function (root, factory) {
  // Set the plugin name
  var pluginName = 'Keep';

  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // Universal module definition (amd, commonjs, browser)
    define([], factory());
  } else {
    root[pluginName] = factory();
  }
})(typeof self !== 'undefined' ? self : void 0, function () {
  'use strict'; // Set the plugin defaults

  var defaults = {
    max: 10,
    // maximum item
    autoRemove: false,
    // auto remove old item when max is reach. default: false
    append: false,
    // add item to the last position. default: false
    unique: false,
    // add unique item only. If item is an object, use property name that needed to be unique. default: false
    filter: function filter(content) {
      // custom closure item filtering.
      if (this.unique === false) {
        return content;
      }

      var temp = [];
      var map = new Map();
      var isObj = this.unique !== true;
      var key;

      var _iterator = _createForOfIteratorHelper(content),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          key = isObj ? item[this.unique] : item;

          if (!map.has(key)) {
            map.set(key, true);
            temp.push(item);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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


  var privateMethod = function privateMethod() {// Your private method code here...
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
    init: function init() {},

    /**
     * Get all items
     *
     * @param name
     * @returns {any[]|any}
     */
    get: function get(name) {
      var content = localStorage.getItem(name);
      return content === null ? new Array() : JSON.parse(content);
    },

    /**
     * An example of a public method.
     * @return {void}
     */
    add: function add(name, value) {
      var content = this.get(name);

      if (content.length >= this.settings.max) {
        if (this.settings.autoRemove) {
          this.settings.append ? content.shift() : content.pop();
        } else {
          return;
        }
      }

      this.settings.append ? content.push(value) : content.unshift(value);
      localStorage.setItem(name, JSON.stringify(this.settings.filter(content)));
    }
  }; // Return the plugin

  return Plugin;
});