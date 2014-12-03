
define([
    'app'
], function (app) {

    app.directive('radiusAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/radiusAttribute/template.html')
        };
    });

});