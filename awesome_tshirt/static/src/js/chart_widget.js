odoo.define('awesome_tshirt.ChartWidget', function (require) {
"use strict";

const core = require('web.core');
const qweb = core.qweb
// Widget definition for CHart
const Widget = require('web.Widget');


const ChartWidget = Widget.extend({
    tagName: 'canvas',

    jsLibs: ['/awesome_tshirt/static/lib/chart.js/Chart.js'], // lazy asset loading

    init: function(parent, orderSizeMap) {
        this._super.apply(this, arguments);
        this.orderSizeMap = orderSizeMap; // store in state
        this.sizes = ['s', 'm' ,'l', 'xl', 'xxl'];
    },

    start: function() { // call for render
        console.log("CHART WIDGET HERE")
        this._renderChart();
        return this._super.apply(this, arguments);
    },

    _renderChart: function() {
        new Chart(
            this.el, // load into this element
            { // Chart Config
                type: 'pie',
                data: {
                    labels: this.sizes,
                    datasets: [{
                        label: 'Size',
                        // data: this.sizes.map(x => this.orderSizeMap[x]),
                        data: _.map(this.sizes, (x) => this.orderSizeMap[x] || 0),
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 1,
                    }],
                },
                options: {
                    // put onClick here
                    onClick: this._clickSize.bind(this)
                }
            }
        )
    },

    _clickSize: function(e, chartElements) {
        // after click on each part of the chart
        console.log(e);
        console.log(chartElements);

        if (chartElements && chartElements.length >=1 ) { // if exist
            this.trigger_up('open_orders', {
                size: this.sizes[chartElements[0]._index]
            }); // send size to upper client action
        }
    }
})
    return ChartWidget;
});
