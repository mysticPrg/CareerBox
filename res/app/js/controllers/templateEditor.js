/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-17.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Templates/Template',
    'classes/LayoutComponents/Article',
    'classes/LayoutComponents/Items/Icon',
    'classes/LayoutComponents/Items/Image',
    'classes/LayoutComponents/Items/Item',
    'classes/LayoutComponents/Items/Line',
    'classes/LayoutComponents/Items/Link',
    'classes/LayoutComponents/Items/Shape',
    'classes/LayoutComponents/Items/Text',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/draggable',
    'directives/resizable',
    'directives/CommonAttribute',
    'services/EditorData',
    'services/HTMLGenerator',
    'services/SaveTemplate',
    'services/SetAttributeInformation',
    '../../component/templatePanel/component'
], function ($, ng, app, Template, Article, Icon, Image, Item, Line, Link, Shape, Text) {
    app.controller('TemplateEditor', ['$scope', '$rootScope', '$http', '$window', '$compile', 'EditorData', 'HTMLGenerator', 'SaveTemplate', 'SetAttributeInformation', function ($scope, $rootScope, $http, $window, $compile, EditorData, HTMLGenerator, SaveTemplate, SetAttributeInformation) {
        $scope.template = new Template();

        $(document).ready(function () {
            $scope.orientation = "horizontal";
            $scope.panes = [
                {collapsible: true, size: "300px"},
                {collapsible: false}
            ];

            $scope.template = EditorData.template;

            $('#canvas-content').find('div').remove();
            EditorData.templateItemArray = [];

            if (EditorData.templateState == 'edit') {
                console.log('test');
                loadTemplate();
            }
        });

        $rootScope.$on("deleteItem", function (e, id) {
            deleteItem(id);
        });

        $scope.linkSectionEditor = function () {
            window.history.back();
        }

        // Load Element
        function loadTemplate() {
            var itemArray = $scope.template.target.childArr;
            for (var index = 0; index < itemArray.length; index++) {
                delete itemArray[index].state;
                EditorData.templateItemArray[itemArray[index]._id] = itemArray[index];
            }

            loadTemplateElement();

        }

        function loadTemplateElement() {
            for (var key in EditorData.templateItemArray) {
                loadElement(EditorData.templateItemArray[key]);
            }
        }

        // 템플릿에서 edit 눌러서 저장된 아이템이 로드될 때 발생!
        function loadElement(item) {
            var id = EditorData.template._id + '_' + item._id;

            var option = {draggable: true, resizable: true};

            var domObj = HTMLGenerator('loadItem', item, item._id, option);

            $('#canvas-content').append(domObj);
            $compile($('#' + item._id))($scope);

            EditorData.focusId = id;    // 포커스 지정
        }

        function getTemplateChildArr(ItemArray) {
            // array copy
            var templateItemArray = [];
            for (var key in ItemArray) {
                templateItemArray[key] = ItemArray[key];
            }

            var templateChildArr = [];

            for (var key in templateItemArray) {

                var item = templateItemArray[key];

                if (item.state == 'new') {
                    delete item._id;
                }

                if (item.state == 'del') {
                    continue;
                }

                delete item.state;

                templateChildArr.push(item);
            }

            return templateChildArr;
        }


        $scope.save = function () {
            EditorData.focusId = '';

            var article = new Article();
            article.template = $scope.template._template_id;

            article.size.width = $('#canvas-content').width();
            article.size.height = $('#canvas-content').height();

            article.childArr = getTemplateChildArr(EditorData.templateItemArray);
//            article.childArr = EditorData.templateItemArray;
            article.rowCount = 0;
            article.colCount = 0;

            $scope.template.target = article;

            $scope.thumbnail = '';
            $scope.description = '';

            SaveTemplate($http, $scope.template, function (resultCode) {
                console.log(resultCode);
                if (resultCode == 000) {
                    alert('Success');
                } else if (resultCode === 001) {
                    alert('Invalid Arguments');
                } else if (resultCode === 002) {
                    alert('Not Login');
                }
            });
        }

        $scope.cancel = function () {
            window.history.back();
        }

        // updateModel 폐업

//        function updateModel(id, draggable) {
//
//            console.log('updateModel start');
//
//            var item = SetAttributeInformation(id);
////            var item = EditorData.templateItemArray[id];
//            // ** do not override item id
////            item._id = id;
//            item.pos = {x: draggable.position().left, y: draggable.position().top};
//            item.size = {width: draggable.width(), height: draggable.height()};
//            if (item.state != 'new') {
//                item.state = 'edit';
//            }
//
////            EditorData.templateItemArray[id] = item;
//        }

        $scope.canvasClick = function (){
            alert(test);
        }

        $('#canvas-content').droppable({
            activeClass: "drop-area",
            drop: function (e, ui) {            // 드롭될 경우
                // 업데이트 모듈 함수는 draggable, resize 디렉티브에서 인수해감.
            }
        });

        function deleteItem(id) {
            $('#' + id).remove();
            EditorData.templateItemArray[id].state = 'del';
        }
    }]);
});