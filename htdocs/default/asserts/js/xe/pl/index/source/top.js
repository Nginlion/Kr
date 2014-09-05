/**
 * Created by ng on 14-9-5.
 */

$Import('common.channel.demo');

Xe.register('pl.index.source.top', function($) {
    return function() {
        console.log('subscribed common.channel.demo red');
        $.common.channel.demo.subscribe('red', function(){
            $.core.dom.sizzle('#pl_top')[0].style['font-size'] = '36px';
            $.core.dom.sizzle('#pl_top')[0].style['background-color'] = '#e0af28';
            $.core.dom.sizzle('#pl_top')[0].innerHTML = "广播";
            console.log('boradcast event red caught by pl.index.source.top')
        });
    }
});