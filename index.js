var serand = require('serand');
var navigation = require('navigation');

var sanbox;

var obj;

var menu = function (fn) {
    $.ajax({
        url: '/apis/v/menus/0',
        headers: {
            'x-host': 'autos.serandives.com'
        },
        dataType: 'json',
        success: function (data) {
            obj = data;
            navigation(sanbox, function (err, f) {
                if (!fn) {
                    return;
                }
                fn(err, function () {
                    sanbox = null;
                    f();
                });
            }, data);
        },
        error: function () {
            if (!fn) {
                return;
            }
            fn(true, function () {
                sanbox = null;
            });
        }
    });
};

module.exports = function (sandbox, fn, options) {
    sanbox = sandbox;
    if (obj) {
        navigation(sandbox, fn, obj);
        return;
    }
    menu(fn);
};


serand.on('user', 'logged in', function (usr) {
    menu(null);
});


serand.on('user', 'logged out', function (usr) {
    menu(null);
});
