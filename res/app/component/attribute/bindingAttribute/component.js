
define([
    'app',
    'classes/Enums/InfoCategory',
    'services/getAttributeNames',
    'services/EditorData',
    'services/InformationData',
    'services/getAvailableAttribute'
], function (app, InfoCategory) {

    app.directive('bindingAttribute', function (getAttributeNames, EditorData, getAvailableAttribute, InformationData) {
        return {
            restrict: 'A',
            scope: {
                data : "=to",
                layoutType : "=type"

            },
            templateUrl: require.toUrl('component/attribute/bindingAttribute/template.html'),
            link: function ($scope, element, att) {
                console.log('binding Attribute $scope', $scope);

                console.log('InformationData', InformationData);
                $scope.infoCategory = InformationData;
                $scope.category = '';
                $scope.setCategory = function(){
                    // 템플릿에 카테고리를 매칭
                    $scope.data.bindingType = $scope.category;
                };

                // bindingType 비우기
                $scope.clear = function() {
                    $scope.data.bindingType = '';
                };

                // 속성 이름들 모두 가져오기
                $scope.EditorData = EditorData;
                $scope.$watch('EditorData.focusId',function(){
                     var data = $scope.data;
                    if(data.hasOwnProperty('itemType')){

                    }

                    try {
                        if($scope.data.itemType === "image"){
                            // key의 첫글자가 I 인 것만 가져오기
                            $scope.attributeNames = getAvailableAttribute(EditorData.template.target.bindingType.infoType, 'I');

                        } else if($scope.data.itemType === "link"){
                            // key의 첫글자가 F 인 것만 가져오기
                            $scope.attributeNames = getAvailableAttribute(EditorData.template.target.bindingType.infoType, 'F');

                        } else if($scope.data.itemType === "text"){
                            // key의 첫글자가 I,F 인 것빼고 가져오기
                            $scope.attributeNames = getAvailableAttribute(EditorData.template.target.bindingType.infoType, '-I -F');
                        }
                    } catch(exception){} // 아이템이 아닌 경우
                },true);

                // 아이템에 속성이름을 매칭
                $scope.setAttributeName = function() {
                    for(var key in $scope.attributeNames){
                        if($scope.attributeNames[key] == $scope.attributeName){
                            $scope.data.bindingType = EditorData.template.target.bindingType[key];
                        }
                    }
                };
            }
        };
    });

});