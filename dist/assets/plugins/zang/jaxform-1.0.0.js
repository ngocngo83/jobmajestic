"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Plugin JaxForm
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
  var pluginName = 'JaxForm';

  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // Universal module definition (amd, commonjs, browser)
    define([], factory());
  } else {
    root[pluginName] = factory();
  }
})(typeof self !== 'undefined' ? self : void 0, function () {
  'use strict';
  /* Set the plugin defaults */

  var defaults = {
    container: '',
    // Result container selector
    nextBtn: '',
    // Next button selector
    loadingIndicator: '',
    // Loading indicator selector
    endIndicator: '',
    // end record message selector
    maxPerPage: 0,
    // Maximum data returned per page. Default: 0
    prepend: false,
    // append || prepend
    submitOnLoad: false,
    // trigger submit when load first time
    xhr: false,
    // include XHR indicator in form data, indicate is a ajax request. default: false
    request: function request(obj, page) {} // argument, this ajax form obj, and current page number

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
    init: function init() {
      this.page = 1;
      var p = this;
      this.forms = document.querySelectorAll(this.selector);

      if (this.forms.length) {
        var o = this.options;
        this.forms.forEach(function (form, index) {
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            p.showLoading();
            p.showEnd(false);

            if (!index) {
              p.page = 1;
              o.request(p, p.page);
            }
          });
        });
      }

      this.container = document.querySelector(this.options.container);

      if (this.options.nextBtn) {
        this.next = document.querySelectorAll(this.options.nextBtn);

        if (this.next.length) {
          this.next.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
              p.getNext();
            });
          });
        }
      }

      if (this.options.loadingIndicator) {
        this.loading = document.querySelector(this.options.loadingIndicator);
        this.showLoading(false);
      }

      if (this.options.endIndicator) {
        this.end = document.querySelector(this.options.endIndicator);
        this.showEnd(false);
      }

      this.isEnd = this.formDataset('end') === 'true';

      if (this.options.submitOnLoad) {
        this.submit();
      } else if (this.isEnd) {
        this.showEnd();
        this.showNextBtn(false);
      }
    },

    /**
     * Get form data
     * @returns {FormData|*[]}
     */
    formData: function formData() {
      var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.forms.length) {
        var formData = new FormData(this.forms[0]);

        if (this.options.xhr) {
          formData.append('xhr', '' + 1);
        }

        if (this.options.maxPerPage) {
          formData.append('max_per_page', '' + this.options.maxPerPage);
        }

        this.forms.forEach(function (form, index) {
          if (index) {
            var formData_ = new FormData(form);

            var _iterator = _createForOfIteratorHelper(formData_.entries()),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var entry = _step.value;
                formData.append(entry[0], entry[1]);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        });

        if (object) {
          var obj = {};
          formData.forEach(function (value, key) {
            obj[key] = value;
          });
          return obj;
        }

        return formData;
      }

      return [];
    },

    /**
     * Trigger form submit
     */
    submit: function submit() {
      if (this.forms.length) {
        this.forms[0].dispatchEvent(new Event('submit'));
      }
    },

    /**
     * Trigger to get the next page content.
     */
    getNext: function getNext() {
      this.showNextBtn(false);
      this.showLoading();
      this.options.request(this, ++this.page);
    },

    /**
     * Set content to the result container
     * @param content HTML content
     * @param totalRecords total records
     * @returns {boolean}
     */
    addContent: function addContent(content) {
      var totalRecords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (_typeof(this.container) === undefined || this.container === null) {
        return false;
      }

      if (this.page === 1) {
        this.container.innerHTML = content;
      } else if (this.page >= 1) {
        this.container.insertAdjacentHTML(this.options.prepend ? 'afterbegin' : 'beforeend', content);
      }

      if (totalRecords) {
        if (this.isLastPage(totalRecords)) {
          this.showEnd();
        } else {
          this.showNextBtn();
          this.showLoading(false);
          return true;
        }
      }

      this.showNextBtn(false);
      this.showLoading(false);
    },

    /**
     * Set maximum record per page
     *
     * @param maxPerPage
     */
    setMaxPerPage: function setMaxPerPage(maxPerPage) {
      this.options.maxPerPage = maxPerPage;
    },

    /**
     * Get max page
     * @param total Total records
     * @returns {number}
     */
    maxPage: function maxPage(total) {
      return Math.ceil(total / this.options.maxPerPage);
    },

    /**
     * Determine if last page reach
     * @param total
     * @returns {boolean}
     */
    isLastPage: function isLastPage(total) {
      return this.page >= this.maxPage(total);
    },

    /**
     * Show the Next button
     * @param boolean show Determine show or hidden. Default: true
     */
    showNextBtn: function showNextBtn() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.next.length) {
        this.next.forEach(function (btn) {
          btn.style.display = show ? 'block' : 'none'; //btn.style.visibility = show? 'visible': 'hidden';
        });
      }
    },

    /**
     * Show the Loading indicator
     * @param boolean show Determine show or hidden. Default: true
     */
    showLoading: function showLoading() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.loading !== undefined && this.loading !== null) {
        this.loading.style.display = show ? 'block' : 'none'; //this.loading.style.visibility = show? 'visible': 'hidden';
      }
    },

    /**
     * Show end of record message
     * @param boolean show Determine show or hidden. Default: true
     */
    showEnd: function showEnd() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.end !== undefined && this.end !== null) {
        this.end.style.display = show ? 'block' : 'none'; //this.end.style.visibility = show? 'visible': 'hidden';
      }
    },

    /**
     * Get forms dataset value
     * @param keyName Key name of the dataset
     * @returns {string|undefined|null}
     */
    formDataset: function formDataset(keyName) {
      if (this.forms.length) {
        for (var i = 0; i < this.forms.length; i++) {
          if (this.forms[i].dataset[keyName]) {
            return this.forms[i].dataset[keyName];
          }
        }
      }

      return null;
    },

    /**
     * Get forms attributes value
     * @param attributeName
     * @returns {string|null}
     */
    formAttribute: function formAttribute(attributeName) {
      if (this.forms.length) {
        for (var i = 0; i < this.forms.length; i++) {
          if (this.forms[i].getAttribute(attributeName)) {
            return this.forms[i].getAttribute(attributeName);
          }
        }
      }

      return null;
    }
  }; // Return the plugin

  return Plugin;
});