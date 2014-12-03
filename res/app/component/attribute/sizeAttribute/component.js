
define([
    'app'
], function (app) {

    app.directive('sizeAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/sizeAttribute/template.html')
        };
    });

});