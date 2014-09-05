/**
 * Created by ng on 14-9-5.
 */

$Import('common.channel.demo');

Xe.register('pl.index.source.top', function($) {
    return function() {
        console.log('subscribed common.channel.demo red');
        $.common.channel.demo.subscribe('red', function(){
            console.log('boradcast event red caught by pl.index.source.top')
        });
    }
});