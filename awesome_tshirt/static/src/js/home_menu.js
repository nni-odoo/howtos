odoo.define('awesome_tshirt.HomeMenu', function (require) {
"use strict";

const core = require('web.core');
const HomeMenu = require('web_enterprise.HomeMenu');
const session = require('web.session');

const qweb = core.qweb;

HomeMenu.include({

    _render: function() {
        var msg = session.fab_msg
        this._super.apply(this, arguments);
        this.$('.o_custom_message').remove();  // rmeove custom message
        this.$el.prepend(qweb.render('HomeMenu.Message', {
            message: msg
        }))
    }
})

});
