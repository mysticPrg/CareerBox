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
    'services/HTMLGenerator'
], function (app, Icon, Image, Item, Line, Link, Shape, Text) {
    app.controller('templatePanel', [
        '$scope',
        '$http',
        '$compile',
        'EditorData',
        'HTMLGenerator',
        function ($scope, $http, $compile, EditorData, HTMLGenerator) {
            $scope.childIndex = 0;

            function newItem(type) {
                var item;
                if (type === 'text') {
                    item = new Text();
                } else if (type === 'image') {
                    item = new Image();
                } else if (type === 'line') {
                    item = new Line();
                } else if (type === 'link') {
                    item = new Link();
                } else if (type === 'shape') {
                    item = new Shape();
                }

                item._id = $scope.childIndex++;
                item.itemType = type;
                item.state = 'new';

                return item;
            }

            $scope.itemClone = function (type) {
                var item = newItem(type);

                EditorData.templateItemArray[item._id] = item;

                var option = {draggable: true, resizable: true};

                var domObj = HTMLGenerator('loadItem', item, item._id, option);

                $(domObj).appendTo('#canvas-content');
                $compile($('#' + item._id))($scope);

                EditorData.focusId = item._id;    // 클론될 때 클론된 아이템의 속성창을 바로 띄워줌.
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