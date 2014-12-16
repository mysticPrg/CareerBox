/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-25.
 */
define(['app'], function (app) {
    function loadItem(item, id, option) {
        var domObj = '<div id="' + id + '" ng-click ';

        if(option.draggable === true){
            domObj += 'draggable ';
        }
        if(option.resizable === true){
            domObj += 'resizable ';
        }
        if(option.rotatable === true){
            domObj += 'rotatable ';
        }

        var itemType = item.itemType;

        if (itemType === 'text') {
            domObj += 'common-attribute text class="itemText" ';
        } else if (itemType === 'image') {
            domObj += 'common-attribute image class="itemImage" ';
        } else if (itemType === 'line') {
            domObj += 'line ';
        } else if (itemType === 'link') {
            domObj += 'common-attribute link class="itemLink" ';
        } else if (itemType === 'shape') {
            domObj += 'common-attribute shape class="itemShape" ';
        }

        domObj += 'style="position: absolute; top: ' + item.pos.y + 'px; left: ' + item.pos.x + 'px; width: ' + item.size.width + 'px; height: ' + item.size.height + 'px;"></div>';

        return domObj;
    }

    function loadDivDom(item, option) {
        var domObj = '<div id="' + item._id + '" ng-click common-attribute ';

        if(option.draggable === true){
            domObj += 'draggable ';
        }
        if(option.resizable === true){
            domObj += 'resizable ';
        }

        domObj += 'style="position: absolute; top: ' + item.pos.y + 'px; left: ' + item.pos.x + 'px; width: ' + item.size.width + 'px; height: ' + item.size.height + 'px;">';

        return domObj;
    }

    function HTMLGenerator(operation, model, id, option) {
        if (operation === 'loadItem') {
            return loadItem(model, id, option);
        } else if (operation === 'loadDivDom') {
            return loadDivDom(model, option);
        }
    }

    app.factory('HTMLGenerator', function () {
        return HTMLGenerator;
    });
});