/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['classes/Structs/Color'], function (Color) {

    function Font() {
        this.color = Color.BLACK;
        this.size = 11;
        this.family = 'dotum';

        this.italic = false;
        this.bold = false;
    };

    return Font;
});