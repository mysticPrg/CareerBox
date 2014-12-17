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
                $scope.load(e.target.getAttribute('id'));
            });

            $scope.transition('personalInfo');
        }

        $scope.transition = function (link){
            $('#'+link).click();
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
            }else if(info === 'awardInfo'){
                loadAwardInfo();
            }else if(info === 'activityInfo'){
                loadActivityInfo();
            }else if(info === 'projectInfo'){
                loadProjectInfo();
            }else if(info === 'columnInfo'){
                loadColumnInfo();
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

        function loadAwardInfo() {
            var loadScholarshipPromiss = $http.get('http://210.118.74.166:8123/info/scholarship', {withCredentials: true});
            var loadAwardPromiss = $http.get('http://210.118.74.166:8123/info/award', {withCredentials: true});

            $q.all([loadScholarshipPromiss, loadAwardPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.scholarshipInfo = resultArray[0].data.result;
                if(resultArray[1].data.result !== null)
                    InformationData.awardInfo = resultArray[1].data.result;
            });
        }

        function loadActivityInfo() {
            var loadLocalActivityPromiss = $http.get('http://210.118.74.166:8123/info/localActivity', {withCredentials: true});
            var loadGlobalActivityPromiss = $http.get('http://210.118.74.166:8123/info/globalActivity', {withCredentials: true});

            $q.all([loadLocalActivityPromiss, loadGlobalActivityPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.localActivityInfo = resultArray[0].data.result;
                if(resultArray[1].data.result !== null)
                    InformationData.globalActivityInfo = resultArray[1].data.result;
            });
        }

        function loadProjectInfo() {
            var loadProjectPromiss = $http.get('http://210.118.74.166:8123/info/project', {withCredentials: true});

            $q.all([loadProjectPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.projectInfo = resultArray[0].data.result;
            });
        }

        function loadColumnInfo() {
            var loadColumnPromiss = $http.get('http://210.118.74.166:8123/info/column', {withCredentials: true});

            $q.all([loadColumnPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null)
                    InformationData.columnInfo = resultArray[0].data.result;
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
            }else if(info === 'awardInfo'){
                saveAwardInfo();
            }else if(info === 'activityInfo'){
                saveActivityInfo();
            }else if(info === 'projectInfo'){
                saveProjectInfo();
            }else if(info === 'columnInfo'){
                saveColumnInfo();
            }

        }

        function savePersonalInfo() {
            var savePersonalPromiss = $http.post('http://210.118.74.166:8123/info/personal', {personalInfo: InformationData.personalInfo}, {withCredentials: true});
            var saveAdditionalPromiss = $http.post('http://210.118.74.166:8123/info/additional', {additionalInfo: InformationData.additionalInfo}, {withCredentials: true});

            $q.all([savePersonalPromiss, saveAdditionalPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        }

        function saveSchoolInfo() {
            var saveHighSchoolPromiss = $http.post('http://210.118.74.166:8123/info/highSchool', {highSchoolInfo: InformationData.highSchoolInfo}, {withCredentials: true});
            var saveUnivSchoolPromiss = $http.post('http://210.118.74.166:8123/info/univSchool', {univSchoolInfo: InformationData.univSchoolInfo}, {withCredentials: true});

            $q.all([saveHighSchoolPromiss, saveUnivSchoolPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        }

        function saveWorkingInfo() {
            var saveWorkingPromiss = $http.post('http://210.118.74.166:8123/info/working', {workingInfo: InformationData.workingInfo}, {withCredentials: true});

            $q.all([saveWorkingPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        };

        function saveAbilityInfo() {
            var saveCertificationAbilityPromiss = $http.post('http://210.118.74.166:8123/info/certificationAbility', {certificationAbilityInfo: InformationData.certificateAbilityInfo}, {withCredentials: true});
            var saveProficiencyPromiss = $http.post('http://210.118.74.166:8123/info/proficiency', {proficiencyInfo: InformationData.proficiencyInfo}, {withCredentials: true});
            var saveComputerAbilityPromiss = $http.post('http://210.118.74.166:8123/info/computerAbility', {computerAbilityInfo: InformationData.computerAbilityInfo}, {withCredentials: true});
            var savePaperAbilityPromiss = $http.post('http://210.118.74.166:8123/info/paperAbility', {paperAbilityInfo: InformationData.paperAbilityInfo}, {withCredentials: true});

            $q.all([saveCertificationAbilityPromiss, saveProficiencyPromiss, saveComputerAbilityPromiss, savePaperAbilityPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        };

        function saveAwardInfo() {
            var saveScholarshipPromiss = $http.post('http://210.118.74.166:8123/info/scholarship', {scholarshipInfo: InformationData.scholarshipInfo}, {withCredentials: true});
            var saveAwardPromiss = $http.post('http://210.118.74.166:8123/info/award', {awardInfo: InformationData.awardInfo}, {withCredentials: true});

            $q.all([saveScholarshipPromiss, saveAwardPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        };

        function saveActivityInfo() {
            var saveLocalActivityPromiss = $http.post('http://210.118.74.166:8123/info/localActivity', {localActivityInfo: InformationData.localActivityInfo}, {withCredentials: true});
            var saveGlobalActivityPromiss = $http.post('http://210.118.74.166:8123/info/globalActivity', {globalActivityInfo: InformationData.globalActivityInfo}, {withCredentials: true});

            $q.all([saveLocalActivityPromiss, saveGlobalActivityPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        };

        function saveProjectInfo() {
            var saveProjectPromiss = $http.post('http://210.118.74.166:8123/info/project', {projectInfo: InformationData.projectInfo}, {withCredentials: true});

            $q.all([saveProjectPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        };

        function saveColumnInfo() {
            var saveColumnPromiss = $http.post('http://210.118.74.166:8123/info/column', {columnInfo: InformationData.columnInfo}, {withCredentials: true});

            $q.all([saveColumnPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function resultCheck(resultArray){
            var returnCode;
            angular.forEach(resultArray, function (value, key) {
                returnCode = value.data.returnCode;
            });

            if(returnCode === '000'){
                showSuccessNotification();
            }else{
                showFailNotification();
            }
        }
        function showSuccessNotification() {
            var notification = kendo.toString('성공하였습니다.');
            $scope.noti.show(notification, "info");
        }

        function showFailNotification() {
            var notification = kendo.toString('실패하였습니다.');
            $scope.noti.show(notification, "error");
        }
    }]);
});
