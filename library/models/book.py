# -*- coding: utf-8 -*-

from odoo import models, fields, api

class Book(models.Model):
    # _name = 'library.book'
    # _description = 'Book'
    _inherit = 'product.product'

    # fields
    # name = fields.Char(string='Title')
    author_ids = fields.Many2many('res.partner', string="Authors")  # one book can have multiple authors and one author can write multiple books
    year = fields.Integer(string='Year Published')
    isbn = fields.Char(string='ISBN', unique=True)
    publisher_id = fields.Many2one('res.partner', string="Publisher")  # one publisher can manage multiple books

    # rental_ids = fields.One2many('library.rental', 'book_id')  # records of rentals for this particular book
    copies = fields.One2many('library.copy', 'book_id', string="Book Copies")  # get all copies of the same book id
    is_book = fields.Boolean(string="Is a Book", default=False)  # check if product is book


class BookCopy(models.Model):
    _name = 'library.copy'
    _description = 'Copies of book'
    _rec_name = 'reference'

    # book_id = fields.Many2one('library.book', ondelete="cascade", delegate=True, required=True)  # contains info about the book
    book_id = fields.Many2one('product.product', ondelete='cascade', required=True, domain=[('is_book', '=', True)], delegate=True)
    reference = fields.Char(required=True)  # unique reference for each copy
    # rental_ids = fields.One2many('library.rental', 'copy_id', 'book_id')  # rental history
    rental_ids = fields.One2many('library.rental', 'copy_id', string='Rentals')
    book_state = fields.Selection([('available', 'Available'), ('rented', 'Rented'), ('lost', 'Lost')], default='available')  # states of book
    readers_count = fields.Integer(compute="_compute_readers_count")

    def open_readers(self):
        self.ensure_one()
        reader_ids = self.rental_ids.mapped('customer_id')
        return {
            'name': 'Readers of %s' % self.name,
            'type': 'ir.actions.act_window',
            'res_model': 'res.partner',
            'view_mode': 'tree,form',
            'view_type': 'form',
            'domain': [('id', 'in', reader_ids.ids)],
            'target': 'new'
        }

    @api.depends('rental_ids.customer_id')
    def _compute_readers_count(self):
        for book in self:
            book.readers_count = len(book.mapped('rental_ids'))
