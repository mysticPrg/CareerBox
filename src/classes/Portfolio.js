/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Portfolio(props) {

        this._id = null;
        this.title = '';
        this.datetime = null;
        this.description = '';
        this.thumbnail = null;

        if (props) {
            this._id = props._id ? props._id : null;
            this.title = props.title ? props.title : this.title;
            this.datetime = props.datetime ? props.datetime : this.datetime;
            this.description = props.description ? props.description : this.description;
        }

        // server only
        this._member_id = null;
    };

    return Portfolio;
});