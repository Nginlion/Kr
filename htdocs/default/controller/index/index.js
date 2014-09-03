/**
 * Created by ng on 14-9-3.
 */

var mPath = require('path');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mLoader = require(mPath.join(gLibPath, 'loader'));
var mime = mConfig.getConfig('mime');

exports.run = function(request, response) {
    var header = {
        'Content-Type': mime.html,
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked'
    };

    response.writeHead(200, header);
    var html = mLoader.loadView('localhost', 'index/page/index.html');
    console.log(html);
    response.end(html);
}