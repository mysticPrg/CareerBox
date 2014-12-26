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
            this.x = Number((props.x!==undefined) ? props.x : this.x);
            this.y = Number((props.y!==undefined) ? props.y : this.y);
        }
    };

    return Position;
});