/**
 * Created by ng on 14-9-4.
 */

var mPath = require('path');
var mEvents = require('events');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mUrl = require('url');
var mQuerystring = require('querystring');
var mFs = require('fs');
var mUglifyJs = require('uglify-js2');

var server = mConfig.getConfig('server');
var vhosts = mConfig.getConfig('vhosts');
var mime = mConfig.getConfig('mime');

var jsContent = {};
var importRegExp = /\$Import\([\'\"][a-zA-Z0-9\.]+[\'\"]\)[\;\,]/g;

var serverErrorResponse = function(response) {
    response.writeHead(500, {'Content-Type': mime.text});
    response.end('Server error\n');
}

var importJs = function(response, em) {
    em.on('import_js', function(basePath, modulePath, path) {
        mFs.readFile(path, 'utf8', function(err, file) {
            if (err) {
                console.log('importJs fail at ' + path + ' err => ' + err.toString());
                serverErrorResponse(response);
            }
            else {
                // Compress code
                file = file.toString();
                file = mUglifyJs.minify(file, {fromString: true});
                file = file.code;
                // check $Import
                console.log('path=' + path);
                var basePathArr = path.split(/\/xe\//);
                console.log(basePathArr);
                // Do not use $Import when it is not Xe module
                if (basePathArr.length > 1) {
                    var thisModuleName = basePathArr[1].replace(/\.js$/, '').replace(/\//g, '.');
                    console.log('importJs thisModuleName=' + thisModuleName);
                    var basePath = basePathArr[0];
                    var importStatements = file.match(importRegExp);
                    console.log('importStatements');
                    console.log(importStatements);

                    if (importStatements) {
                        for (var i in importStatements) {
                            var moduleName = importStatements[i].split(/\([\'\"]/)[1].split(/[\'\"]\)/)[0];
                            var modulePath = moduleName.replace(/\./g, '/');
                            console.log(modulePath);
                            ++response.jsCount;
                            var emitPath = mPath.join(basePath, 'xe', (modulePath + '.js'));
                            console.log('moduleName in jsContent');
                            console.log(moduleName in jsContent);
                            if (!(moduleName in jsContent))
                            {
                                em.emit('import_js', basePath, emitPath, emitPath);
                            }
                        }
                    }

                    console.log(response.jsCount);
                    file = file.replace(importRegExp, ';');
                    em.emit('import_js_succ', thisModuleName, file);
                    console.log(file)
                }
            }
        });
    });
}

var combineJs = function(response, em) {
    var header = {
        'Content-Type': mime.js
    };

    em.on('import_js_succ', function(name, content) {
        --response.jsCount;
        console.log('combineJs jsCount=' + response.jsCount);
        console.log('combineJs name=' + name);
        if (name != 'xe') {
            name = 'xe.' + name;
        }
        jsContent[name] = content;
        console.log(jsContent);

        if (0 == response.jsCount) {
            em.removeAllListeners();
            response.writeHead(200, header);
            var responseContent = '';
            for (var m in jsContent) {
                responseContent = responseContent + jsContent[m];
            }
            console.log('responseContent');
            response.write(responseContent);
            response.end();
        }
    });
}

var errorJs = function(response, em) {
    em.on('import_js_error', function() {
        serverErrorResponse(response);
    });
}

exports.handler = function(request, response, path) {
    response.jsCount = 1;

    console.log(path);
    if (!mFs.existsSync(path)) {
        notFoundResponse(response);
        return;
    }

    var em = new mEvents.EventEmitter();
    importJs(response, em);
    combineJs(response, em);
    errorJs(response, em);

    mFs.readFile(path, 'utf8', function(err, file) {
        var header = {
            'Content-Type': mime.js
        };

        if (err) {
            console.log('jsHandler fail');
            serverErrorResponse(response);
        }
        else {
            // Compress code
            file = file.toString();
            file = mUglifyJs.minify(file, {fromString: true});
            file = file.code;
            // check $Import
            console.log('path=' + path);
            var basePathArr = path.split(/\/xe\//);
            console.log(basePathArr);
            // Do not use $Import when it is not Xe module
            if (basePathArr.length > 1) {
                var thisModuleName = basePathArr[1].replace(/\.js$/, '').replace(/\//g, '.');
                console.log('thisModuleName=' + thisModuleName);
                var basePath = basePathArr[0];
                var importStatements = file.match(importRegExp);
                console.log(importStatements);

                for (var i in importStatements) {

                    var moduleName = importStatements[i].split(/\([\'\"]/)[1].split(/[\'\"]\)/)[0];
                    var modulePath = moduleName.replace(/\./g, '/');
                    console.log('emit=>' + modulePath)
                    console.log(mPath.join(basePath, 'xe', (modulePath + '.js')));
                    ++response.jsCount;
                    console.log('now jsCount=' + response.jsCount);
                    var emitPath = mPath.join(basePath, 'xe', (modulePath + '.js'))
                    if (!(moduleName in jsContent)) {
                        em.emit('import_js', basePath, emitPath, emitPath);
                    }
                }

                file = file.replace(importRegExp, ';');
                em.emit('import_js_succ', thisModuleName, file);
                console.log('one file');
                console.log(file)
            }
            else {
                response.writeHead(200, header);
                response.write(file);
                response.end();
            }
        }
    });
}