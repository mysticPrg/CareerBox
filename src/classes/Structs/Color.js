/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Color(colorCode) {
        this.R = 'FF';
        this.G = 'FF';
        this.B = 'FF';

        if ( colorCode && (typeof colorCode) === 'string' ) {
            this.R = colorCode.substr(0, 2);
            this.G = colorCode.substr(2, 2);
            this.B = colorCode.substr(4, 2);
        } else if ( colorCode instanceof Color) {
            this.R = colorCode.R;
            this.G = colorCode.G;
            this.B = colorCode.B;
        }
    };

    Color.prototype.getColorCode = function getColorCode() {
        return (this.R + this.G + this.B);
    };

    Color.WHITE = new Color('FFFFFF');
    Color.BLACK = new Color('000000');

    return Color;

});