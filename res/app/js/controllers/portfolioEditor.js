define([
    'jquery',
    'angular',
    'app',
    'services/EditorData',
    'services/httpLogout',
    '../route',
    '../../component/attributePanel/component',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/CommonAttribute',
    'services/GetInformation'
], function ($, ng, app) {
    app.controller('portfolioEditor', ['$scope', '$window', 'EditorData',  'httpLogout', 'GetInformation', function ($scope, $window, EditorData, httpLogout, GetInformation) {

        $(document).ready(function () {
            EditorData.portfolio._id = window.location.href.split("id=")[1].split('#/')[0];

            $scope.templates = [];

            $scope.orientation = "horizontal";
            $scope.panes = [
                {collapsible: false, scrollable: false},
                {collapsible: true, size: "300px" }
            ];

            GetInformation.loadAllInfo();

            $scope.hrefPreview = function (){
                $window.location.href = 'portfolioPreview.html?id=' + EditorData.portfolio._id;
            }

            $scope.hrefManager = function (){
                $window.location.href = 'portfolioManager.html';
            }

            $scope.logout = function (){
                httpLogout(function(data){
                    if (data.returnCode == '000') {
                        alert("성공하였습니다.");
                        $window.location.href = 'login.html';
                    }
                });
            }
        });


    }]);

});



