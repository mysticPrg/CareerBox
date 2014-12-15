define([
    'jquery',
    'angular',
    'app',
    'services/EditorData',
    '../route',
    '../../component/attributePanel/component',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/CommonAttribute'
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



