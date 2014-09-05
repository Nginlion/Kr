/**
 * Created by ng on 14-9-4.
 */


$Import('core.lib.sizzle');

Xe.register('core.dom.sizzle', function($) {
    return function() {
        var selector = arguments[0];
        var html = arguments[1];

        if (html) {
            return Sizzle(selector, html);
        }

        return Sizzle(selector);
    };
});