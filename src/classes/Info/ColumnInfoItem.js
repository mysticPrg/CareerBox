/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var dictionary = {
        'S_title' : '칼럼명',
        'L_content' : '내용'
    }
    function ColumnInfoItem(props) {

        this.S_title = ''; // 칼럼명
        this.L_content = ''; // 내용

        if ( props ) {
            this.S_title = props.S_title ? props.S_title : this.S_title;
            this.L_content = props.L_content ? props.L_content : this.L_content;
        }

        ColumnInfoItem.prototype.getAttributeName = function getAttributeName(key){
            return dictionary[key];
        }
    }

    return ColumnInfoItem;
});