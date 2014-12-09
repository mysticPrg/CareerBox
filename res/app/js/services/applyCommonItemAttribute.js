/**
 * Created by gimbyeongjin on 14. 11. 14..
 */

define(['app'
], function(app) {
    app.factory('ApplyCommonItemAttribute', [ function () {

        var att = {
            'fill' : fill,
            'outline' : outline,
            'radius' : radius,
            'rotate' : rotate,
            'alpha' : alpha,
            'all' : all,
            'pos' : pos,
            'size' : size,
            'zOrder' : zOrder
        };
        return att;
    }]);

    function HexTo10(Hex){
        return parseInt(Hex, 16).toString(10)
    }

    function fill(element, item) {
        console.log('item', item);
        console.log('element', element);
        if(item.itemType == 'line'){
            element.css({
                'background-color': 'rgba(0,0,0,0)'
            });
        } else{
            element.css({
                'background-color' : 'rgba(' + HexTo10(item.fill.color.R) + ', '+ HexTo10(item.fill.color.G)+', '+HexTo10(item.fill.color.B)+', '+item.alpha/100+')'
            });
        }
    };

    function outline(element, item) {
        if(item.itemType == 'line'){

        } else {
            element.css({
                'border' : "10px solid #ffffff",
                'border-width' : item.outline.weight + "px",
                'border-color' : 'rgba(' + HexTo10(item.outline.color.R) + ', '+HexTo10(item.outline.color.G)+', '+HexTo10(item.outline.color.B)+', '+item.alpha/100+')'
            });
        }
    };

    function radius(element, item) {
        element.css({
            'border-radius': item.radius + "px"
        });
    };

    function rotate(element, item) {
        var r = 'rotate(' + item.rotate + 'deg)';
        element.css({
            '-moz-transform': r,
            '-webkit-transform': r,
            '-o-transform': r,
            '-ms-transform': r
        });
    };

    function alpha(element, item){
        if(item.itemType == 'line') {
            element.css({
                'background-color': 'rgba(0,0,0,0)',
                'border-color': 'rgba(0,0,0,0)'
            });
        } else{
            element.css({
                'background-color': 'rgba(' + HexTo10(item.fill.color.R) + ', ' + HexTo10(item.fill.color.G) + ', ' + HexTo10(item.fill.color.B) + ', ' + item.alpha / 100 + ')',
                'border-color': 'rgba(' + HexTo10(item.outline.color.R) + ', ' + HexTo10(item.outline.color.G) + ', ' + HexTo10(item.outline.color.B) + ', ' + item.alpha / 100 + ')'
            });
        }

    }

    function pos(element, item){
        element.css({
            top: item.pos.y + "px",
            left: item.pos.x + "px"
        });
    }

    function size(element, item){
        element.css({
            width: item.size.width + "px",
            height: item.size.height + "px"
        });
    }

    function zOrder(element, item){
        element.css({
            'z-Index': item.zOrder
        });
    }

    function all(element, item) {
        fill(element, item);
        outline(element, item);
        radius(element, item);
        rotate(element, item);
        alpha(element, item);
        pos(element, item);
        size(element, item);
        zOrder(element, item);
    }
});