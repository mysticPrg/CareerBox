/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var ListType = {
        vertical: 'vertical',
        horizontal: 'horizontal',
        grid: 'grid'
    };

    return ListType;
});