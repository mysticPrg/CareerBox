/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('personalInformationController', function ($scope) {
    });

    app.directive('personalInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/personalInformation/template.html'),
            controller: 'personalInformationController'
        };
    });

});