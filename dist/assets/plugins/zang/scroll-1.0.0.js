"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
;

(function (root, factory) {
  /*Set the plugin name*/
  var pluginName = 'Scroll';

  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    /* Universal module definition (amd, commonjs, browser)*/
    define([], factory());
  } else {
    root[pluginName] = factory();
  }
})(typeof self !== 'undefined' ? self : void 0, function () {
  'use strict';
  /** Set scroll direction */

  var scrollAxis = '';
  /** All Callables */

  var callables = [];
  /** Current percentage */

  var pctStep = -1;
  /** debug */

  var debugMode = false;
  /**
   * Constructor.
   *
   * @param axis Scroll axis. 'x' for width, 'y' for height. Default: 'y'
   * @constructor
   * @return {void}
   */

  function Plugin() {
    var axis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
    scrollAxis = axis.toLowerCase();
    this.init();
  }
  /**
   * Get current X position in pixel
   * @returns {number}
   */


  var scrollX = function scrollX() {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  };
  /**
   * Get current Y position in pixel
   * @returns {number}
   */


  var scrollY = function scrollY() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  };
  /**
   * Get current X position in percentage
   * @returns {number}
   */


  var scrollXPCT = function scrollXPCT() {
    return Math.ceil(scrollX() / docWidth() * 100);
  };
  /**
   * Get current Y position in percentage
   * @returns {number}
   */


  var scrollYPCT = function scrollYPCT() {
    return Math.ceil(scrollY() / docHeight() * 100);
  };
  /**
   * Get width viewport of current document
   * @returns {number}
   */


  var clientWidth = function clientWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth || 0;
  };
  /**
   * Get height viewport of current document
   * @returns {number}
   */


  var clientHeight = function clientHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight || 0;
  };
  /**
   * Get maximum width of current document
   * @returns {number}
   */


  var docWidth = function docWidth() {
    var body = document.body;
    var html = document.documentElement;
    return Math.max(body.scrollWidth, body.offsetWidth, body.clientWidth, html.scrollWidth, html.offsetWidth, html.clientWidth) - clientWidth();
  };
  /**
   * Get maximum height of current document
   * @returns {number}
   */


  var docHeight = function docHeight() {
    var body = document.body;
    var html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight, html.scrollHeight, html.offsetHeight, html.clientHeight) - clientHeight();
  };
  /**
   * Get current X or Y position in percentage
   * @returns {number}
   */


  var currentPCT = function currentPCT() {
    return scrollAxis === 'x' ? scrollXPCT() : scrollYPCT();
  };
  /**
   * Get current X or Y position in pixel
   * @returns {number}
   */


  var currentPos = function currentPos() {
    return scrollAxis === 'x' ? scrollX() : scrollY();
  };
  /**
   * Get maximum width or height of current document
   * @returns {number}
   */


  var docMax = function docMax() {
    return scrollAxis === 'x' ? docWidth() : docHeight();
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
    init: function init() {
      window.onscroll = this.run;
    },

    /**
     * Emit the callable when reach the specific position
     *
     * @param position Percentage value. range from 0 - 100
     * @param callable Callable to be execute
     * @param maxInvoke Maximum invoke to the callable. Use 0 for infinite. Default: 1
     */
    emit: function emit() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var callable = arguments.length > 1 ? arguments[1] : undefined;
      var maxInvoke = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      if (position <= 0) {
        position = 1;
      }

      if (position <= 100) {
        if (maxInvoke < 0) {
          maxInvoke = 1;
        }

        callables.push({
          p: position,
          c: callable,
          i: maxInvoke
        });

        if (position === 0 && currentPCT() === 0) {
          this.run();
        }
      }
    },

    /**
     * Execute the position callables
     */
    run: function run() {
      if (debugMode) {
        console.log('scroll-' + scrollAxis.toUpperCase(), currentPCT() + '/100', currentPos() + '/' + docMax());
      }

      if (callables.length) {
        var pct = currentPCT();

        if (pctStep === pct) {
          return 0;
        }

        pctStep = pct;
        var p = currentPos();
        var max = docMax();
        callables.forEach(function (entry, index) {
          /*console.log('percent', p, entry.p);*/
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
    pos: function pos(selector) {
      return scrollAxis === 'x' ? this.xPCT(selector) : this.yPCT(selector);
    },

    /**
     * Get the element's X position value in percentage
     * @param selector Selector of the element
     * @returns {number} Percentage
     */
    xPCT: function xPCT(selector) {
      var e = document.querySelector(selector);

      if (e) {
        var r = e.getBoundingClientRect();

        if (r.left > 0) {
          var p = r.left + scrollX();
          var cw = clientWidth();
          var left = p < cw ? p : p - cw;

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
    yPCT: function yPCT(selector) {
      var e = document.querySelector(selector);

      if (e) {
        var r = e.getBoundingClientRect();

        if (r.top >= 0) {
          var p = r.top + scrollY();
          var ch = clientHeight();
          var top = p < ch ? p : p - ch;

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
    debug: function debug() {
      var enable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      debugMode = enable;
    }
  }; // Return the plugin

  return Plugin;
});