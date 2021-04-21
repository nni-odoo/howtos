/**
 * makes a red/green circle depending on if is_late in order is true or false
 */
odoo.define('awesome_tshirt.LateWidget', function (require) {
"use strict";

const FieldBoolean = require('web.basic_fields').FieldBoolean;
var core = require('web.core');
var registry = require('web.field_registry');

const LateWidget = FieldBoolean.extend({
    className: 'o_field_is_late dot',

    /**
     * @override
     */
    init: function() {
        this._super.apply(this, arguments);
        // colors for late & not
        this.isLate = 'red';
        this.notLate = 'green';
    },

    _render: function() {
        const color =  this.value ? this.isLate : this.notLate;
        this.$el.html($('<div>').addClass('dot').css({
            // backgroundColor: this.value? this.isLate : this.notLate,
            backgroundColor: color,
            height: '10px',
            width: '25px',
        }))
        // this.$el.html($('<span>').css({
        //     backgroundColor: this.value ? this.isLate : this.notLate
        // }));
    }
})

registry.add('late_widget', LateWidget);
return LateWidget;

});
