/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Member() {
        this._id = null;
        this.email = '';
        this.password = '';
        this.token = null;

        // server only
        this.timestamp = null;
    };

    return Member;
});