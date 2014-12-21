/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Size(props) {
        this.width = 100;
        this.height = 100;

        if (props) {
            this.width = Number(props.width ? props.width : this.width);
            this.height = Number(props.height ? props.height : this.height);
        }
    };

    return Size;
});