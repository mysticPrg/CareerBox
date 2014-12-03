define([
    'app'
], function (app) {

    app.directive('posAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/posAttribute/template.html')
        };
    });

});
