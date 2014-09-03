/**
 * Created by ng on 14-9-3.
 */

/*
 * 导入模块区域
 */
var mPath = require('path');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mUrl = require('url');
var mQuerystring = require('querystring');
var mFs = require('fs');

/*
 * 导入配置区域
 */
var server = mConfig.getConfig('server');
var vhosts = mConfig.getConfig('vhosts');
var mime = mConfig.getConfig('mime');

var notFoundResponse = function(response) {
    response.writeHead(404, {'Content-Type': mime.text});
    response.end('File not found\n');
}

var serverErrorResponse = function(response) {
    response.writeHead(500, {'Content-Type': mime.text});
    response.end('Server error\n');
}

var isHostNotExist = function(host, port) {
    if (host in vhosts && port == vhosts[host].port) {
        return false;
    }

    return true;
}

var jsHandler = function(request, response, path) {
    console.log(path);
    if (!mFs.existsSync(path)) {
        notFoundResponse(response);
        return;
    }

    mFs.readFile(path, 'binary', function(err, file) {
        var header = {
            'Content-Type': mime.js,
            'Connection': 'keep-alive',
            'Transfer-Encoding': 'chunked'
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

var cssHandler = function(request, response, path) {
    if (!mFs.existsSync(path)) {
        notFoundResponse(response);
        return;
    }

    var header = {
        'Content-Type': mime.css,
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked'
    };
    response.writeHead(200, header);

    var rs = mFs.createReadStream(path);
    rs.pipe(response);

    rs.on('end', function () {
        response.end();
    })
}

var etcHandler = function(request, response, path) {
    var header = {
        'Content-Type': mime.html,
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked'
    };

    // controller处理
    var tmpPath = path.split('/htdocs/');
    console.log(tmpPath);
    var host = tmpPath[1].split('/')[0];
    console.log(host);
    console.log(tmpPath[1]);
    var controllerName = tmpPath[1].replace(host + '/', '');
    var controllerFilePath = mPath.join(tmpPath[0], 'htdocs', host, 'controller', controllerName, 'index.js');
    console.log(controllerFilePath);
    if (mFs.existsSync(controllerFilePath)) {
        var index = require(controllerFilePath);
        index.run(request, response);
        return;
    }

    // 文件处理
    if (!mFs.existsSync(path)) {
        notFoundResponse(response);
        return;
    }
    response.writeHead(200, header);

    var rs = mFs.createReadStream(path);
    rs.pipe(response);

    rs.on('end', function () {
        response.end();
    })
}

var handlers = {
    'js': jsHandler,
    'css': cssHandler
};

var dispatch = function(request, response, path) {
    console.log(path);
    var ext = mPath.extname(path).replace('.', '');
    console.log(ext);

    if (ext in handlers) {
        handlers[ext](request, response, path);
        return;
    }

    etcHandler(request, response, path);
}

exports.run = function(request, response) {
    var req = mUrl.parse(request.url);
    var pathname = req.pathname;
    var host = request.headers.host;
    var port = 80;
    var hostInfo = host.split(':');

    // 判定主机是否存在
    if (hostInfo.length == 1) {
        host = hostInfo[0];
    }
    else if (hostInfo.length == 2) {
        host = hostInfo[0];
        port = hostInfo[1] * 1;
    }
    else {
        notFoundResponse(response);
        return;
    }

    if (isHostNotExist(host, port)) {
        notFoundResponse(response);
        return;
    }

    var dispathPath = mPath.join(server.serverPath, 'htdocs', vhosts[host].root, pathname);
    dispatch(request, response, dispathPath);
}
