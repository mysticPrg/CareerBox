
define([
    'app'
], function (app) {
    app.directive('shapeTypeAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/shapeTypeAttribute/template.html'),
            controller: function ($scope, $rootScope) {
            }
        };
    });

});