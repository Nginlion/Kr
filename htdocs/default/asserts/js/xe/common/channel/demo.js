/**
 * Created by ng on 14-9-4.
 */

$Import('common.channel.handler');

Xe.register('common.channel.demo', function($) {
    var channelName = 'demo';
    var supportedEvents = ['red', 'blue'];
    var that = {};

    return (function(pChannelName, pSupportedEvents) {
        var channelName = pChannelName;
        var supportedEvents = pSupportedEvents;

        $.common.channel.handler.add(channelName, supportedEvents);

        var fire = function(event) {
            console.log(channelName);
            console.log(event);
            $.common.channel.handler.fire(channelName, event);
        }

        var subscribe = function(event, callback) {
            console.log('subscribe');
            console.log(channelName);
            console.log(event);
            console.log(callback);
            $.common.channel.handler.subscribe(channelName, event, callback);
        }

        var unsubscribe = function(event, callback) {
            $.common.channel.handler.unsubscribe(channelName, event, callback);
        }

        that.fire = fire;
        that.subscribe = subscribe;
        that.unsubscribe = unsubscribe;

        return that;
    })(channelName, supportedEvents);
});