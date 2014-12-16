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
            }else if(info === 'workingInfo'){
                loadWorkingInfo();
            }else if(info === 'abilityInfo'){
                loadAbilityInfo();
            }
        }

        function loadPersonalInfo() {
            var loadPersonalPromiss = $http.get('http://210.118.74.166:8123/info/personal', {withCredentials: true});
            var loadAdditionalPromiss = $http.get('http://210.118.74.166:8123/info/additional', {withCredentials: true});

            $q.all([loadPersonalPromiss, loadAdditionalPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.personalInfo = resultArray[0].data.result;
                if(resultArray[1].data.result !== null)
                    InformationData.additionalInfo = resultArray[1].data.result;
            });
        }

        function loadSchoolInfo() {
            var loadHighSchoolPromiss = $http.get('http://210.118.74.166:8123/info/highSchool', {withCredentials: true});
            var loadUnivSchoolPromiss = $http.get('http://210.118.74.166:8123/info/univSchool', {withCredentials: true});

            $q.all([loadHighSchoolPromiss, loadUnivSchoolPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.highSchoolInfo = resultArray[0].data.result;

                if(resultArray[1].data.result !== null)
                    InformationData.univSchoolInfo = resultArray[1].data.result;
            });
        }

        function loadWorkingInfo() {
            var loadWorkingPromiss = $http.get('http://210.118.74.166:8123/info/working', {withCredentials: true});

            $q.all([loadWorkingPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.workingInfo = resultArray[0].data.result;
            });
        }

        function loadAbilityInfo() {
            var loadCertificationAbilityPromiss = $http.get('http://210.118.74.166:8123/info/certificationAbility', {withCredentials: true});
            var loadProficiencyPromiss = $http.get('http://210.118.74.166:8123/info/proficiency', {withCredentials: true});
            var loadComputerAbilityPromiss = $http.get('http://210.118.74.166:8123/info/computerAbility', {withCredentials: true});
            var loadPaperAbilityPromiss = $http.get('http://210.118.74.166:8123/info/paperAbility', {withCredentials: true});

            $q.all([loadCertificationAbilityPromiss, loadProficiencyPromiss, loadComputerAbilityPromiss, loadPaperAbilityPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.certificateAbilityInfo = resultArray[0].data.result;
                if(resultArray[1].data.result !== null)
                    InformationData.proficiencyInfo = resultArray[1].data.result;
                if(resultArray[2].data.result !== null)
                    InformationData.computerAbilityInfo = resultArray[2].data.result;
                if(resultArray[3].data.result !== null)
                    InformationData.paperAbilityInfo = resultArray[3].data.result;
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.save = function (info) {
            if (info === 'personalInfo') {
                savePersonalInfo();
            }else if(info === 'schoolInfo'){
                saveSchoolInfo();
            }else if(info === 'workingInfo'){
                saveWorkingInfo();
            }else if(info === 'abilityInfo'){
                saveAbilityInfo();
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
            var saveUnivSchoolPromiss = $http.post('http://210.118.74.166:8123/info/univSchool', {univSchoolInfo: InformationData.univSchoolInfo}, {withCredentials: true});

            $q.all([saveHighSchoolPromiss, saveUnivSchoolPromiss]).then(function (resultArray) {
                angular.forEach(resultArray, function (value, key) {
                    if (value.data.returnCode !== '000') {
                        return;
                    }
                });

                showNotification();
            });
        }

        function saveWorkingInfo() {
            var saveWorkingPromiss = $http.post('http://210.118.74.166:8123/info/working', {workingInfo: InformationData.workingInfo}, {withCredentials: true});

            $q.all([saveWorkingPromiss]).then(function (resultArray) {
                angular.forEach(resultArray, function (value, key) {
                    if (value.data.returnCode !== '000') {
                        return;
                    }
                });

                showNotification();
            });
        };

        function saveAbilityInfo() {
            var saveCertificationAbilityPromiss = $http.post('http://210.118.74.166:8123/info/certificationAbility', {certificationAbilityInfo: InformationData.certificateAbilityInfo}, {withCredentials: true});
            var saveProficiencyPromiss = $http.post('http://210.118.74.166:8123/info/proficiency', {proficiencyInfo: InformationData.proficiencyInfo}, {withCredentials: true});
            var saveComputerAbilityPromiss = $http.post('http://210.118.74.166:8123/info/computerAbility', {computerAbilityInfo: InformationData.computerAbilityInfo}, {withCredentials: true});
            var savePaperAbilityPromiss = $http.post('http://210.118.74.166:8123/info/paperAbility', {paperAbilityInfo: InformationData.paperAbilityInfo}, {withCredentials: true});

            $q.all([saveCertificationAbilityPromiss, saveProficiencyPromiss, saveComputerAbilityPromiss, savePaperAbilityPromiss]).then(function (resultArray) {
                angular.forEach(resultArray, function (value, key) {
                    if (value.data.returnCode !== '000') {
                        return;
                    }
                });

                showNotification();
            });
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function showNotification() {
            var notification = kendo.toString('성공하였습니다.');
            $scope.noti.show(notification, "info");
        }
    }]);
});
