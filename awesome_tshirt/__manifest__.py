# -*- coding: utf-8 -*-
{
    'name': "Awesome T-Shirt",
    'summary': "Manage your custom t-shirt printing business",
    'description': """
        This app helps you to manage a business of printing customized t-shirts
        for online customers. It offers a public page allowing customers to make
        t-shirt orders.
    """,
    'author': "Odoo",
    'category': 'Extra Tools',
    'version': '2.0',
    'application': True,
    'depends': ['base', 'web', 'base_geolocalize'],
    'data': [
        'security/ir.model.access.csv',
        'views/awesome_tshirt_views.xml',
        'views/templates.xml',
        'static/src/xml/assets.xml',
    ],
    'qweb': [
        'static/src/xml/awesome_dashboard.xml',
        'static/src/xml/counter.xml',
        'static/src/xml/warning_widget.xml',
        'static/src/xml/customer_form_view.xml',
        'static/src/xml/order_form_view.xml',
        'static/src/xml/quick_order_navigation.xml',
        'static/src/xml/home_menu.xml',
        'static/src/xml/order_kanban_view.xml',
    ],
    'license': 'AGPL-3'
}
