/**
 * Created by ng on 14-9-5.
 */

$Import('common.channel.demo');

Xe.register('pl.index.source.middle', function($) {
    return function() {
        console.log('subscribed common.channel.demo red');
        $.common.channel.demo.subscribe('red', function(){
            var d = new Date();
            console.log('start time:' + d.toLocaleTimeString());
            var cnt  = 0;
            var foo = null;
            for (var i = 0; i < 10000; ++i) {
                for (var j = 0; j < 1000; ++j) {
                    ++cnt;
                    foo = new Date();
                }
            }
            d = new Date();
            console.log('end time:' + d.toLocaleTimeString());
            console.log('boradcast event red caught by pl.index.source.middle')
        });
    }
});