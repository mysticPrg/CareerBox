/**
 * Created by careerBox on 2014-10-18.
 */

define([
    'jquery',
    'angular',
    'app',
    'directives/version',
    'component/menu/component'
], function(
    $,
    ng,
    app
) {
    app.controller('index', function($scope) {
        $scope.testvalue = 'hello world!';
    });
});