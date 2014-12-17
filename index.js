var serand = require('serand');
var navigation = require('navigation');

var sanbox;

var obj;

var menu = function (sandbox, fn) {
    $.ajax({
        url: '/apis/v/menus/0',
        headers: {
            'x-host': 'autos.serandives.com'
        },
        dataType: 'json',
        success: function (data) {
            obj = data;
            navigation(sandbox, fn, data);
        },
        error: function () {
            if (!fn) {
                return;
            }
            fn(true, function () {

            });
        }
    });
};

module.exports = function (sandbox, fn, options) {
    sanbox = sandbox;
    console.log(sandbox);
    if (obj) {
        navigation(sandbox, fn, obj);
        return;
    }
    menu(sandbox, fn);
};


serand.on('user', 'login', function (usr) {
    menu(sanbox, null);
});


serand.on('user', 'logout', function (usr) {
    menu(sanbox, null);
});

