/**
 * Created by ng on 14-9-4.
 */

Xe.register('core.evt.broadcast', function($) {
    var that = {};
    var broadcastHolder = {};

    return (function(pBroadcastHolder) {
        var broadcastHolder = pBroadcastHolder;

        var getHandler = function(channelName, eventName) {
            if (!(channelName in broadcastHolder)) {
                throw new Error('channel [' + channelName + '] not exist!');
            }
            if (!(eventName in broadcastHolder[channelName])) {
                throw new Error('channel [' + channelName + '] has no [' + eventName + '] event!');
            }
            return broadcastHolder[channelName][eventName];
        }

        var callbackHandler = function(callback, data) {
            return function() {
                if (data) {
                    callback.apply(data);
                }
                else {
                    callback();
                }
            }
        }

        var addChannel = function(channelName, eventNames) {
            if (channelName in broadcastHolder) {
                throw new Error('channel [' + channelName + '] already exist!');
            }
            broadcastHolder[channelName] = {};
            for (var i in eventNames) {
                var evt = eventNames[i];
                broadcastHolder[channelName][evt] = {
                    'callbacks': new Array()
                };
            }
            console.log('broadcastHolder');
            console.log(broadcastHolder);
        }

        var subscribe = function(channelName, eventName, callback) {
            var handler = getHandler(channelName, eventName);
            console.log(handler);
            console.log(callback);
            console.log(handler['callbacks']);
            if (!(callback in handler['callbacks'])) {
                handler['callbacks'].push(callback);
            }
        }

        var unsubscribe = function(channelName, eventName, callback) {
            var handler = getHandler(channelName, eventName);
            if (callback in handler['callbacks']) {
                console.log(handler);
                for (var index = 0; index < handler['callbacks'].length; ++index) {
                    if (callback === handler['callbacks'][index]) {
                        handler['callbacks'][index].splice(1);
                        break;
                    }
                }
                console.log(handler);
            }
        }

        var hit = function(channelName, eventName, data) {
            var handler = getHandler(channelName, eventName);
            var timeout = 10; // Minimum timeout is 5m
            for (var i in handler['callbacks']) {
                var callback = handler['callbacks'][i];
                setTimeout(callbackHandler(callback, data), timeout);
                timeout += 5;
            }
        }

        var fire = function(channelName, eventName, data) {
            var handler = getHandler(channelName, eventName);
            console.log('fired [' + channelName + '] event [' + eventName + ']');
            hit(channelName, eventName, data);
        }

        that.addChannel = addChannel;
        that.subscribe = subscribe;
        that.unsubscribe = unsubscribe;
        that.fire = fire;

        return that;
    })(broadcastHolder);
});