/**
 * Created by ng on 14-9-3.
 * 约定：
 * m开头的变量代表导入模块
 * g开头的变量为全局变量
 */

/*
 * 导入模块区域
 */
var mConfig = require('../lib/config');
var mHttp = require('http');
var mPath = require('path')

/*
 * 全局变量
 */
gLibPath = mPath.join(mPath.dirname(__dirname), 'lib');

var serverConfig = mConfig.getConfig('server');

if (false == serverConfig) {
    console.log('Need server config');
    process.exit()
}

var mRouter = require(mPath.join(gLibPath, 'router'));


/*
 * 代码逻辑
 */
var server = mHttp.createServer(function(request, response){
    mRouter.run(request, response);
});

try {
    server.listen(serverConfig.port);
}
catch (e) {
    console.log(e);
    process.exit()
}
