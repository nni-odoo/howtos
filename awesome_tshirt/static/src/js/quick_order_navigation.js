odoo.define('awesome_tshirt.QuickOrderNavigation', function (require) {
"use strict";

const core = require('web.core');
const SysTrayMenu = require('web.SystrayMenu');
const Widget = require('web.Widget');
const qweb = core.qweb;

const QuickOrderNav = Widget.extend({
    template: 'QuickOrderNavigation',
    sequence: 50,
    events: {
        'keydown .o_input': '_inputFilled' // register event
    },

    // Event Handling

    /**
     *
     * @param {KeyboardEvent} ev: every click on keyboard on the menu triggers this
     */
    _inputFilled: function(ev) {
        // once press enter take id and open new action with specific order
        if (ev.which === $.ui.keyCode.ENTER) {
            var typed_id = parseInt(this.$('.o_input').val(), 10);
            if ( !_.isNaN(typed_id)){
                this.do_action({
                    res_model: 'awesome_tshirt.order',
                    target: 'new',
                    type: 'ir.actions.act_window',
                    views: [[false, 'form']],
                    res_id: typed_id,
                })
            }

        }
    }

});

SysTrayMenu.Items.push(QuickOrderNav);
return QuickOrderNav;
});
