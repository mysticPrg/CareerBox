
define([
    'app'
], function (app) {

    app.directive('urlAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/urlAttribute/template.html')
        };
    });

});