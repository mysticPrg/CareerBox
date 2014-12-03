
define([
    'app'
], function (app) {

    app.directive('descriptionAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/descriptionAttribute/template.html')
        };
    });

});