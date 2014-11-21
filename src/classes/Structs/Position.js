/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Position(props) {
        this.x = 0;
        this.y = 0;

        if (props) {
            this.x = props.x ? props.x : this.x;
            this.y = props.y ? props.y : this.y;
        }
    };

    return Position;
});