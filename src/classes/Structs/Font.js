/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['classes/Structs/Color'], function (Color) {

    function Font(props) {
        this.color = new Color('000000');
        this.size = 11;
        this.family = 'nanum gothic';

        this.italic = false;
        this.bold = false;

        if (props) {
            this.color = new Color(props.color ? props.color : this.color);
            this.size = Number((props.size!==undefined) ? props.size : this.size);
            this.family = props.family ? props.family : this.family;
            this.italic = (props.italic!==undefined) ? props.italic : this.italic;
            this.bold = (props.bold!==undefined) ? props.bold : this.bold;
        }
    };

    return Font;
});