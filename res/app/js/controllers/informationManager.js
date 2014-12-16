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
    app.controller('informationManager', ['$scope', '$http', '$q', 'InformationData', function ($scope, $http, $q, InformationData) {
        $scope.initialize = function () {
            $('#informationTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            $('#personalInformationLink').click();
            loadPersonalInfo();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.load = function (info) {
            if (info === 'personalInfo') {
                loadPersonalInfo();
            }else if(info === 'schoolInfo'){
                loadSchoolInfo();
            }
        }

        function loadPersonalInfo() {
            var savePersonalPromiss = $http.get('http://210.118.74.166:8123/info/personal', {withCredentials: true});
            var saveAdditionalPromiss = $http.get('http://210.118.74.166:8123/info/additional', {withCredentials: true});

            $q.all([savePersonalPromiss, saveAdditionalPromiss]).then(function (resultArray) {
                console.log(InformationData.personalInfo);
                InformationData.personalInfo = resultArray[0].data.result;
                InformationData.additionalInfo = resultArray[1].data.result;
            });
        }

        function loadSchoolInfo() {
            var saveHighSchoolPromiss = $http.get('http://210.118.74.166:8123/info/highSchool', {withCredentials: true});

            $q.all([saveHighSchoolPromiss]).then(function (resultArray) {
                InformationData.highSchoolInfos = resultArray[0].data.result;
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.save = function (info) {
            if (info === 'personalInfo') {
//                console.log(InformationData.personalInfo);
//                console.log(InformationData.additionalInfo);
                savePersonalInfo();
            }else if(info === 'schoolInfo'){
//                console.log(InformationData.highSchoolInfo);
                saveSchoolInfo();
            }

        }

        function savePersonalInfo() {
            var savePersonalPromiss = $http.post('http://210.118.74.166:8123/info/personal', {personalInfo: InformationData.personalInfo}, {withCredentials: true});
            var saveAdditionalPromiss = $http.post('http://210.118.74.166:8123/info/additional', {additionalInfo: InformationData.additionalInfo}, {withCredentials: true});

            $q.all([savePersonalPromiss, saveAdditionalPromiss]).then(function (resultArray) {
                angular.forEach(resultArray, function (value, key) {
                    if (value.data.returnCode !== '000') {
                        return;
                    }
                });

                showNotification();
            });
        }

        function saveSchoolInfo() {
            var saveHighSchoolPromiss = $http.post('http://210.118.74.166:8123/info/highSchool', {highSchoolInfo: InformationData.highSchoolInfo}, {withCredentials: true});

            $q.all([saveHighSchoolPromiss]).then(function (resultArray) {
                angular.forEach(resultArray, function (value, key) {
                    if (value.data.returnCode !== '000') {
                        return;
                    }
                });

                showNotification();
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function showNotification() {
            var notification = kendo.toString('성공하였습니다.');
            $scope.noti.show(notification, "info");
        }


    }]);
});
