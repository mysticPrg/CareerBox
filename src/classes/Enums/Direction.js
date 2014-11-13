/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var Direction = {
        start: 'start',
        end: 'end',
        both: 'both'
    };

    return Direction;
});