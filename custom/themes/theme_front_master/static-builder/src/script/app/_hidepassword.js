//
// HideShowPassword
// https://github.com/cloudfour/hideShowPassword
//
var fn_hidePassword = function () {

    $('input[type="password"]').hidePassword(true, {
        toggle: {
            element: '<button type="button">',
            className: 'hideShowPassword-toggle btn'
        },

        // Options specific to the 'shown' or 'hidden'
        // states of the input element.
        states: {
            shown: {
                toggle: {
                    content: 'Masquer le mot de passe',
                    attr: {
                        title: 'Masquer le mot de passe'
                    }
                }
            },
            hidden: {
                toggle: {
                    content: 'Afficher le mot de passe',
                    attr: {
                        title: 'Afficher le mot de passe'
                    }
                }
            }
        }
    });

};