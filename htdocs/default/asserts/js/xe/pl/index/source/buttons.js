/**
 * Created by ng on 14-9-5.
 */

$Import('core.evt.custom');
$Import('common.channel.demo');


Xe.register('pl.index.source.buttons', function($) {
    var that = {};

    return function(node) {
        var cnt = 0;
        var color = {
            0: '#AABBCC',
            1: '#11BBCC'
        }
        console.log('at pl.buttons');
        console.log('node => ' + node);
        var dEvt = $.core.evt.delegate(node);
        console.log(dEvt);
        dEvt.add('btn1', 'click', function(ev){
            ++cnt;
            ev.target.style['background-color'] = color[cnt % 2];
            console.log('clicked btn1');
        })
    }
});