odoo.define('awesome_tshirt.order_kanban_view', function (require) {
"use strict";

const core = require('web.core');
const KanbanController = require('web.KanbanController');
const KanbanView = require('web.KanbanView');
const view_reg = require('web.view_registry');

const _lt = core._lt;
const _t = core._t;

const qweb = core.qweb;

// extension of KanbanController
const OrderKanbanController = KanbanController.extend({
    events: _.extend({}, KanbanController.prototype.events, {
        // ... additional events here
        'click .o_customer': '_onCustomerClicked',
        'input .o_customer_search': '_onCustomerSearchInput',
    }),

    /**
     * load customers first and prepare the data
     * @override
     */
    willStart: function() {
        // return Promise.all([
        //     this._super.apply(this, arguments),
        //     this._loadCustomers()
        // ])
        this._super.apply(this, arguments);
        return this._loadCustomers()
    },

    /**
     * @override
     */
    start: function() {
        this.$el.addClass('o_order_kanban_view');
        this.$('.o_content').prepend(qweb.render('OrderKanban.Sidebar', {
            activeCustomerID: this.activeCustomerID,
            customers: this.customers,
        }));
        return this._super.apply(this, arguments);
    },



    /**
     * @override
     */
    init: function() {
        this._super.apply(this, arguments);
        this.activeCustomerID = false;  // store current customers' active or not
        this.customers = [];
    },

    /**
     * @override
     */
    reload: function(params) {
        if (this.activeCustomerID) {
            params = params || {};
            params.domain = params.domain || [];
            params.domain.push(['customer', '=', this.activeCustomerID]);
        }

        return Promise.all([
            this._super(params),
            this._loadCustomers()
        ])
    },


    /**
     * Loading all customers
     */
    _loadCustomers: function() {
        return this._rpc({
            route: '/web/dataset/search_read',
            model: 'res.partner',
            fields: ['display_name'],
            domain: [['has_active_order', '=', true]],
        }).then( (res) => {
            this.customers = res.records; // load all customers
        })
    },

    /**
     * updated list while the search is updated
     */
    _update: function() {
        return this._super.apply(this, arguments).then( () => this._updateCustomerList());
    },

    /**
     * for every click, filter out
     */
    _updateCustomerList: function() {
        var searchVal = this.$('.o_customer_search').val();
        var match = fuzzy.filter(searchVal, _.pluck(this.customers, 'display_name'));
        var indexes = _.pluck(match, 'index');
        var customers = _.map(indexes, (index) => this.customers[index]);

        // load with customer list
        this.$('.o_customer_list').replaceWith(qweb.render('OrderKanban.CustomerList', {
            activeCustomerID: this.activeCustomerID,
            customers: customers
        }));

    },

    _onCustomerSearchInput: function() {
        this._updateCustomerList();
    },

    /**
     * when a particular kanban view is clicked
     * @param {MouseEvent} ev
     */
    _onCustomerClicked: function (ev) {
        this.activeCustomerID = $(ev.currentTarget).data('id');
        this.reload();
    },
})

var OrderKanbanView = KanbanView.extend({
    config: _.extend({}, KanbanView.prototype.config, {
        Controller: OrderKanbanController,
    }),
})

view_reg.add('order_kanban_view', OrderKanbanView);

});
