
define([
    'app'
], function (app) {

    app.directive('titleAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/titleAttribute/template.html')
        };
    });

});