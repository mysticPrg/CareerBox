/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function HexTo10(Hex){
        return parseInt(Hex, 16).toString(10)
    }

    function Color(colorCode) {
        this.R = 'FF';
        this.G = 'FF';
        this.B = 'FF';

        this.intR = function() {
            return HexTo10(this.R);
        };
        this.intG = function() {
            return HexTo10(this.G);
        };
        this.intB = function() {
            return HexTo10(this.B);
        }

        Color.prototype.getColorCode = function getColorCode() {
            return (this.R + this.G + this.B);
        };

        if (colorCode) {
            this.R = colorCode.substr(0, 2);
            this.G = colorCode.substr(2, 2);
            this.B = colorCode.substr(4, 2);
        }
    };

    Color.prototype.getColorCode = function getColorCode() {
        return (this.R + this.G + this.B);
    };

    Color.WHITE = new Color('FFFFFF');
    Color.BLACK = new Color('000000');

    return Color;

});