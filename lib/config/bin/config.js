/**
 * Created by ng on 14-9-3.
 */

exports.getConfig = function(configName) {
    var mFs = require('fs');
    var mPath = require('path');
    var serverPath = mPath.dirname(mPath.dirname(mPath.dirname(__dirname)));

    var configPath = mPath.join(serverPath, 'conf', (configName + '.json'));

    if (mFs.existsSync(configPath)) {
        return require(configPath);
    }
    else {
        return false;
    }
}