/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-17.
 */
define([
    'app',
    'classes/LayoutComponents/Items/Icon',
    'classes/LayoutComponents/Items/Image',
    'classes/LayoutComponents/Items/Item',
    'classes/LayoutComponents/Items/Line',
    'classes/LayoutComponents/Items/Link',
    'classes/LayoutComponents/Items/Shape',
    'classes/LayoutComponents/Items/Text',
    'services/EditorData',
    'services/HTMLGenerator',
    'services/SetZOrder'
], function (app, Icon, Image, Item, Line, Link, Shape, Text) {
    app.controller('templatePanel', [
        '$scope',
        '$http',
        '$compile',
        'EditorData',
        'HTMLGenerator',
        'SetZOrder',
        function ($scope, $http, $compile, EditorData, HTMLGenerator, SetZOrder) {
            $scope.childIndex = 0;

            function newItem(type) {
                var item;
                if (type === 'text') {
                    item = new Text();
                    item.radius = 3;
                    item.font.size = 15;
                    item.size.width = 250;
                    item.size.height = 100;
                    item.outline.color.R = "d9";
                    item.outline.color.G = "d9";
                    item.outline.color.B = "d9";
                    item.value = 'Text';

                } else if (type === 'image') {
                    item = new Image();
                    item.size.width = 140;
                    item.size.height = 180;
                    item.outline.weight = 0;

                } else if (type === 'line') {
                    item = new Line();
                    item.outline.weight = 2;
                    item.size.width = 250;

                } else if (type === 'link') {
                    item = new Link();
                    item.size.width = 100;
                    item.size.height = 50;
                    item.url = 'http://';
                    item.name = '여기로 이동';
                    item.outline.weight = 0;
                    item.font.size = 15;

                } else if (type === 'shape') {
                    item = new Shape();
                    item.outline.weight = 3;
                    item.fill.color.R = "f2";
                    item.fill.color.G = "57";
                    item.fill.color.B = "5a";

                    item.outline.color.R = "e1";
                    item.outline.color.G = "3b";
                    item.outline.color.B = "3d";
                }

                item._id = $scope.childIndex++;
                item.itemType = type;
                item.state = 'new';

                return item;
            }

            $scope.itemClone = function (type) {
                var item = newItem(type);

                EditorData.templateItemArray[item._id] = item;

                var option = {draggable: true, resizable: true, rotatable: true};

                var domObj = HTMLGenerator('loadItem', item, item._id, option);

                $(domObj).appendTo('#canvas-content');
                $compile($('#' + item._id))($scope);

                EditorData.focusId = item._id;    // 클론될 때 클론된 아이템의 속성창을 바로 띄워줌.
                SetZOrder(item, item._id);
            };
        }
    ]);

    app.directive('templatePanel', function () {
        return {
            restrict: 'A',
            templateUrl: require.toUrl('component/templatePanel/template.html'),
            controller: 'templatePanel'
        };
    });

});