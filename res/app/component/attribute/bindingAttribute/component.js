
define([
    'app',
    'classes/Enums/InfoCategory',
    'services/getAttributeNames',
    'services/EditorData'
], function (app, InfoCategory) {

    app.directive('bindingAttribute', function (getAttributeNames, EditorData) {
        return {
            restrict: 'A',
            scope: {
                data : "=to",
                layoutType : "=type"

            },
            templateUrl: require.toUrl('component/attribute/bindingAttribute/template.html'),
            link: function ($scope, element, att) {
                console.log('binding Attribute $scope', $scope);

                $scope.infoCategory = InfoCategory;
                $scope.category = '';
                $scope.setCategory = function(){
                    // 템플릿에 카테고리를 매칭
                    $scope.data.bindingType = $scope.category;
                };

                $scope.clear = function() {
                    $scope.data.bindingType = '';
                };

                // 속성 이름들 모두 가져오기
                $scope.EditorData = EditorData;
                $scope.$watch('EditorData.focusId',function(){
                    $scope.attributeNames = getAttributeNames(EditorData.template.target.bindingType.infoType);    // 상위 아티클의 바인딩타입이 들어가야함.
                },true);

                $scope.setAttributeName = function() {
                    // 아이템에 속성이름을 매칭
                    for(var key in $scope.attributeNames){
                        if($scope.attributeNames[key] == $scope.attributeName){
//                            console.log('key', key)
//                            console.log('EditorData.template.target.bindingType', EditorData.template.target.bindingType)

                            $scope.data.bindingType = EditorData.template.target.bindingType[key];
                        }
                    }
                };
            }
        };
    });

});