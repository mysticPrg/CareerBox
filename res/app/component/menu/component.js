define(['app'], function (app) {

    app.controller('menuController', function () {
    });

    app.directive('menu', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/menu/template.html'),
            controller: 'menuController'
        };
    });

});