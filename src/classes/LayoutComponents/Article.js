/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/LayoutComponents/LayoutComponent'
], function (Util, LayoutComponent) {

    function Article() {
        LayoutComponent.call(this);

        this._template_id = null;
        this.items = [];
    };

    Util.inherit(Article, LayoutComponent);

    return Article;
});
