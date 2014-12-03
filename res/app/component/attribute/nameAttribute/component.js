
define([
    'app'
], function (app) {

    app.directive('nameAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/nameAttribute/template.html')
        };
    });

});