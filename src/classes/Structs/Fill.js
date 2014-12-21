/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['classes/Structs/Color'], function (Color) {

    function Fill(props) {
        this.use = true;
        this.color = new Color('FFFFFF');

        if (props) {
            this.use = props.use ? props.use : this.use;
            this.color = new Color(props.color ? props.color : this.color);
        }
    };

    return Fill;

});