/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Term'
], function (Term) {

    function WorkingInfoItem(props) {

        this.S_name = ''; //

        if ( props ) {
            this.S_name = props.S_name ? props.S_name : this.S_name;
        }
    }

    return WorkingInfoItem;
});