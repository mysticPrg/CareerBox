
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
            var infomation = SetAttributeInformation(EditorData.focusId);
            $scope.attributeInformation = infomation.attributeInformation;
            $scope.parentArray = infomation.parentArray;

        });

        $scope.deleteItem = function (id){
            // z index 처리
            for(var i=0 ; i < $scope.parentArray.length ; i++){
                if($scope.parentArray[i].zOrder > $scope.attributeInformation.zOrder){
                    $scope.parentArray[i].zOrder--;
                }
            }
            EditorData.end_zOrder--;

            $scope.$emit('deleteItem', id);
        };

        $scope.goFront = function () {

            for(var key in $scope.parentArray){
                if($scope.parentArray[key].zOrder == $scope.attributeInformation.zOrder + 1){
                    $scope.parentArray[key].zOrder--;
                    $scope.attributeInformation.zOrder++;
                    return;
                }
            }
            console.log('더이상 앞으로 갈수가 없습니다.' ,$scope);
        };

        $scope.goBack = function () {

            console.log('$scope' ,$scope);
            for(var key in $scope.parentArray){
                if($scope.parentArray[key].zOrder == $scope.attributeInformation.zOrder - 1){
                    $scope.parentArray[key].zOrder++;
                    $scope.attributeInformation.zOrder--;
                    return;
                }
            }
            console.log('더이상 뒤로 갈수가 없습니다.' ,$scope);
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