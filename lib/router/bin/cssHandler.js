/**
 * Created by ng on 14-9-4.
 */

var mPath = require('path');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mUrl = require('url');
var mQuerystring = require('querystring');
var mFs = require('fs');

var server = mConfig.getConfig('server');
var vhosts = mConfig.getConfig('vhosts');
var mime = mConfig.getConfig('mime');

exports.handler = function(request, response, path) {
    if (!mFs.existsSync(path)) {
        notFoundResponse(response);
        return;
    }

    var header = {
        'Content-Type': mime.css
    };
    response.writeHead(200, header);

    var rs = mFs.createReadStream(path);
    rs.pipe(response);

    rs.on('end', function () {
        response.end();
    })
}