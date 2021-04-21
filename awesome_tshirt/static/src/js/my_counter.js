odoo.define('MyCounter', function (require) {
"use strict";

 /**
 * Widget Definition
 */
const core = require('web.core');
const qweb = core.qweb;

/**
 * Define widget
 */
var Widget = require('web.Widget');
var Counter = Widget.extend({
    template: 'MyCounter',
    events: {
        'click .o_increment': '_clickIncrement',
    },
    init: function (parent, value) {
        this._super(this, arguments);
        this.value = value ? value : 1 // initialize to 0 if any
    },

    _clickIncrement: function() {
        this.value = this.value + 1;
        this.$('.val').text(this.value);
    },


    });

    return Counter;
});
