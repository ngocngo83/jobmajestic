"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
;

(function (root, factory) {
  // Set the plugin name
  var pluginName = 'Copy';

  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // Universal module definition (amd, commonjs, browser)
    define([], factory());
  } else {
    root[pluginName] = factory(pluginName);
  }
})(typeof self !== 'undefined' ? self : void 0, function () {
  'use strict'; // Set the plugin defaults

  var defaults = {
    addBtn: '',
    // add button selector
    removeBtn: '',
    // remove button selector
    target: '',
    // container selector
    min: 1,
    // minimum item. Default: 1
    max: 10,
    // maximum item. Default: 10
    clear: true,
    // auto clear form input element value. Default: true
    prepend: false,
    // insert new item before old items, else 'append' the new item. Default: false
    autoInputIndex: true,
    // auto rename/ rearrange input array's names with index. Default: true
    beforeAdd: function beforeAdd() {},
    // callable before add.
    afterAdd: function afterAdd(element) {},
    // callable after add. The new row element is available as argument.
    beforeRemove: function beforeRemove() {},
    // callable before remove.
    afterRemove: function afterRemove() {} // callable after remove.

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

  var resetInputName = function resetInputName(o) {
    var rows = document.querySelectorAll(o.target);
    rows.forEach(function (row, i) {
      var inputs = row.querySelectorAll('select,input,textarea'); // find all child input elements

      inputs.forEach(function (input) {
        input.name = input.name.replace(/\[(\d+)?\]/gi, '[' + i + ']');
      });
    });
  };
  /**
   * An example of a private method.
   * @return {void}
   */


  var resetInput = function resetInput(rowElement) {
    var els = rowElement.querySelectorAll('select,input,textarea'); // find all child input elements

    els.forEach(function (input) {
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
    });
  };

  var addHandler = function addHandler(e) {
    var o = e.currentTarget.options;
    o.beforeAdd();
    var rows = document.querySelectorAll(o.target);

    if (rows.length < o.max) {
      var row = rows[o.prepend ? 0 : rows.length - 1];
      var latest = row.insertAdjacentElement(o.prepend ? 'beforebegin' : 'afterend', row.cloneNode(true));

      if (latest) {
        if (o.clear) {
          resetInput(latest);
        }

        var r = latest.querySelector(o.removeBtn);

        if (r.style.visibility === 'hidden') {
          r.style.visibility = 'visible';
        }

        r.options = o;
        r.addEventListener('click', removeHandler);

        if (rows.length + 1 >= o.max) {
          e.currentTarget.style.visibility = 'hidden';
        }

        o.afterAdd(latest);

        if (o.autoInputIndex) {
          resetInputName(o);
        }
      }
    }
  };

  var removeHandler = function removeHandler(e) {
    var o = e.currentTarget.options;
    o.beforeRemove();
    var row = e.currentTarget.closest(o.target);

    if (row) {
      var rows = document.querySelectorAll(o.target);

      if (rows.length > o.min) {
        row.remove();
        var a = document.querySelector(o.addBtn);

        if (a) {
          a.style.visibility = rows.length > o.max ? 'hidden' : 'visible';
        }

        o.afterRemove();

        if (o.autoInputIndex) {
          resetInputName(o);
        }
      }
    }
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
      var _this = this;

      var rows = document.querySelectorAll(this.options.removeBtn);
      var baseIndex = this.options.prepend ? rows.length - 1 : 0;
      rows.forEach(function (r, index) {
        if (index === baseIndex) {
          r.style.visibility = 'hidden';
        } else {
          r.options = _this.options;
          r.addEventListener('click', removeHandler);
        }
      });

      if (rows.length) {
        var a = document.querySelector(this.options.addBtn);

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
    add: function add() {
      var a = document.querySelector(this.options.addBtn);

      if (a) {
        a.click();
      }
    },

    /**
     * Trigger remove copy at specific position
     * @param position Position value must be greater than 0. Default: 1
     */
    remove: function remove() {
      var _this2 = this;

      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (position < 1 || position >= this.options.max) {
        return; // out of range
      }

      var rows = document.querySelectorAll(this.options.target);

      if (rows.length && rows.length > position) {
        rows.forEach(function (node, index) {
          if (index === position) {
            var r = node.querySelector(_this2.options.removeBtn);

            if (r) {
              r.click();
            }
          }
        });
      }
    }
  }; // Return the plugin

  return Plugin;
});