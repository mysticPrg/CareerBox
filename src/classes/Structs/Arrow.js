/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['classes/Enums/Direction'], function (Direction) {

    function Arrow() {
        this.use = false;
        this.direction = Direction.end;
    };

    return Arrow;
});