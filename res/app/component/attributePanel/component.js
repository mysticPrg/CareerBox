
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

    app.controller('attributePanel', ['$scope', '$rootScope', 'EditorData', 'SetAttributeInformation', function ($scope, $rootScope, EditorData, SetAttributeInformation) {

        $scope.EditorData = EditorData;

        $scope.$watch('EditorData.focusId', function(){
            $scope.attributeInformation = SetAttributeInformation(EditorData.focusId);
        });

        $scope.deleteItem = function (id){
            // z index 처리
            for(var i=0 ; i < EditorData.templateItemArray.length ; i++){
                if(EditorData.templateItemArray[i].zOrder > $scope.attributeInformation.zOrder){
                    EditorData.templateItemArray[i].zOrder--;
                }
            }
            EditorData.end_zOrder--;

            $scope.$emit('deleteItem', id);
        };

        $scope.goFront = function () {

            for(var i=0 ; i < EditorData.templateItemArray.length ; i++){
                if(EditorData.templateItemArray[i].zOrder == $scope.attributeInformation.zOrder + 1){
                    EditorData.templateItemArray[i].zOrder--;
                    $scope.attributeInformation.zOrder++;
                    return;
                }
            }

        };

        $scope.goBack = function () {

            for(var i=0 ; i < EditorData.templateItemArray.length ; i++){
                if(EditorData.templateItemArray[i].zOrder == $scope.attributeInformation.zOrder - 1){
                    EditorData.templateItemArray[i].zOrder++;
                    $scope.attributeInformation.zOrder--;
                    return;
                }
            }
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