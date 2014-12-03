
define([
    'app'
], function (app) {

    app.directive('alphaAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/alphaAttribute/template.html')
        };
    });

});