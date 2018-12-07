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

module.exports = function (ctx, container, options, done) {
    var sandbox = container.sandbox;
    options = options || {};
    context = {
        ctx: ctx,
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
        navigation(ctx, container, filter(options, null, links), done);
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
        navigation(context.ctx, context.sandbox, filter(context.options, user, links), context.done);
    });
});
