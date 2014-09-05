/**
 * Created by ng on 14-9-5.
 */

$Import('core.dom.parser');

Xe.register('core.evt.delegate', function($) {
    var that = {};

    return function(node) {
        var nodeInfo = $.core.dom.parser(node);
        console.log(node);
        return that;
    };
});