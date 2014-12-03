define(['app'], function (app) {

    var menuItems = ['New Portfolio', 'Personal Information', 'Resumes'];

    app.controller('menuController', function ($scope) {
        $scope.menuItems = menuItems;
    });

    app.directive('menu', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/menu/template.html'),
            controller: 'menuController'
        };
    });

});