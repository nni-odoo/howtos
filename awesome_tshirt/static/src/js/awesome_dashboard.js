// console.log("Hello");

odoo.define('awesome_tshirt.dashboard', function (require) {
"use strict";

    /**
     * Dashboard client action for awesome t-shirts.
     */

const AbstractAction = require('web.AbstractAction');
const core = require('web.core');

const qweb=core.qweb;
const fieldUtils = require('web.field_utils');
const _t = core._t
const MyCounter = require('MyCounter');
const ChartWidget = require('awesome_tshirt.ChartWidget');
// lifecycle: init() -> willStart() -> rendering -> start() -> destroy()

const Dashboard = AbstractAction.extend({
    hasControlPanel: true,
    loadControlPanel: true,
    tagName: 'canvas',
    template: 'AwesomeDashboard', // should have the same name as template .xml file

    events: { // register events
        'click .press': '_clickPressButton',
        'click .o_customer_button': '_clickCustomerButton',
        'click .o_orders_button': '_clickOrderButton',
        'click .o_cancel_button': '_clickCancelButton',
    },

    custom_events: {
        open_orders: '_onOpenOrder'
    },

    init: function (parent) { // initialization
        this._super.apply(this, arguments); // has to be this format
        // this._super(this, arguments);
    },

    willStart: function() { // load statistics before rendering anything
        return this._rpc({
            route: '/awesome_tshirt/statistics',
        }).then((stats) => { // get result of running on that route
            // replace format
            stats.average_time = fieldUtils.format.float_time(stats.average_time);
            this.stats = stats;  // store as a state
        });
    },

    _load_stats: function() {
         return this._rpc({
            route: '/awesome_tshirt/statistics',
        }).then((stats) => { // get result of running on that route
            // replace format
            stats.average_time = fieldUtils.format.float_time(stats.average_time);
            this.stats = stats;  // store as a state
        });
    },

    start: function () { // part of widget lifecycle
        console.log(this.stats);
        this._render().then(() => {
            this.$('.insert_counter').append(qweb.render('AwesomeDashboard.Buttons'))
        })
    },

    on_attach_callback: function() {
        this._reloadInterval = setInterval(this._reload.bind(this), 30000);
    },

    on_detach_callback: function() {
        clearInterval(this._reloadInterval);
    },

    _render : async function () {
        this.$('o.content').html(qweb.render('AwesomeDashboard', {widget: this}));
        /**
         * Testing for Counters
         */
        // var counter = new MyCounter(this, 1); // teting for my counter
        // counter.appendTo(this.$('.insert_counter'));
        var chart = new ChartWidget(this, this.stats.orders_by_size)
        chart.insertAfter(this.$('.insert_counter'));
    },

    _reload: function () {
        return this._load_stats().then(() => this._render()); // reload statistics and re render
    },

    _clickPressButton: function(){
        console.log("HELLO");
    },


    _getLastWeek: function() {
        return moment().subtract(7, 'd').format('YYYY-MM-DD HH:mm:ss');
    },
    /**
     * Button Clicks
     */
    _clickCustomerButton: function() {
        console.log('Customers');
        this.do_action('base.action_partner_customer_form');
    },

    _clickOrderButton: function() {
        console.log('New orders');
        this.do_action({
            res_model: 'awesome_tshirt.order',
            name: _t('Created Orders'), // _t for translation lookup
            views: [[false, 'list'], [false, 'form']],
            type: 'ir.actions.act_window',
            domain: [['create_date', '>=', this._getLastWeek()]]
        })
    },

    /**
     *
     * @param {*} ev: odoo event, data store in ev.data
     */
    _onOpenOrder: function (ev) {
        console.log("onOpenOrder");
        const size = ev.data.size;
        this.do_action({
            res_model: 'awesome_tshirt.order',
            name: "Order size " + size.toUpperCase(),
            views: [[false, 'list'], [false, 'form']],
            type: 'ir.actions.act_window',
            domain: [['size', '=', size]]
        })
    },

    _clickCancelButton: function() {
        console.log('Cancelled Order');
        this.do_action({
            res_model: 'awesome_tshirt.order',
            name: _t('Cancel Button'), // to help with translation
            views: [[false, 'list'], [false, 'form']],
            type: 'ir.actions.act_window',
            domain: [['create_date', '>=', this._getLastWeek()], ['state', '=', 'cancelled']],
            target: '_new'
        })
    },

})

    core.action_registry.add('awesome_tshirt.dashboard', Dashboard);
    return Dashboard;
});

