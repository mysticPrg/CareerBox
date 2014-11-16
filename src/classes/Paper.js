/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function (props) {
    function Paper() {
        this._id = null;
        this.articles = [];
        this.templateRefs = [];

        // server only
        this._portfolio_id = null;

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.articles = props.articles ? props.articles : this.articles;
            this.templateRefs = props.templateRefs ? props.templateRefs : this.templateRefs;

            this._portfolio_id = props._portfolio_id ? props._portfolio_id : this._portfolio_id;
        }
    };

    return Paper;
});