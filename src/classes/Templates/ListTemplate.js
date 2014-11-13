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

    function ListTemplate() {
        Template.call(this);
        this.listType = ListType.vertical;
    };

    Util.inherit(ListTemplate, Template);

    return ListTemplate;
});