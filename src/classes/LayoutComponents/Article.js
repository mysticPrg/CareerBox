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

    function Article(props) {
        LayoutComponent.call(this, props);

        this._template_id = null;
        this.childArr = [];
        this.rowCount = 1;
        this.colCount = 1;

        if (props) {
            this._template_id = props._template_id ? props._template_id : this._template_id;
            this.childArr = props.childArr ? props.childArr : this.childArr;
            this.rowCount = props.rowCount ? props.rowCount : this.rowCount;
            this.colCount = props.colCount ? props.colCount : this.colCount;
        }
    };

    Util.inherit(Article, LayoutComponent);

    return Article;
});
