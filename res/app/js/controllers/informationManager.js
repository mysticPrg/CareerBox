/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-11.
 */
define([
    'jquery',
    'angular',
    'app',
    'bootstrap',
    'component/menu/component',
    'services/InformationData',
    'component/information/personalInformation/component',
    'component/information/additionalInformation/component',
    'component/information/highSchoolInformation/component',
    'component/information/universityInformation/component',
    'component/information/workingInformation/component',
    'component/information/certificateAbilityInformation/component',
    'component/information/proficiencyInformation/component',
    'component/information/computerAbilityInformation/component',
    'component/information/paperAbilityInformation/component',
    'component/information/scholarshipInformation/component',
    'component/information/awardInformation/component',
    'component/information/localActivityInformation/component',
    'component/information/globalActivityInformation/component',
    'component/information/projectInformation/component',
    'component/information/columnInformation/component'
], function ($, ng, app, InformationData) {
    app.controller('informationManager', ['$scope', '$http', '$q', 'InformationData', 'savePersonal', 'saveAdditional', function ($scope, $http, $q, InformationData, savePersonal, saveAdditional) {
        $scope.initialize = function () {
            $('#informationTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            $('#personalInformationLink').click();
        }

        $scope.save = function (info) {
            var savePersonalPromiss = $http.post('http://210.118.74.166:8123/info/personal', {personalInfo :InformationData.personalInfo});
            var saveAdditionalPromiss = $http.post('http://210.118.74.166:8123/info/additional', {additionalInfo :InformationData.additionalInfo});

            $q.all([savePersonalPromiss, saveAdditionalPromiss]).then(function (resultArray) {
                angular.forEach(resultArray, function (value, key) {
                    if(value.data.returnCode !== '000'){
                        return;
                    }
                });

                showNotification();
            });
        }

        function showNotification() {
            var notification = kendo.toString('성공하였습니다.');
            $scope.noti.show(notification, "info");
        }


    }]);
});
