/**
 * Created by ng on 14-9-5.
 */

Xe.register('core.evt.custom', function($) {
    var that = {};
    var customKey = 'XeCustomEvent';

    return (function() {
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

        var add = function(obj, eventName, callback) {
            if (undefined == obj['XeCustomEvent']) {
                obj[customKey] = {};
            }
            if (obj[customKey][eventName] == undefined) {
                obj[customKey][eventName] = new Array();
            }
            obj[customKey][eventName].push(callback);
        }

        var hit = function(obj, eventName, data) {
            var timeout = 10; // Minimum timeout is 5m
            var handler = obj[customKey][eventName];
            for (var i in handler) {
                var callback = handler[i];
                setTimeout(callbackHandler(callback, data), timeout);
                timeout += 5;
            }
        }

        var fire = function(obj, eventName, data) {
            console.log('custom event fired event [' + eventName + ']');
            hit(obj, eventName, data);
        }

        that.add = add;
        that.fire = fire;

        return that;
    })();
});