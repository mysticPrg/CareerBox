/**
 * Created by careerBox on 2014-11-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function TemplateRef(props) {
        this._id = null;
        this.version = 0;

        if (props) {
            this._id = props._id ? props._id : this._id;
            this.version = props.version ? props.version : this.version;
        }
    };

    return TemplateRef;
});