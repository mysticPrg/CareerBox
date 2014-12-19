/**
 * Created by gimbyeongjin on 14. 12. 19..
 */
define([
    'jquery',
    'angular',
    'app',
    'services/InformationData'
], function($, ng, app) {
    app.factory('GetInformation', ['$http', '$q', 'InformationData', function ($http, $q, InformationData) {

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

        return {
            'loadPersonalInfo'    : loadPersonalInfo,
            'loadSchoolInfo'      : loadSchoolInfo,
            'loadWorkingInfo'     : loadWorkingInfo,
            'loadAwardInfo'       : loadAwardInfo,
            'loadAbilityInfo'     : loadAbilityInfo,
            'loadActivityInfo'    : loadActivityInfo,
            'loadProjectInfo'     : loadProjectInfo,
            'loadColumnInfo'      : loadColumnInfo
        };

    }]);
});
