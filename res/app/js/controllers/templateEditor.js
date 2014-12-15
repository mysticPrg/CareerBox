/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-17.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Templates/Template',
    'classes/LayoutComponents/Article',
    'component/saveConfirmModal/component',
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
    'component/templatePanel/component'
], function ($, ng, app, Template, Article, saveConfirmModal) {
    app.controller('TemplateEditor', ['$scope', '$rootScope', '$http', '$modal', '$window', '$compile', 'EditorData', 'HTMLGenerator', 'SaveTemplate', 'SetAttributeInformation', function ($scope, $rootScope, $http, $modal, $window, $compile, EditorData, HTMLGenerator, SaveTemplate, SetAttributeInformation) {
        EditorData.editorType = 'template';
        $scope.changed = false;

        // z index 초기화
        EditorData.end_zOrder = 0;
        EditorData.start_zOrder = 0;

        $scope.template = new Template();

        // 템플릿 속성
        $('#canvas-content').bind('click', function (){
            // 포커싱 처리
            EditorData.focusId = 'canvas-content';
        });

        $(document).ready(function () {
            $scope.orientation = "horizontal";
            $scope.panes = [
                {collapsible: true, size: "300px"},
                {collapsible: false}
            ];

            $scope.template = EditorData.template;

            $('#canvas-content').find('div').remove();
            EditorData.templateItemArray = [];


            // [병진] EditorData.templateState 가 edit가 되었지 않아서 실행이 안되기 때문에 주석처리를 해줌.
            if (EditorData.templateState == 'edit')

//            if($scope.template.target != null)
            {
                loadTemplate();
            }
            else{
                getTemplateInstance();
            }
        });

        $scope.$watch("EditorData.templateItemArray", function () {
            $scope.changed = true;
        }, true);

        $rootScope.$on("deleteItem", function (e, id) {
            deleteItem(id);
        });

        // Get Template Instance
        function getTemplateInstance() {
            var article = new Article();
            article.template = $scope.template._template_id;

            article.size.width = $('#canvas-content').width();
            article.size.height = $('#canvas-content').height();

            article.childArr = getTemplateChildArr(EditorData.templateItemArray);
            article.rowCount = 0;
            article.colCount = 0;

            $scope.template.target = article;

            // 템플릿 생성하고 나면 캔버스 속성이 나오도록함.
            EditorData.focusId = 'canvas-content';
        }

        // Load Element
        function loadTemplate() {
            var size = $scope.template.target.size;
            loadEditorCanvas(size);

            var itemArray = $scope.template.target.childArr;
            for (var index = 0; index < itemArray.length; index++) {
                delete itemArray[index].state;
                EditorData.templateItemArray[itemArray[index]._id] = itemArray[index];
            }
            loadTemplateElement();
        }

        function loadEditorCanvas(size){
            $('#canvas-content').width(size.width);
            $('#canvas-content').height(size.height);
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

//            EditorData.focusId = id;    // 포커스 지정
            EditorData.end_zOrder++;
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

            $scope.template.target.childArr = getTemplateChildArr(EditorData.templateItemArray);

            $scope.thumbnail = '';
            $scope.description = '';

            console.log('$scope.template.target', $scope.template.target);

            SaveTemplate($http, $scope.template, function (resultCode) {
                if (resultCode == 000) {
                    $scope.changed = false;
                    alert('Success');
                } else if (resultCode === 001) {
                    alert('Invalid Arguments');
                } else if (resultCode === 002) {
                    alert('Not Login');
                }
            });
        }

        $scope.movePaperEditor = function () {
            if($scope.changed == true){
                var modalInstance = $modal.open(saveConfirmModal);
                modalInstance.result.then(function () {
                    $.when($scope.save()).then(function(){
                        history.back();
                    });
                }, function () {
                    history.back();
                });
            }else{
                history.back();
            }
        }

        function deleteItem(id) {
            $('#' + id).remove();
            EditorData.templateItemArray[id].state = 'del';
        }
    }]);
});