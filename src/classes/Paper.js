/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    function Paper() {
        this._id = null;
        this.articles = [];

        // server only
        this._portfolio_id = null;
    };

    return Paper;
});