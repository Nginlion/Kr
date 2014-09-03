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
    console.log(path);
    if (!mFs.existsSync(path)) {
        notFoundResponse(response);
        return;
    }

    mFs.readFile(path, 'binary', function(err, file) {
        var header = {
            'Content-Type': mime.js
        };

        if (err) {
            console.log('fail');
            serverErrorResponse(response);
        }
        else {
            console.log('succ');
            response.writeHead(200, header);
            response.write(file, 'binary');
            response.end();
        }
    });
}