from odoo import models
from odoo.http import request

class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    # overriding session_info method
    def session_info(self):
        res = super(IrHttp, self).session_info()
        res['fab_msg'] = "BAFIEN IS WATCHING, WATCH OUT!"
        return res
