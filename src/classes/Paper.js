/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    function Paper(props) {
        this._id = null;
        this.childArr = [];
        this.title = '';
        this._portfolio_id = null;

        // server only
        this._member_id = null;

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.childArr = props.childArr ? props.childArr : this.childArr;
            this.title = props.title ? props.title : this.title;
            this._portfolio_id = props._portfolio_id ? props._portfolio_id : this._portfolio_id;

            this._member_id = props._member_id ? props._member_id : this._member_id;
        }
    };

    return Paper;
});