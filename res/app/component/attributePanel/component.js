define([
    'app',
    'component/attribute/fillAttribute/component',
    'component/attribute/shapeTypeAttribute/component',
    'component/attribute/arrowAttribute/component',
    'component/attribute/outlineAttribute/component',
    'component/attribute/radiusAttribute/component',
    'component/attribute/rotateAttribute/component',
    'component/attribute/posAttribute/component',
    'component/attribute/sizeAttribute/component',
    'component/attribute/alphaAttribute/component',
    'component/attribute/alignAttribute/component',
    'component/attribute/valueAttribute/component',
    'component/attribute/titleAttribute/component',
    'component/attribute/descriptionAttribute/component',
    'component/attribute/fontAttribute/component',
    'component/attribute/verticalAlignAttribute/component',
    'component/attribute/nameAttribute/component',
    'component/attribute/urlAttribute/component',
    'component/attribute/isIndexAttribute/component',
    'component/attribute/bindingAttribute/component',
    'component/attribute/thumbnailAttribute/component',
    'component/attribute/rowcolAttribute/component',
//    'component/attribute/rowCountAttribute/component',
    'service/EditorData',
    'service/SetAttributeInformation'
], function (app) {

    app.controller('attributePanel', ['$scope', '$rootScope', '$window', 'EditorData', 'SetAttributeInformation', function ($scope, $rootScope, $window, EditorData, SetAttributeInformation) {

        $scope.EditorData = EditorData;

        // 모델 갱신
        $scope.changeModel = function () {
            if (EditorData.focusId || EditorData.focusId === 0) {
                // 모델 적용
                var infomation = SetAttributeInformation(EditorData.focusId);
                $scope.attributeInformation = infomation.attributeInformation;
                $scope.parentArray = infomation.parentArray;
                $scope.type = infomation.type;

                // Box shadow
                var element_old_focusId, element_focusId;
                if ($scope.type === 'template') {
                    EditorData.focusId = 'canvas-content';
                }

                element_old_focusId = $('#' + EditorData.old_focusId);
                element_focusId = $('#' + EditorData.focusId);

                element_old_focusId.removeClass('focus');
                element_focusId.addClass('focus');
                EditorData.old_focusId = EditorData.focusId;

            }
        };

        // 모델 갱신 리스너
        $rootScope.$on('changeAttributePanelModel', function () {
            $scope.changeModel();
        });

        $rootScope.$on('deleteItemOnKey', function (e, id) {
            $scope.deleteItem(id);
        });

        // 선택된 것이 바뀔때마다 모델을 갱신
        $scope.$watch('EditorData.focusId', function () {
            $scope.changeModel();
        }, true);

        $scope.editArticle = function () {
            $scope.$emit('editTemplate', $scope.attributeInformation._template_id);
        };

        $scope.deleteItem = function (id) {
            // z index 처리
            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder > $scope.attributeInformation.zOrder) {
                    $scope.parentArray[key].zOrder--;
                }
            }
            EditorData.end_zOrder--;

            if (isTemplateEditor(window.location.href)) {
                deleteItem(id);
            } else {
                deleteArticle(id);
            }
            EditorData.focusId = 'canvas-content';
        };

        function deleteArticle(id) {
            $('#' + EditorData.focusId).remove();
            EditorData.childArr[id].state = 'del';
        }

        function deleteItem(id) {
            $('#' + EditorData.focusId).remove();
            EditorData.templateItemArray[id].state = 'del';
        }

        function isTemplateEditor(url) {
            if (url.indexOf('TemplateEditor') >= 0) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.goFront = function () {

            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder === $scope.attributeInformation.zOrder + 1) {
                    $scope.parentArray[key].zOrder--;
                    $scope.attributeInformation.zOrder++;
                    return;
                }
            }
            console.log('더이상 앞으로 갈수가 없습니다.', $scope);
        };

        $scope.goBack = function () {

            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder === $scope.attributeInformation.zOrder - 1) {
                    $scope.parentArray[key].zOrder++;
                    $scope.attributeInformation.zOrder--;
                    return;
                }
            }
            console.log('더이상 뒤로 갈수가 없습니다.', $scope);
        };

        $scope.goFirst = function () {

            // z index 처리

            // 뒤에 있는 것들을 앞으로 하나씩 땡김
            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder < $scope.attributeInformation.zOrder) {
                    $scope.parentArray[key].zOrder++;
                }
            }

            // 자신을 start로
            $scope.attributeInformation.zOrder = EditorData.start_zOrder + 1;

        };

        $scope.goEnd = function () {

            // z index 처리

            // 앞에 있는 것들을 뒤로 하나씩 땡김
            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder > $scope.attributeInformation.zOrder) {
                    $scope.parentArray[key].zOrder--;
                }
            }

            // 자신을 end로
            $scope.attributeInformation.zOrder = EditorData.end_zOrder;
        };

        $scope.editTemplate = function (template) {
            EditorData.template = template;
            EditorData.templateState = 'edit';
            $window.location.href = "#/TemplateEditor";
        };
    }]);

    app.directive('attributePanel', function () {
        return {
            restrict: 'A',
            templateUrl: require.toUrl('component/attributePanel/template.html'),
            controller: 'attributePanel'
        };
    });

});