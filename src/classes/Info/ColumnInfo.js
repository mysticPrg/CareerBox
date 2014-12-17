/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/ColumnInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, ColumnInfoItem, InfoType) {

    function ProjectInfo(props) {

        InfoClass.call(this, props);

        this.title = '칼럼';
        this.infoType = InfoType.columnInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new ColumnInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(ProjectInfo, InfoClass);

    return ProjectInfo;
});