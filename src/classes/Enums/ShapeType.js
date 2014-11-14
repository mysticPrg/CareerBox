/**
 * Created by careerBox on 2014-11-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var ShapeType = {
        circle: 'circle',
        box: 'box'
    };

    return ShapeType;
});