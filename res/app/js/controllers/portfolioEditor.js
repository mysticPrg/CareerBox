define([
    'jquery',
    'angular',
    'app',
    'service/EditorData',
    'service/httpLogout',
    '../route',
    'component/attributePanel/component',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/CommonAttribute'
], function ($, ng, app) {
    app.controller('portfolioEditor', ['$scope', '$window', 'EditorData',  'httpLogout', function ($scope, $window, EditorData, httpLogout) {

        $(document).ready(function () {
            EditorData.portfolio._id = window.location.href.split("id=")[1].split('#/')[0];

            $scope.templates = [];

            $scope.orientation = "horizontal";
            $scope.panes = [
                {collapsible: false, scrollable: false},
                {collapsible: true, size: "300px" }
            ];

            $scope.hrefPreview = function (){
                $window.location.href = 'portfolioPreview.html?id=' + EditorData.portfolio._id;
            }

            $scope.hrefManager = function (){
                $window.location.href = 'portfolioManager.html';
            }

            $scope.logout = function (){
                httpLogout(function(data){
                    if (data.returnCode == '000') {
                        //
                        $window.location.href = 'index.html';
                    }
                });
            }

            $scope.goToPortfolio = function () {
                var href = 'portfolioPreview.html?id=' + EditorData.portfolio._id;
                $window.location.href = href;
            }

        });


    }]);

});



