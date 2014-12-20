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
    'directives/draggable',
    'directives/resizable',
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

            $('#canvas-content').find('div').remove();
            EditorData.templateItemArray = [];

            if(EditorData.templateState === 'new'){
                getTemplateInstance();
            }else if (EditorData.templateState == 'edit'){
                $scope.template = EditorData.template;
                loadTemplate();
            }

            EditorData.focusId = EditorData.template._id;

            // changed 초기화
            $scope.changed = false;
            isFirst = true;
        });

        // 로딩된 처음은 무조건 EditorData.templateItemArray watch가 발생하기 때문에 첫번째는 무시
        var isFirst = true;
        $scope.$watch("EditorData.templateItemArray", function () {
            if(!isFirst && EditorData.paper){
                $scope.changed = true;
//                console.log('EditorData.templateItemArray', EditorData.templateItemArray);
            } else {isFirst = false;}
        }, true);

        $rootScope.$on("deleteItem", function (e, id) {
            deleteItem(id);
        });

        // Get Template Instance
        function getTemplateInstance() {
            EditorData.template.target.size = {width : 600, height : 400};
            $scope.template = EditorData.template;

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

            var option = {draggable: true, resizable: true, rotatable: true};

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

            console.log('save data', $scope.template);
            SaveTemplate($http, $scope.template, function (result) {
                if (result.returnCode === '000') {
                    $scope.changed = false;
                    $scope.template._id = result.result;
                    showSuccessNotification();
                } else if (result.returnCode === '001') {
                    showFailNotification('실패하였습니다.');
                } else if (result.returnCode === '002') {
                    showFailNotification('로그인 필요');
                }
            });
        }

        $scope.movePaperEditor = function () {
            if($scope.changed == true){
                var modalInstance = $modal.open(saveConfirmModal);
                modalInstance.result.then(function () {
                    $.when($scope.save()).then(function(){
                        $window.location.href = '#portfolioEditor';
                    });
                }, function () {
                    $window.location.href = '#portfolioEditor';
                });
            }else{
                $window.location.href = '#portfolioEditor';
            }
        }

        function deleteItem(id) {
            $('#' + id).remove();
            EditorData.templateItemArray[id].state = 'del';
        }

        function showSuccessNotification() {
            var notification = kendo.toString('성공하였습니다.');
            $scope.noti.show(notification, "info");
        }

        function showFailNotification(text) {
            var notification = kendo.toString(text);
            $scope.noti.show(notification, "error");
        }
    }]);
});