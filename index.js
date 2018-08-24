var serand = require('serand');
var navigation = require('navigation');
var utils = require('utils');

var context;

var ready = false;

var render = function (done) {
    $.ajax({
        url: utils.resolve('accounts:///apis/v/menus/2'),
        dataType: 'json',
        success: function (links) {
            done(null, links);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

var filter = function (options, user, links) {
    if (user) {
        return links;
    }
    links.signin = {url: '/signin', title: 'Sign in'};
    links.signup = {url: '/signup', title: 'Sign up'};
    return links;
};

module.exports = function (sandbox, options, done) {
    options = options || {};
    context = {
        sandbox: sandbox,
        options: options,
        done: done
    };
    if (!ready) {
        return;
    }
    render(function(err, links) {
        if (err) {
            return done(err);
        }
        navigation(sandbox, filter(options, null, links), done);
    });
};

serand.on('user', 'ready', function (user) {
    ready = true;
    if (!context) {
        return;
    }
    render(function(err, links) {
        if (err) {
            return done(err);
        }
        navigation(context.sandbox, filter(context.options, user, links), context.done);
    });
});

/*serand.on('user', 'logged in', function () {
 console.log('----------------------------2');
 render(function(err, links) {
 serand.emit('navigation', 'render', links);
 });
 });

 serand.on('user', 'logged out', function () {
 console.log('----------------------------3');
 render(function(err, links) {
 serand.emit('navigation', 'render', links);
 });
 });*/
