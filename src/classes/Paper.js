/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Size',
    'classes/Structs/Fill',
], function (Size, Fill) {

    function Paper(props) {
        this._id = null;
        this._portfolio_id = null;
        this.title = '';
        this.description = '';
        this.childArr = [];
        this.fill = new Fill();
        this.size = new Size({
            width: 960,
            height: 1358
        });
        this.isIndex = false;

        //server only
        this._member_id = null;

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this._portfolio_id = props._portfolio_id ? props._portfolio_id : this._portfolio_id;
            this.title = props.title ? props.title : this.title;
            this.description = props.description ? props.description : this.description;
            this.childArr = props.childArr ? props.childArr : this.childArr;
            this.fill = new Fill(props.fill ? props.fill : this.fill);
            this.size = new Size(props.size ? props.size : this.size);
            this.isIndex = (props.isIndex!==undefined) ? props.isIndex : this.isIndex;

            this._member_id = props._member_id ? props._member_id : this._member_id;
        }
    };

    return Paper;
});