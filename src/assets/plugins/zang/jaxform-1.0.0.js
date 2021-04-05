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
;(function (root, factory) {
    // Set the plugin name
    const pluginName = 'JaxForm';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {// Universal module definition (amd, commonjs, browser)
        define([], factory());
    } else {
        root[pluginName] = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    'use strict';

    /* Set the plugin defaults */
    const defaults = {
        container: '', // Result container selector
        nextBtn: '', // Next button selector
        loadingIndicator: '', // Loading indicator selector
        endIndicator: '', // end record message selector
        maxPerPage: 0, // Maximum data returned per page. Default: 0
        prepend: false, // append || prepend
        submitOnLoad: false, // trigger submit when load first time
        xhr: false, // include XHR indicator in form data, indicate is a ajax request. default: false
        request: (obj, page) => {
        } // argument, this ajax form obj, and current page number
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
        init: function () {
            this.page = 1;
            const p = this;

            this.forms = document.querySelectorAll(this.selector);
            if (this.forms.length) {
                const o = this.options;
                this.forms.forEach((form, index) => {
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
                    this.next.forEach((btn) => {
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

            this.isEnd = (this.formDataset('end') === 'true');

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
        formData: function (object = false) {
            if (this.forms.length) {
                const formData = new FormData(this.forms[0]);
                if (this.options.xhr) {
                    formData.append('xhr', '' + 1);
                }

                if (this.options.maxPerPage) {
                    formData.append('max_per_page', '' + this.options.maxPerPage);
                }

                this.forms.forEach((form, index) => {
                    if (index) {
                        const formData_ = new FormData(form);
                        for (let entry of formData_.entries()) {
                            formData.append(entry[0], entry[1]);
                        }
                    }
                });

                if (object) {
                    let obj = {};
                    formData.forEach((value, key) => {
                        obj[key] = value
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
        submit: function () {
            if (this.forms.length) {
                this.forms[0].dispatchEvent(new Event('submit'));
            }
        },

        /**
         * Trigger to get the next page content.
         */
        getNext: function () {
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
        addContent: function (content, totalRecords = 0) {
            if (typeof this.container === undefined || this.container === null) {
                return false;
            }

            if (this.page === 1) {
                this.container.innerHTML = content;
            } else if (this.page >= 1) {
                this.container.insertAdjacentHTML((this.options.prepend ? 'afterbegin' : 'beforeend'), content);
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
        setMaxPerPage: function (maxPerPage) {
            this.options.maxPerPage = maxPerPage;
        },

        /**
         * Get max page
         * @param total Total records
         * @returns {number}
         */
        maxPage: function (total) {
            return Math.ceil(total / this.options.maxPerPage);
        },

        /**
         * Determine if last page reach
         * @param total
         * @returns {boolean}
         */
        isLastPage: function (total) {
            return this.page >= this.maxPage(total);
        },

        /**
         * Show the Next button
         * @param boolean show Determine show or hidden. Default: true
         */
        showNextBtn: function (show = true) {
            if (this.next.length) {
                this.next.forEach((btn) => {
                    btn.style.display = show ? 'block' : 'none';
                    //btn.style.visibility = show? 'visible': 'hidden';
                });
            }
        },

        /**
         * Show the Loading indicator
         * @param boolean show Determine show or hidden. Default: true
         */
        showLoading: function (show = true) {
            if (this.loading !== undefined && this.loading !== null) {
                this.loading.style.display = show ? 'block' : 'none';
                //this.loading.style.visibility = show? 'visible': 'hidden';
            }
        },

        /**
         * Show end of record message
         * @param boolean show Determine show or hidden. Default: true
         */
        showEnd: function (show = true) {
            if (this.end !== undefined && this.end !== null) {
                this.end.style.display = show ? 'block' : 'none';
                //this.end.style.visibility = show? 'visible': 'hidden';
            }
        },

        /**
         * Get forms dataset value
         * @param keyName Key name of the dataset
         * @returns {string|undefined|null}
         */
        formDataset: function (keyName) {
            if (this.forms.length) {
                for (let i = 0; i < this.forms.length; i++) {
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
        formAttribute: function (attributeName) {
            if (this.forms.length) {
                for (let i = 0; i < this.forms.length; i++) {
                    if (this.forms[i].getAttribute(attributeName)) {
                        return this.forms[i].getAttribute(attributeName);
                    }
                }
            }
            return null;
        }
    };

    // Return the plugin
    return Plugin;
}));