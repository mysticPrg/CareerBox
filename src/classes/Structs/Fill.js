/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['classes/Structs/Color'], function (Color) {

    function Fill() {
        this.use = true;
        this.color = Color.WHITE;
        this.alpha = 100;
    };

    return Fill;

});