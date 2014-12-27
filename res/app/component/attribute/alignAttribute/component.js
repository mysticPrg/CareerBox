
define([
    'app'
], function (app) {

    app.directive('alignAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/alignAttribute/template.html'),
        };
    });

});