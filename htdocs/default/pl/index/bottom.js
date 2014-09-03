/**
 * Created by ng on 14-9-3.
 */

var mPath = require('path');
var mEvents = require('events');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mLoader = require(mPath.join(gLibPath, 'loader'));
var mime = mConfig.getConfig('mime');


exports.run = function(em) {
    em.on('render_pl', function(request, response, em) {
        var html = mLoader.loadView('default', 'index/pl/bottom.html');
        html = html.toString().replace('<\/html>', '').replace('<\/body>', '');
        console.log(html);
        if (response.write(html, 'utf-8')) {
            em.emit('pl_finished');
            console.log('pl_bottom_finished');
        }
    });
}