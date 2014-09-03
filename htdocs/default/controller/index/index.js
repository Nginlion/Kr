/**
 * Created by ng on 14-9-3.
 */

var mPath = require('path');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mLoader = require(mPath.join(gLibPath, 'loader'));
var mime = mConfig.getConfig('mime');

exports.run = function(request, response) {
    var normal = false;

    if (normal) {
        var header = {
            'Content-Type': mime.html,
            'Connection': 'keep-alive',
            'Transfer-Encoding': 'chunked'
        };

        response.writeHead(200, header);
        var html = mLoader.loadView('default', 'index/page/index.html');
        response.end(html);
    }
    else {
        var page = mLoader.load('default', 'page/index');
        console.log(page);
        page.run(request, response);
    }
}