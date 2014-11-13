/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/ListType',
    'classes/Templates/Template'
], function (Util, ListType, Template) {

    function ListTemplate(props) {
        Template.call(this, props);
        this.listType = ListType.vertical;

        if (props) {
            this.listType = props.listType ? props.listType : this.listType;
        }
    };

    Util.inherit(ListTemplate, Template);

    return ListTemplate;
});