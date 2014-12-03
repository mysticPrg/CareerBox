
define([
    'app'
], function (app) {

    app.directive('valueAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/valueAttribute/template.html')
        };
    });

});