/**
 * Adding Print Label. calling method print_label from the order model
 * should be disabled if current order is in 'create' mode
 *
 */
odoo.define('awesome_tshirt.OrderFormView', function (require) {
"use strict";


const core = require('web.core');
const FormController = require('web.FormController');
const FormView = require('web.FormView');
const registry = require('web.view_registry');
const qweb = core.qweb;
const _t = core._t;

const OrderFormController = FormController.extend({
    events: {
        'click .o_print_label': '_printLabel'
    },

    init: function() {
        this._super.apply(this, arguments);
        this.printed = false; // to keep track of whether printed has been clicked
    },


    /**
     * @override
     * adding button into the $buttons
     */
    renderButtons: function() {
        this._super.apply(this, arguments);
        this.$buttons.addClass("o_order_form_buttons");
        this.$buttons.prepend(qweb.render('OrderFormView.Buttons'));
    },

    _updateButtons: function() {
        this._super.apply(this, arguments);
        if (this.$buttons) { // check if buttons exist
            const state = this.model.get(this.handle, {raw:true});
            const disable = this.mode == 'edit' && !state.res_id // condition for disabling button
            const primary = state.data.customer_id && state.data.state == 'printed'

            this.$buttons.find('.o_print_label') // decide the button's format
                .toggleClass('btn-primary', primary)
                .toggleClass('btn-secondary', !primary)
                .attr('disabled', !!disable);
        }
    },

    /**
     * onClick method for PrintLabel button
     */
    _printLabel: function() {
        console.log('PRINT LABEL');
        if (this.printed)
            return;  // abort if already printed
        this.printed = true;
        const resID = this.model.get(this.handle, {raw: true}).res_id;
        this._rpc({
            model: 'awesome_tshirt.order',
            method: 'print_label',
            args: [resID],
        }).then((ret) => {
            this.printed = false; // no longer printing
            if (ret) {
                this.do_notify(_t('Success'), _t('The label has been printed'));
            } else {
                this.do_warn(_t('Failure'), _t('The label fails to be printed'), {sticky: true})
            }
            this.reload();
        }).guardedCatch(() => {
            this.printed = false;
            this.do_warn(_t('Error'), _t('Unexpected error occured'), {sticky: true});
        })
    }
});

const OrderFormView = FormView.extend({
    config: _.extend({}, FormView.prototype.config, {
        Controller: OrderFormController
    })
})

registry.add('order_form_view', OrderFormView);

});
