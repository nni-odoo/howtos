# -*- coding: utf-8 -*-
{
    'name': "Library",

    'summary': """Library Management System""",

    'description': """
        Brussels' library management system. Holds the data for Customers, Books, Rental of books and etc.
    """,

    'author': "Odoo",
    'website': "http://www.odoo.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/13.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Library',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'product'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/book_views.xml',
        'views/rental_views.xml',
        'views/partner_views.xml',
        'views/pricing_views.xml',
        'wizard/select_book_views.xml',
        'views/menu_views.xml',
        'report/copy.xml',
        'demo/demo.xml'
    ],
    # only loaded in demonstration mode
    'demo': [],
    'license': 'AGPL-3',
}
