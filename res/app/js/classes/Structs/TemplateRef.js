/**
 * Created by careerBox on 2014-11-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function TemplateRef(props) {
        this._template_id = null;
        this.version = 0;
        this.ref_count = 0;

        if (props) {
            this._template_id = props._template_id ? props._template_id : this._template_id;
            this.version = props.version ? props.version : this.version;
            this.ref_count = props.ref_count ? props.ref_count : this.ref_count;
        }
    };

    return TemplateRef;
});