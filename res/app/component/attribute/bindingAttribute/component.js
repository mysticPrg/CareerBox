
define([
    'app',
    'classes/Enums/InfoCategory',
    'services/getAvailableAttribute',
    'services/getAvailableAttribute'
], function (app, InfoCategory) {

    app.directive('bindingAttribute', function (getAvailableAttribute) {
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

                $scope.types = ['string', 'number', 'boolean', 'file', 'image', 'term', 'date'];
                $scope.type;

                $scope.result;

                $scope.setCategory = function(){
                    // 템플릿에 카테고리를 매칭
                    $scope.data.bindingType = $scope.category;
                    console.log('$scope.data.bindingType', $scope.data.bindingType);
                }

                $scope.clear = function() {
                    $scope.data.bindingType = '';
                }
            }
        };
    });

});