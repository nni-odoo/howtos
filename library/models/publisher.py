from odoo import models, fields, api

class Publisher(models.Model):
    _name = 'library.publisher'
    _description = "Book Publisher"

    # fields
    name = fields.Char(string='Publisher')
