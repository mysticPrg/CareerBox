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
    'services/EditorData',
    'services/SetAttributeInformation'
], function (app) {

    app.controller('attributePanel', ['$scope', '$rootScope', '$window', 'EditorData', 'SetAttributeInformation', function ($scope, $rootScope, $window, EditorData, SetAttributeInformation) {

        $scope.EditorData = EditorData;

        $scope.$watch('EditorData.focusId', function () {
            if(EditorData.focusId){
                var infomation = SetAttributeInformation(EditorData.focusId);
                $scope.attributeInformation = infomation.attributeInformation;
                $scope.parentArray = infomation.parentArray;
                $scope.type = infomation.type;
            }
        }, true);

        $scope.deleteItem = function (id) {
            // z index 처리
            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder > $scope.attributeInformation.zOrder) {
                    $scope.parentArray[key].zOrder--;
                }
            }

            EditorData.end_zOrder--;

            if (window.location.href.split("#/")[1] == 'TemplateEditor') {
                EditorData.focusId = EditorData.template._id;
                $scope.$emit('deleteItem', id);
            } else {
                EditorData.focusId = EditorData.paperId;
                $scope.$emit('deleteArticle', id);
            }

        };

        $scope.goFront = function () {

            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder == $scope.attributeInformation.zOrder + 1) {
                    $scope.parentArray[key].zOrder--;
                    $scope.attributeInformation.zOrder++;
                    return;
                }
            }
            console.log('더이상 앞으로 갈수가 없습니다.', $scope);
        };

        $scope.goBack = function () {

            for (var key in $scope.parentArray) {
                if ($scope.parentArray[key].zOrder == $scope.attributeInformation.zOrder - 1) {
                    $scope.parentArray[key].zOrder++;
                    $scope.attributeInformation.zOrder--;
                    return;
                }
            }
            console.log('더이상 뒤로 갈수가 없습니다.', $scope);
        }

        $scope.editTemplate = function (template) {
            EditorData.template = template;
            EditorData.templateState = 'edit';
            $window.location.href = "#/TemplateEditor";
        }
    }]);

    app.directive('attributePanel', function () {
        return {
            restrict: 'A',
            templateUrl: require.toUrl('component/attributePanel/template.html'),
            controller: 'attributePanel'
        };
    });

});