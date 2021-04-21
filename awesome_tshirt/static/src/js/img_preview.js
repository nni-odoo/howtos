/**
 * For some characters on field: image, should use the ImagePrview widget instead
 */
odoo.define('awesome_tshirt.ImagePreview', function (require) {
"use strict";

    const FieldChar = require('web.basic_fields').FieldChar;
    var core = require('web.core');
    var field_registry = require('web.field_registry')

    const _t = core._t

    const ImagePreview = FieldChar.extend({
        isSet: function() {
            return true
        },

        _renderReadonly: function () {
            if (this.value) {  // if have content
                this.$el.html($('<img>', {
                    class: 'o_image_preview',
                    src: this.value,
                    width: '200',
                    height: '200'
                }))
            } else {
                this.$el.text("MISSING TSHIRT DESIGN");
                this.$el.addClass('alert-danger');
            }
        }

    });
    field_registry.add('img_preview', ImagePreview);
    return ImagePreview;
});



