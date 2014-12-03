/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['classes/Structs/Color'], function (Color) {

    function Outline(props) {
        this.use = true;
        this.color = Color.BLACK;
        this.weight = 1;

        if (props) {
            this.use = props.use ? props.use : this.use;
            this.color = props.color ? props.color : this.color;
            this.weight = props.weight ? props.weight : this.weight;
        }
    };

    return Outline;
});