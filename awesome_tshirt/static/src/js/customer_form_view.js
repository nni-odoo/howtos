odoo.define('awesome_tshirt.CustomerFormView', function (require) {
"use strict";

const core = require('web.core');
const FormController = require('web.FormController');
const FormView = require('web.FormView');
const registry = require('web.view_registry');
const qweb = core.qweb;

const CustomerFormController = FormController.extend({

    /**
     * @override
     * overriding render Buttons method so that another button is added for geo localization
     */
    renderButtons: function() {
        this._super.apply(this, arguments);
        this.$buttons.addClass('o_customer_form_view');
        this.$buttons.prepend(qweb.render('CustomerFormView.Buttons'));
    },

    /**
     * Adding geo localization
     */
    _geo_localize: function() {
        const resID = this.model.get(this.handle, {raw: true}).res_id;
        this._rpc({
            model: 'res.partner',
            method: 'geo_localize',
            args: [resID]
        }).then(() => this.reload())
    }


});

const CustomerFormView = FormView.extend({
    // adding the CustomerFormController into the configuration

    config: _.extend({}, FormView.prototype.config, {
        Controller: CustomerFormController,
    }),

});

// Add to View Registry
registry.add('customer_form_view', CustomerFormView);

});
