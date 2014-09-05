/**
 * Created by ng on 14-9-5.
 */

$Import('core.dom.parser');

Xe.register('core.evt.delegate', function($) {
    var that = {};

    return function(node) {
        var nodeObj = $.core.dom.sizzle('#' + node)[0];
        console.log(nodeObj);
        var nodeInfo = $.core.dom.parser(node);
        var eventHolder = {};
        console.log('delegate');
        console.log(node);

        var commonEventHandler = function(ev) {
            ev.stopImmediatePropagation();
            console.log(ev);
            var eventType = ev.type;
            var actionType = ev.target.getAttribute('action-type');
            if (undefined != eventHolder[actionType] && undefined != eventHolder[actionType][eventType]) {
                var callbacks = eventHolder[actionType][eventType];
                for (var i in callbacks) {
                    var callback = callbacks[i];
                    callback();
                }
            }
        }

        var add = function(actionType, event, callback) {
            console.log('EVT ===> ' + event);

            if (undefined == eventHolder[actionType]) {
                eventHolder[actionType] = {};
            }
            if (undefined == eventHolder[actionType][event]) {
                eventHolder[actionType][event] = new Array();
            }
            console.log(eventHolder);
            eventHolder[actionType][event].push(callback);
            //Chrome
            nodeObj.addEventListener(event, commonEventHandler);
        }

        that.add = add;

        return that;
    };
});