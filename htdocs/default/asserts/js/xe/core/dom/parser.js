/**
 * Created by ng on 14-9-5.
 */

$Import('core.dom.sizzle');

Xe.register('core.dom.parser', function($) {
    var that = {};

    return function(id) {
        var queryStringToJSON = function (url) {
            url = '?' + url;
            if (url === '')
                return '';
            var pairs = (url || location.search).slice(1).split('&');
            var result = {};
            for (var idx in pairs) {
                var pair = pairs[idx].split('=');
                if (!!pair[0])
                    result[pair[0].toLowerCase()] = decodeURIComponent(pair[1] || '');
            }
            return result;
        }

        // parse node-type
        var nodeType = $.core.dom.sizzle('#' + id + ' [node-type]');
        var nodeTypeNodeMap = {};
        for (var i in nodeType) {
            var n = nodeType[i];
            var v = n.getAttribute('node-type');
            if (nodeTypeNodeMap[v] == undefined) {
                nodeTypeNodeMap[v] = new Array();
            }
            nodeTypeNodeMap[v].push(n);
        }
        console.log(nodeTypeNodeMap);
        that.dom = nodeTypeNodeMap;

        // parse action-type
        var actionType = $.core.dom.sizzle('#' + id + ' [action-type]');
        console.log(actionType);
        var actionTypeNodeMap = {};
        for (var i in actionType) {
            var n = actionType[i];
            var v = n.getAttribute('action-type');
            var d = queryStringToJSON(n.getAttribute('action-data'));
            if (actionTypeNodeMap[v] == undefined) {
                actionTypeNodeMap[v] = new Array();
            }
            var actionNode = {
                'node': n,
                'data': d
            };
            actionTypeNodeMap[v].push(actionNode);
        }
        console.log(actionTypeNodeMap);
        that.action = actionTypeNodeMap;

        return that;
    };
})