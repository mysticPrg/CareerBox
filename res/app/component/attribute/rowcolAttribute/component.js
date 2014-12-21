
define([
    'app'
], function (app) {

    app.directive('rowcolAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/rowcolAttribute/template.html')
        };
    });

});