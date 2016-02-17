
function setupValidation() {
    // set the Spanish localization for the common error messages
    $.tools.validator.localize("es", {
        '*': 'Por favor, revisar este campo',
        ':email': 'Esta dirección de email no es correcta',
        ':number': 'Este campo sólo acepta números',
        ':url': 'Esta dirección web (link) no es correcta',
        '[max]': 'La cantidad máxima para esta campo es $1',
        '[min]': 'La cantidad mínima para esta campo es $1',
        '[required]': 'Por favor, completar este campo'
    });

    // add custom validator for minimumlength attribute
    $.tools.validator.fn("[minimumlength]", function (input, value) {
        var min = input.attr("minimumlength");
        var isRequired = input.attr("required");
        // the validation should only fail when the field is required or when it's optional and the user entered some text
        if (isRequired !== undefined || value.length > 0) {
            return value.length >= min ? true :
            {
                en: "Please provide at least " + min + " character" + (min > 1 ? "s" : ""),
                es: "Proveea al menos " + min + " caracter" + (min > 1 ? "es" : "")
            };
        }
        return true;
    });

    // add custom validator for data-equals attribute (password checker)
    $.tools.validator.fn("[data-equals]", {
            en: "Value not equal with the $1 field",
            es: "El valor tiene que ser igual al del campo $1"
        }, function (input) {

            var name = input.attr('data-equals'),
                field = this.getInputs('password').filter("[name=" + name + "]");
            return input.val() === field.val() ? true : [name];
    });

    // add custom validator for signature pad fields
    $.tools.validator.fn("div.field.sigPad input", function (input, value) {
        var isRequired = input.parent().hasClass("required");
        if (isRequired) {
            return value.length > 0 ? true :
            {
                en: "Please sign the document",
                es: "Por favor firme el documento"
            };
        }
        return true;
    });

}
