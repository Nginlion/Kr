/**
 * Created by ng on 14-9-3.
 */

exports.load = function(host, objPath) {
    var mFs = require('fs');
    var mPath = require('path');
    var serverPath = mPath.dirname(mPath.dirname(mPath.dirname(__dirname)));
    var realObjPath = mPath.join(serverPath, 'htdocs', host, objPath);
    console.log(realObjPath);

    if (mFs.existsSync(realObjPath + '.js')) {
        return require(realObjPath);
    }
    else {
        return false;
    }
}

exports.loadView = function(host, viewPath) {
    var mFs = require('fs');
    var mPath = require('path');
    var serverPath = mPath.dirname(mPath.dirname(mPath.dirname(__dirname)));
    var realViewPath = mPath.join(serverPath, 'htdocs', host, 'view', viewPath);
    console.log(realViewPath)

    if (mFs.existsSync(realViewPath)) {
        return mFs.readFileSync(realViewPath, 'utf-8');
    }
    else {
        return false;
    }
}