/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['classes/Enums/Direction'], function (Direction) {

    function Arrow(props) {
        this.use = false;
        this.direction = Direction.end;

        if (props) {
            this.use = props.use ? props.use : this.use;
            this.direction = props.direction ? props.direction : this.direction;
        }
    };

    return Arrow;
});