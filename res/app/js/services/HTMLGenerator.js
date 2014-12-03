/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-25.
 */
define(['app'], function (app) {
    function loadItem(item, id, option) {
        var domObj = '<div id="' + id + '" ng-click common-attribute ';

        if(option.draggable === true){
            domObj += 'draggable ';
        }
        if(option.resizable === true){
            domObj += 'resizable ';
        }

        var itemType = item.itemType;

        if (itemType === 'text') {
            domObj += 'text class="itemText" ';
        } else if (itemType === 'image') {
            domObj += 'image class="itemImage" ';
        } else if (itemType === 'line') {
            domObj += 'line ';
        } else if (itemType === 'link') {
            domObj += 'link class="itemLink" ';
        } else if (itemType === 'shape') {
            domObj += 'shape class="element" ';
        }

        domObj += 'style="position: absolute; top: ' + item.pos.y + 'px; left: ' + item.pos.x + 'px; width: ' + item.size.width + 'px; height: ' + item.size.height + 'px;"></div>';

        return domObj;
    }

    function loadDivDom(item, option) {
        var domObj = '<div id="' + item._id + '" ';

        if(option.draggable === true){
            domObj += 'draggable ';
        }
        if(option.resizable === true){
            domObj += 'resizable ';
        }

        domObj += 'style="position: absolute; top: ' + item.pos.y + 'px; left: ' + item.pos.x + 'px; width: ' + item.size.width + 'px; height: ' + item.size.height + 'px; box-shadow: 4px 4px 2px #888888;">';

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