/**
 * Created by ng on 14-9-5.
 */

$Import('core.evt.custom');
$Import('common.channel.demo');


Xe.register('pl.index.source.buttons', function($) {
    var that = {};

    return function(node) {
        console.log('at pl.buttons');
        console.log('node => ' + node);
        var dEvt = $.core.evt.delegate(node);
        console.log(dEvt);
        dEvt.add('btn1', 'click', function(){
            console.log('clicked btn1');
        })
    }
});