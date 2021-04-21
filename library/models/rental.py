"""
Rental Model

Gives a history of the rental of a certain book
"""

from odoo import models, fields, api

class Rental(models.Model):
    _name = 'library.rental'
    _description = 'History of Book Rentals'
    _rec_name = 'copy_id'

    # fields
    customer_id = fields.Many2one('res.partner', string='Customer')
    book_id = fields.Many2one('product.product', string='Book', domain=[('is_book', '=', True)])
    copy_id = fields.Many2one('library.copy', string="Book copy", required=True)

    rent_date = fields.Date(string='Rent Date', default=fields.Date.today())  # check out date
    return_date = fields.Date(string='Return Date')  # returned

    customer_address = fields.Text(related='customer_id.address')
    customer_email = fields.Char(related='customer_id.email')

    book_year = fields.Integer(related='book_id.year')
    book_authors = fields.Many2many(related='copy_id.author_ids')
    book_publishers = fields.Many2one(related='copy_id.publisher_id')

    is_late = fields.Boolean(_compute='_compute_is_late')
    state = fields.Selection([('draft', 'Draft'), ('rented', 'Rented'), ('returned', 'Returned'), ('lost', 'Lost')], default='draft')

    def _compute_is_late(self):
        """computing whether the book is returned late"""
        for rec in self:
            rec.is_late = rec.return_date < fields.Date.today() if rec.return_date else False  # if today goes past expected return date

    @api.onchange('return_date')
    def _change_return(self):
        self.is_late = self.return_date < fields.Date.today() if self.return_date else False

    # button presses
    def action_confirm(self):
        for rec in self:
            rec.state = 'rented'
            rec.add_fee('time')

    def action_return(self):
        for rec in self:
            rec.state = 'returned'

    def action_lost(self):
        for rec in self:
            rec.state = 'lost'
            rec.add_fee('loss')

    def add_fee(self, price_type):
        for rec in self:
            if price_type == 'time':
                price_id = self.env.ref('library.price_rent')
                delta_dates = fields.Date.from_string(rec.return_date) - fields.Date.from_string(rec.rent_date)
                amount = delta_dates.days * price_id.price / price_id.duration
            elif price_type == 'loss':
                price_id = self.env.ref('library.price_loss')
                amount = price_id.price
            else:
                return
        self.env['library.payment'].create({
            'customer_id': rec.customer_id.id,
            'date': rec.rent_date,
            'amount': amount
        })

class Payment(models.Model):
    """
    Payment receipt model
    """
    _name = 'library.payment'
    _description = 'Payment'

    date = fields.Date(required=True, default=fields.Date.context_today)
    amount = fields.Float()
    customer_id = fields.Many2one('res.partner', string='Customer')
