odoo.define('awesome_tshirt.WarningWidget', function (require) {
"use strict";

const core = require('web.core');
const registry = require('web.widget_registry');
const Widget = require('web.Widget');

const qweb = core.qweb;

const WarningWidget = Widget.extend({
    init: function(parent, record) {
        this._super.apply(this, arguments);
        this.record = record // store the record of the
    },

    start: function() {
        this._render();
        return this._super.apply(this, arguments);
    },

    _render: function() {
        this.$el.empty();
        // check if url contains the image url or not
        if (!this.record.data.image_url) {
            this.$el.append(qweb.render('WarningWidget.NoImage'));
        }
        if (this.record.data.amount > 100) {
            this.$el.append(qweb.render('WarningWidget.AddPromo'));
        }
    },

    updateState: function(record) {
        this.record = record;
        this._render();
    }

})

registry.add('warning_widget', WarningWidget);
return WarningWidget;

});
