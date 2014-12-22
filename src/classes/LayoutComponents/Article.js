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
    'classes/Enums/LayoutComponentType',
    'classes/LayoutComponents/Items/Icon',
    'classes/LayoutComponents/Items/Image',
    'classes/LayoutComponents/Items/Line',
    'classes/LayoutComponents/Items/Link',
    'classes/LayoutComponents/Items/Shape',
    'classes/LayoutComponents/Items/Text',
], function (Util, LayoutComponent, ItemType, LayoutComponentType, Icon, Image, Line, Link, Shape, Text) {

    function createChildObj(article, data) {

        var childArr = [];

        for ( var i=0 ; i<data.length ; i++ ) {

            var tempArr = [];
            for ( var k=0 ; k<data[i].length ; k++ ) {

                switch (data[i][k].itemType) {
                    case ItemType.icon:
                        tempArr.push(new Icon(data[i][k]));
                        break;

                    case ItemType.image:
                        tempArr.push(new Image(data[i][k]));
                        break;

                    case ItemType.line:
                        tempArr.push(new Line(data[i][k]));
                        break;

                    case ItemType.link:
                        tempArr.push(new Link(data[i][k]));
                        break;

                    case ItemType.shape:
                        tempArr.push(new Shape(data[i][k]));
                        break;

                    case ItemType.text:
                        tempArr.push(new Text(data[i][k]));
                        break;
                }

            }
            childArr.push(tempArr);
        }

        article.childArr = childArr;
    }

    function Article(props) {
        LayoutComponent.call(this, props);

        this._template_id = null;
        this.childArr = [[]];
        this.rowCount = 1;
        this.colCount = 1;
        this.layoutComponentType = LayoutComponentType.article;
        this.bindingChanged = false;

        if (props) {
            this._template_id = props._template_id ? props._template_id : this._template_id;
            this.rowCount = Number(props.rowCount ? props.rowCount : this.rowCount);
            this.colCount = Number(props.colCount ? props.colCount : this.colCount);
            this.bindingChanged = (props.bindingChanged!==undefined) ? props.bindingChanged : this.bindingChanged;

            if (props.childArr) {
                createChildObj(this, props.childArr);
            }
        }
    };

    Util.inherit(Article, LayoutComponent);

    return Article;
});
