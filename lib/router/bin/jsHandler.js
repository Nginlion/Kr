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

var importRegExp = /\$Import\([\'\"][a-zA-Z0-9\.]+[\'\"]\)[\;\,]/g;

var serverErrorResponse = function(response) {
    response.writeHead(500, {'Content-Type': mime.text});
    response.end('Server error\n');
}

var errorJs = function(response, em) {
    em.on('import_js_error', function() {
        response.jsContent = {};
        serverErrorResponse(response);
    });
}

var getRequiredJs = function(response, requiredJsPath) {
    var file = mFs.readFileSync(requiredJsPath, 'utf8');
    // Compress code
    file = file.toString();
    file = mUglifyJs.minify(file, {fromString: true});
    file = file.code;
    // check $Import
    console.log('require path=' + requiredJsPath);
    var basePathArr = requiredJsPath.split(/\/xe\//);
    console.log(basePathArr);
    // Do not use $Import when it is not Xe module
    if (basePathArr.length > 1) {
        var thisModuleName = basePathArr[1].replace(/\.js$/, '').replace(/\//g, '.');
        console.log('thisModuleName=' + thisModuleName);
        var basePath = basePathArr[0];
        var importStatements = file.match(importRegExp);
        console.log('importStatements');
        console.log(importStatements);
        // required file first
        file = file.replace(importRegExp, ';');
        console.log('response.jsModules[thisModuleName] <=========> ' + thisModuleName + ' ' + response.jsModules[thisModuleName]);
        if (response.jsModules.indexOf(thisModuleName) == -1) {
            response.jsModules.push(thisModuleName);
            response.jsContent.push(file);
            console.log('++++++++++++++++++++++++++++++++');
            console.log(response.jsContent)
            console.log('++++++++++++++++++++++++++++++++');
            console.log(response.jsModules)
            console.log('++++++++++++++++++++++++++++++++');

            if (importStatements && importStatements.length > 0) {
                for (var i in importStatements) {
                    var moduleName = importStatements[i].split(/\([\'\"]/)[1].split(/[\'\"]\)/)[0];
                    var modulePath = moduleName.replace(/\./g, '/');
                    var emitPath = mPath.join(basePath, 'xe', (modulePath + '.js'));
                    if (!(moduleName in response.jsModules)) {
                        console.log('REQUIRE GET ===============> ' + emitPath);
                        getRequiredJs(response, emitPath);
                    }
                }
            }

        }


    }
}

exports.handler = function(request, response, path) {
    var header = {
        'Content-Type': mime.js
    };

    if (undefined != gJsCache[path]) {
        console.log('hit cahce');
        response.writeHead(200, header);
        response.write(gJsCache[path]);
        response.end();
        return;
    }

    response.jsContent = new Array();
    response.jsModules = new Array();

    console.log(path);
    if (!mFs.existsSync(path)) {
        notFoundResponse(response);
        return;
    }

    console.log('NOW_FILE ===========> ' + path);

    var file = mFs.readFileSync(path, 'utf8');
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
        console.log('importStatements');
        console.log(importStatements);
        // required file first
        file = file.replace(importRegExp, ';');
        response.jsModules.push(thisModuleName);
        response.jsContent.push(file)

        if (importStatements && importStatements.length > 0) {
            for (var i in importStatements) {
                var moduleName = importStatements[i].split(/\([\'\"]/)[1].split(/[\'\"]\)/)[0];
                var modulePath = moduleName.replace(/\./g, '/');
                var emitPath = mPath.join(basePath, 'xe', (modulePath + '.js'))
                if (!(moduleName in response.jsModules)) {
                    console.log('GET ===============> ' + emitPath);
                    getRequiredJs(response, emitPath);
                }
            }
        }
    }
    else {
        response.jsModules.push('onefile');
        response.jsContent.push(file)
    }

    response.writeHead(200, header);

    if (undefined == gJsCache[path]) {
        gJsCache[path] = '';
    }
    while (response.jsContent.length > 0) {
        var content = response.jsContent.pop();
        console.log("-----------");
        console.log("jsContent.length ===> " + response.jsContent.length);
        console.log(content);
        response.write(content);
        gJsCache[path] = gJsCache[path] + content;
    }

    response.end();
}