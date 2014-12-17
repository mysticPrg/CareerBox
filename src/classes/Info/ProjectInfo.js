/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/ProjectInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, ProjectInfoItem, InfoType) {

    function ProjectInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.workingInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new ProjectInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(ProjectInfo, InfoClass);

    return ProjectInfo;
});