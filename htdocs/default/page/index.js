/**
 * Created by ng on 14-9-3.
 */

var mPath = require('path');
var mEvents = require('events');
var mConfig = require(mPath.join(gLibPath, 'config'));
var mLoader = require(mPath.join(gLibPath, 'loader'));
var mime = mConfig.getConfig('mime');

exports.run = function(request, response) {
    var header = {
        'Content-Type': mime.html + '; charset=utf-8',
        'Pragma':'no-cache',
        'Cache-Control':'no-cache, must-revalidate',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked'
    };

    response.writeHead(200, header);
    var plTop = mLoader.load('default', 'pl/index/top');
    var plMiddle = mLoader.load('default', 'pl/index/middle');
    var plBottom = mLoader.load('default', 'pl/index/bottom');
    var em = new mEvents.EventEmitter();
    plTop.run(em);
    plMiddle.run(em);
    plBottom.run(em);

    var html = mLoader.loadView('default', 'index/page/index.html');
    html = html.toString().replace('<\/html>', '').replace('<\/body>', '');
    if (response.write(html, 'utf-8')) {
            console.log(html);
            response.plCount = 3;
            console.log('plCount=' + response.plCount);

            em.on('pl_finished', function() {
                --response.plCount;
                console.log('plCount=' + response.plCount);
                if (response.plCount == 0) {
                    em.removeAllListeners();
                    console.log('page_index');
                    console.log('</body></html>')
                    response.end('</body></html>', 'utf-8');
                }
            });

            em.emit('render_pl', request, response, em);
    }
}



