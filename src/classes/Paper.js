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
        this.title = ''

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.childArr = props.childArr ? props.childArr : this.childArr;
            this.title = props.title ? props.title : this.title;
        }
    };

    return Paper;
});