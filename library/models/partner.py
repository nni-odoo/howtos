from odoo import models, fields, api

class Partner(models.Model):
    # _name = 'library.partner'
    # _description = 'Library Partners'
    _inherit = 'res.partner'  # inheritance based

    # fields
    # name = fields.Char()
    address = fields.Text()
    # email = fields.Char()
    # type_partner = fields.Selection([('customer', 'Customer'), ('author', 'Author')], default='customer', string="Role")  # partner is either a customer or author, default is a customer

    is_author = fields.Boolean(string="Is author", default=False)
    is_publisher = fields.Boolean(string="Is publisher", default=False)

    # by default customer != (author || publisher)

    # rental_ids = fields.One2many('library.rental', 'customer_id')  # history of rentals for this customer
    # rental_ids = fields.One2many('library.rental', 'customer_id', string='rentals')
    # split rental to current, old and lost
    current_rental_ids = fields.One2many('library.rental', 'customer_id', string='Current Rentals', domain=[('state', '=', 'rented')])
    old_rental_ids = fields.One2many('library.rental', 'customer_id', string='Previous Rentals', domain=[('state', '=', 'returned')])
    lost_rental_ids = fields.One2many('library.rental', 'customer_id', stirng='Lost books', domain=[('state', '=', 'lost')])

    lost_book_qty = fields.Integer(string='Number of Lost book copies', compute='_get_lost_qty', default=0)
    payment_ids = fields.One2many('library.payment', 'customer_id', string='Payments')
    amount_owed = fields.Float(compute="_amount_owed", store=True)

    @api.depends('lost_rental_ids')
    def _get_lost_qty(self):
        for rec in self:
            rec.lost_book_qty = len(rec.lost_rental_ids)

    @api.depends('payment_ids.amount')
    def _amount_owed(self):
        for rec in self:
            rec.amount_owed = sum(rec.payment_ids.mapped('amount'))
