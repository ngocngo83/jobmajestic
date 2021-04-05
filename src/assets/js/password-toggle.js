/* 
 * Plugin PasswordToggle
 * 
 * Author: Ken (waiken.jobmajestic@gmail.com)
 * 
 * @since 1.0.0
 * 
 */
;(function (root, factory) {
    // Set the plugin name
    const pluginName = 'PasswordToggle';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {// Universal module definition (amd, commonjs, browser)
        define([], factory());
    } else {
        root[pluginName] = factory(pluginName);
    }
}(typeof self !== 'undefined' ? self : this, function () {
    
    'use strict';
    
    const defaults={
        onClass: 'show-pw', // add this class when the button is ON mode
        offClass: 'hide-pw', // add this class when the button is OFF mode
        iconBtn: 'SPAN',
        iconWidth: '40px',
        iconRight: true, // position toggle icon to the right side, default: true         
        onOn: (btn) => {
            btn.innerHTML = 'Hide';
        }, // handler when the button is ON mode
        onOff: (btn) => {
            btn.innerHTML = 'Show';
        } // handler when the button is OFF mode
    };
    
    /*
     * Constructor
     * @param {selector} The selector element(s).
     * @param {type} options
     * @return {void}
     */
    function Plugin(selector,options) {
        this.options = Object.assign({}, defaults, options);
        this.selector = selector;
        if (this.selector) {
            this.init();
        } else {
            this.nodes = [];
        }
    }
   
     /*
      * Private method
      * ToggleHandler
      * @return {void}
      */
    const toggleHandler = (e) => {
        const btn = e.currentTarget;
        const o = btn.options;
        const nClass = btn.classList;
        if (nClass.contains(o.onClass)) {
            offMode(btn, o);
        }else{
            onMode(btn, o);
        }
    };
    
    /**
     * Make "ON" mode
     * @param node The button node
     * @param o Plugin options
     */
    const onMode = (btn, o) => {
        const pwInput = document.querySelectorAll(btn.inputSelector);
        pwInput.forEach(pw => {
            pw.setAttribute('type','text');
        });
        btn.classList.add(o.onClass);
        btn.classList.remove(o.offClass);
        o.onOn(btn);
    };

    /**
     * Make "OFF" mode
     * @param node The button node
     * @param o Plugin options
     */
    const offMode = (btn, o) => {
        const pwInput = document.querySelectorAll(btn.inputSelector);
        pwInput.forEach(pw => {
            pw.setAttribute('type','password');
        });
        btn.classList.add(o.offClass);
        btn.classList.remove(o.onClass);
        o.onOff(btn);
    };
    
    Plugin.prototype={
        /*
         * Initialize the plugin
         * @return {void}
         */
        init: function () {
            this.el = document.querySelectorAll(this.selector);
            const icon = document.createElement(this.options.iconBtn);
            icon.options = this.options;
            icon.inputSelector = this.selector;
            icon.style.position = "absolute";
            icon.style.zIndex = 5;
            if(this.options.iconRight){                
                icon.style.right = "0px";
            }
            icon.addEventListener('click', toggleHandler);
            
            this.triggerOff(icon);
            this.el.forEach(el => { 
                el.insertAdjacentElement('afterend', icon);
                if(this.options.iconRight){
                    el.style.paddingRight = this.options.iconWidth; 
                } else {
                    el.style.paddingLeft = this.options.iconWidth; 
                }
            });
        },
        /**
         * Trigger ON mode for element at specific position
         *
         * @param el Button element
         */
        triggerOn: function (btn) {
            onMode(btn, this.options);
        },

        /**
         * Trigger OFF mode for element at specific position
         *
         * @param el Button el
         */
        triggerOff: function (btn) {
            offMode(btn, this.options);
        }
    }; 
    //return the Plugin
    return Plugin;
}));