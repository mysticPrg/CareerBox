/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Member(props) {
        this._id = null;
        this.email = '';
        this.isFacebook = false;
        this.password = '';

        // server only
        this.timestamp = new Date();

        if (props) {
            this._id = props._id ? props._id : null;
            this.email = props.email ? props.email : this.email;
            this.isFacebook = (props.isFacebook!==undefined) ? props.isFacebook : this.isFacebook;
            this.password = props.password ? props.password : this.password;

            this.timestamp = props.timestamp ? props.timestamp : this.timestamp;
        }
    };

    return Member;
});
