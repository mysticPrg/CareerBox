/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/LayoutComponents/Article',
], function (Article) {

    function Template(props) {
        this._id = null;
        this.title = 'New Template';
        this.target = new Article();
        this.description = '';
        this.timestamp = new Date();
        this.thumbnail = null;
        this.isBasic = false;

        // server only
        this._member_id = null;

        if (props) {
            this._id = props._id ? props._id : null;
            this.title = props.title ? props.title : this.title;
            this.description = props.description ? props.description : this.description;
            this.timestamp = props.timestamp ? props.timestamp : this.timestamp;
            this.thumbnail = props.thumbnail ? props.thumbnail : this.thumbnail;
            this.isBasic = (props.isBasic!==undefined) ? props.isBasic : this.isBasic;

            this._member_id = props._member_id ? props._member_id : this._member_id;

            if (props.target) {
                this.target = new Article(props.target);
            }
        }
    }

    return Template;
});