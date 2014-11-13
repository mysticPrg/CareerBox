/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Size() {
        this.width = 100;
        this.height = 100;
    };

    return Size;
});