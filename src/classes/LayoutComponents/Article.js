/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/LayoutComponents/LayoutComponent',
    'classes/Enums/ItemType',
    'classes/LayoutComponents/Items/Icon',
    'classes/LayoutComponents/Items/Image',
    'classes/LayoutComponents/Items/Line',
    'classes/LayoutComponents/Items/Link',
    'classes/LayoutComponents/Items/Shape',
    'classes/LayoutComponents/Items/Text',
], function (Util, LayoutComponent, ItemType, Icon, Image, Line, Link, Shape, Text) {

    function createChildObj(article, data) {

        var childArr = [];

        for ( var i=0 ; i<data.length ; i++ ) {
            switch (data.itemType) {
                case ItemType.icon:
                    childArr.push(new Icon(data[i]));
                    break;

                case ItemType.image:
                    childArr.push(new Image(data[i]));
                    break;

                case ItemType.line:
                    childArr.push(new Line(data[i]));
                    break;

                case ItemType.link:
                    childArr.push(new Link(data[i]));
                    break;

                case ItemType.shape:
                    childArr.push(new Shape(data[i]));
                    break;

                case ItemType.text:
                    childArr.push(new Text(data[i]));
                    break;
            }
        }

        article.childArr = childArr;
    }

    function Article(props) {
        LayoutComponent.call(this, props);

        this._template_id = null;
        this.childArr = [];
        this.rowCount = 1;
        this.colCount = 1;

        if (props) {
            this._template_id = props._template_id ? props._template_id : this._template_id;
            this.rowCount = props.rowCount ? props.rowCount : this.rowCount;
            this.colCount = props.colCount ? props.colCount : this.colCount;

            if (props.childArr) {
                createChildObj(this, props.childArr);
            }
        }
    };

    Util.inherit(Article, LayoutComponent);

    return Article;
});
