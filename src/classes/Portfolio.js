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
        this.timestamp = new Date();;
        this.description = '';
        this.thumbnail = null;

        // server only
        this._member_id = null;

        if (props) {
            this._id = props._id ? props._id : null;
            this.title = props.title ? props.title : this.title;
            this.timestamp = props.timestamp ? props.timestamp : this.timestamp;
            this.description = props.description ? props.description : this.description;
            this.thumbnail = props.thumbnail ? props.thumbnail : this.thumbnail;

            this._member_id = props._member_id ? props._member_id : this._member_id;
        }

    };

    return Portfolio;
});