/**
 * Created by ng on 14-9-4.
 */

var Xe = (function() {
    var that = {};

    var register = function(moduleName, cb) {
        var path = moduleName.split('.');
        if (path.length < 1) {
            throw new Error('invalid module name');
        }
        var reg = that;
        var lastSep = path[path.length - 1];
        for (var i = 0; i < path.length - 1; ++i) {
            var p = path[i];
            if (reg[p] == undefined) {
                reg[p] = {}
            }
            reg = reg[p];
        }
        if (reg[lastSep] == undefined) {
            reg[lastSep] = cb(that);
        }
    }

    that.register = register;

    return that;
})();