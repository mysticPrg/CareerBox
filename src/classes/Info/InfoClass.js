/**
 * Created by careerBox on 2014-12-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Enums/InfoType'
], function (InfoType) {

    function InfoClass(props) {
        this._id = null;
        this._member_id = null;
        this.infoType = InfoType.personalInfo;
        this.title = '';

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this._member_id = props._member_id ? props._member_id : this._member_id;
            this.infoType = props.infoType ? props.infoType : this.infoType;
        }

    }

    return InfoClass;
});