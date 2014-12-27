
define([
    'app'
], function (app) {

    app.directive('verticalAlignAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/verticalAlignAttribute/template.html')
        };
    });

});