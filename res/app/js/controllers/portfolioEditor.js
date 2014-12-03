define([
    'jquery',
    'angular',
    'app',
    'services/EditorData',
    '../route',
    '../../component/attributePanel/component'
], function ($, ng, app) {
    app.controller('portfolioEditor', ['$scope', 'EditorData', function ($scope, EditorData) {

        $(document).ready(function () {
            EditorData.portfolio._id = window.location.href.split("id=")[1].split('#/')[0];

            $scope.templates = [];

            $scope.orientation = "horizontal";
            $scope.panes = [
                {collapsible: false, scrollable: false},
                {collapsible: true, size: "300px" }
            ];
        });


    }]);

});



