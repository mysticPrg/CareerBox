/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var dictionary = {
        'S_title' : '칼럼명',
        'S_content' : '내용'
    };

    function ColumnInfoItem(props) {

        this._id = null;
        this.S_title = ''; // 칼럼명
        this.S_content = ''; // 내용

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.S_title = props.S_title ? props.S_title : this.S_title;
            this.S_content = props.S_content ? props.S_content : this.S_content;
        }
    }

    ColumnInfoItem.prototype.getAttributeName = function getAttributeName(key){
        return dictionary[key];
    };

    return ColumnInfoItem;
});