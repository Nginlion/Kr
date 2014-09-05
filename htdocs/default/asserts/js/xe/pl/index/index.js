/**
 * Created by ng on 14-9-5.
 */
$Import('pl.index.source.top');
$Import('pl.index.source.bottom');
$Import('pl.index.source.middle');
$Import('common.channel.demo');
$Import('core.evt.delegate');

Xe.register('pl.index.index', function($) {
    return function() {
        $.pl.index.source.middle();
        $.pl.index.source.top();
        $.pl.index.source.bottom();
    }
});