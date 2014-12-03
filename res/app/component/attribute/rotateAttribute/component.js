
define([
    'app'
], function (app) {

    app.directive('rotateAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/rotateAttribute/template.html')
        };
    });

});