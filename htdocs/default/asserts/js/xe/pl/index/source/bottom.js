/**
 * Created by ng on 14-9-5.
 */

$Import('core.evt.custom');
$Import('common.channel.demo');


Xe.register('pl.index.source.bottom', function($) {
    var that = {};

    return function() {
        var cust1Func1 = function() {
            console.log('get cust1 and react as cust1Func1');
            $.core.dom.sizzle('#pl_bottom')[0].innerHTML = "自定义事件响应1";
        }

        var cust1Func2 = function() {
            console.log('get cust1 and react as cust1Func2');
            $.core.dom.sizzle('#pl_bottom')[0].style['font-size'] = '24px';
            $.core.dom.sizzle('#pl_bottom')[0].style['background-color'] = '#5ebc5f';
        }

        console.log('subscribed common.channel.demo red');
        $.common.channel.demo.subscribe('red', function(){
            console.log('boradcast event red caught by pl.index.source.bottom')
        });

        $.core.evt.custom.add(that, 'cust1', cust1Func1);
        $.core.evt.custom.add(that, 'cust1', cust1Func2);

        setTimeout(function(){
            $.core.evt.custom.fire(that, 'cust1');
        }, 5000);

    }
});