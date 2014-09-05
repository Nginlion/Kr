/**
 * Created by ng on 14-9-4.
 */

$Import('core.evt.broadcast');

Xe.register('common.channel.handler', function($) {
    var that = {};

    return (function() {
        var add = function(channelName, supportedEvents) {
            $.core.evt.broadcast.addChannel(channelName, supportedEvents);
        }

        var fire = function(channelName, event) {
            $.core.evt.broadcast.fire(channelName, event);
        }

        var subscribe = function(channelName, event, callback) {
            $.core.evt.broadcast.subscribe(channelName, event, callback);
        }

        var unsubscribe = function(channelName, event, callback) {
            $.core.evt.broadcast.unsubscribe(channelName, event, callback);
        }

        that.add = add;
        that.fire = fire;
        that.subscribe = subscribe;
        that.unsubscribe = unsubscribe;

        return that;
    })();
});