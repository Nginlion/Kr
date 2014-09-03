/**
 * Created by ng on 14-9-3.
 */

var bp = (function(){
    return function(id, html) {
        document.getElementById(id).innerHTML = html;
    }
})();