/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-11.
 */
define([
    'jquery',
    'angular',
    'app',
    'bootstrap',
    'component/menu/component',
    'service/InformationData',
    'service/GetInformation',
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
], function ($, ng, app) {
    app.controller('informationManager', ['$scope', '$http', '$q', 'InformationData', 'GetInformation', function ($scope, $http, $q, InformationData, GetInformation) {
        $scope.initialize = function () {
            $('#informationTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                $scope.load(e.target.getAttribute('id'));
            });

            $scope.transition('personalInfo');
        };

        $scope.transition = function (link){
            $('#'+link).click();
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $("#tabContent > div").hide(); // Initially hide all content
        $("#informationTab li:first").attr("id","current"); // Activate first tab
        $("#tabContent > div:first").fadeIn(); // Show first tab content

        $('#informationTab a').click(function(e) {
            e.preventDefault();
            $("#tabContent > div").hide(); //Hide all content
            $("#informationTab li").attr("id",""); //Reset id's
            $(this).parent().attr("id","current"); // Activate this
            $('#' + $(this).attr('title')).fadeIn(); // Show content for current tab
        });






        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.load = function (info) {
            if (info === 'personalInfo') {
                GetInformation.loadPersonalInfo();
            }else if(info === 'schoolInfo'){
                GetInformation.loadSchoolInfo();
            }else if(info === 'workingInfo'){
                GetInformation.loadWorkingInfo();
            }else if(info === 'abilityInfo'){
                GetInformation.loadAbilityInfo();
            }else if(info === 'awardInfo'){
                GetInformation.loadAwardInfo();
            }else if(info === 'activityInfo'){
                GetInformation.loadActivityInfo();
            }else if(info === 'projectInfo'){
                GetInformation.loadProjectInfo();
            }else if(info === 'columnInfo'){
                GetInformation.loadColumnInfo();
            }

        };

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

        };

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
        }

        function saveAbilityInfo() {
            var saveCertificationAbilityPromiss = $http.post('http://210.118.74.166:8123/info/certificationAbility', {certificationAbilityInfo: InformationData.certificateAbilityInfo}, {withCredentials: true});
            var saveProficiencyPromiss = $http.post('http://210.118.74.166:8123/info/proficiency', {proficiencyInfo: InformationData.proficiencyInfo}, {withCredentials: true});
            var saveComputerAbilityPromiss = $http.post('http://210.118.74.166:8123/info/computerAbility', {computerAbilityInfo: InformationData.computerAbilityInfo}, {withCredentials: true});
            var savePaperAbilityPromiss = $http.post('http://210.118.74.166:8123/info/paperAbility', {paperAbilityInfo: InformationData.paperAbilityInfo}, {withCredentials: true});

            $q.all([saveCertificationAbilityPromiss, saveProficiencyPromiss, saveComputerAbilityPromiss, savePaperAbilityPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        }

        function saveAwardInfo() {
            var saveScholarshipPromiss = $http.post('http://210.118.74.166:8123/info/scholarship', {scholarshipInfo: InformationData.scholarshipInfo}, {withCredentials: true});
            var saveAwardPromiss = $http.post('http://210.118.74.166:8123/info/award', {awardInfo: InformationData.awardInfo}, {withCredentials: true});

            $q.all([saveScholarshipPromiss, saveAwardPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        }

        function saveActivityInfo() {
            var saveLocalActivityPromiss = $http.post('http://210.118.74.166:8123/info/localActivity', {localActivityInfo: InformationData.localActivityInfo}, {withCredentials: true});
            var saveGlobalActivityPromiss = $http.post('http://210.118.74.166:8123/info/globalActivity', {globalActivityInfo: InformationData.globalActivityInfo}, {withCredentials: true});

            $q.all([saveLocalActivityPromiss, saveGlobalActivityPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        }

        function saveProjectInfo() {
            var saveProjectPromiss = $http.post('http://210.118.74.166:8123/info/project', {projectInfo: InformationData.projectInfo}, {withCredentials: true});

            $q.all([saveProjectPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        }

        function saveColumnInfo() {
            var saveColumnPromiss = $http.post('http://210.118.74.166:8123/info/column', {columnInfo: InformationData.columnInfo}, {withCredentials: true});

            $q.all([saveColumnPromiss]).then(function (resultArray) {
                resultCheck(resultArray);
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function resultCheck(resultArray){
            var returnCode;
            angular.forEach(resultArray, function (value) {
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
