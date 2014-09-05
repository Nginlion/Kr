/**
 * Created by ng on 14-9-5.
 */
$Import('pl.index.source.bottom');
$Import('pl.index.source.middle');
$Import('common.channel.demo');

Xe.register('pl.index.index', function($) {
    return function() {
        $.pl.index.source.top();
        $.pl.index.source.bottom();
        $.pl.index.source.middle();
    }
});