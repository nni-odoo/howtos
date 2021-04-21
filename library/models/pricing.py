from odoo import models, fields, api

class Pricing(models.Model):
    """
    Pricing Model:

    way to sort if partners need to pay anything
    """
    _name = 'library.pricing'
    _description = "Pricing Model"

    # fields
    name = fields.Char(string="Model Name")
    duration = fields.Float(string='Duration in Days')
    price = fields.Float(string="Price")
    price_type = fields.Selection([('time', 'Time Based'), ('one-off', "One-Off")], default="time")
