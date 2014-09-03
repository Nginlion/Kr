/**
 * Created by ng on 14-9-3.
 */

var mPath = require('path');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mLoader = require(mPath.join(gLibPath, 'loader'));
var mime = mConfig.getConfig('mime');

var fakeTask = function(html, response, em) {
    return function() {
        if (response.write(html, 'utf-8')) {
            console.log('pl_top_finished');
        }
        em.emit('pl_finished');
    }
}

exports.run = function(em) {
    em.on('render_pl', function(request, response, em) {
        var html = mLoader.loadView('default', 'index/pl/top.html');
        html = html.toString().replace('<\/html>', '').replace('<\/body>', '');
        console.log(html);

        setTimeout(fakeTask(html, response, em), 2000);
    });
}