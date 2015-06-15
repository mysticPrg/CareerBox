/**
 * Created by gimbyeongjin on 14. 12. 19..
 */
define([
    'jquery',
    'angular',
    'app',
    'service/InformationData',
    'service/serverURL'
], function($, ng, app) {
    app.factory('GetInformation', ['$http', '$q', 'InformationData', 'serverURL', function ($http, $q, InformationData, serverURL) {

        function loadPersonalInfo() {
            var loadPersonalPromiss = $http.get(serverURL + '/info/personal', {withCredentials: true});
            var loadAdditionalPromiss = $http.get(serverURL + '/info/additional', {withCredentials: true});

            $q.all([loadPersonalPromiss, loadAdditionalPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null){
                    InformationData.personalInfo = resultArray[0].data.result;
                }
                if(resultArray[1].data.result !== null){
                    InformationData.additionalInfo = resultArray[1].data.result;
                }
            });
        }

        function loadSchoolInfo() {
            var loadHighSchoolPromiss = $http.get(serverURL + '/info/highSchool', {withCredentials: true});
            var loadUnivSchoolPromiss = $http.get(serverURL + '/info/univSchool', {withCredentials: true});

            $q.all([loadHighSchoolPromiss, loadUnivSchoolPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null) {
                    InformationData.highSchoolInfo = resultArray[0].data.result;
                }
                if(resultArray[1].data.result !== null) {
                    InformationData.univSchoolInfo = resultArray[1].data.result;
                }
            });
        }

        function loadWorkingInfo() {
            var loadWorkingPromiss = $http.get(serverURL + '/info/working', {withCredentials: true});

            $q.all([loadWorkingPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null) {
                    InformationData.workingInfo = resultArray[0].data.result;
                }
            });
        }

        function loadAbilityInfo() {
            var loadCertificationAbilityPromiss = $http.get(serverURL + '/info/certificationAbility', {withCredentials: true});
            var loadProficiencyPromiss = $http.get(serverURL + '/info/proficiency', {withCredentials: true});
            var loadComputerAbilityPromiss = $http.get(serverURL + '/info/computerAbility', {withCredentials: true});
            var loadPaperAbilityPromiss = $http.get(serverURL + '/info/paperAbility', {withCredentials: true});

            $q.all([loadCertificationAbilityPromiss, loadProficiencyPromiss, loadComputerAbilityPromiss, loadPaperAbilityPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null) {
                    InformationData.certificateAbilityInfo = resultArray[0].data.result;
                }
                if(resultArray[1].data.result !== null) {
                    InformationData.proficiencyInfo = resultArray[1].data.result;
                }
                if(resultArray[2].data.result !== null) {
                    InformationData.computerAbilityInfo = resultArray[2].data.result;
                }
                if(resultArray[3].data.result !== null) {
                    InformationData.paperAbilityInfo = resultArray[3].data.result;
                }
            });
        }

        function loadAwardInfo() {
            var loadScholarshipPromiss = $http.get(serverURL + '/info/scholarship', {withCredentials: true});
            var loadAwardPromiss = $http.get(serverURL + '/info/award', {withCredentials: true});

            $q.all([loadScholarshipPromiss, loadAwardPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null) {
                    InformationData.scholarshipInfo = resultArray[0].data.result;
                }
                if(resultArray[1].data.result !== null) {
                    InformationData.awardInfo = resultArray[1].data.result;
                }
            });
        }

        function loadActivityInfo() {
            var loadLocalActivityPromiss = $http.get(serverURL + '/info/localActivity', {withCredentials: true});
            var loadGlobalActivityPromiss = $http.get(serverURL + '/info/globalActivity', {withCredentials: true});

            $q.all([loadLocalActivityPromiss, loadGlobalActivityPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null) {
                    InformationData.localActivityInfo = resultArray[0].data.result;
                }
                if(resultArray[1].data.result !== null) {
                    InformationData.globalActivityInfo = resultArray[1].data.result;
                }
            });
        }

        function loadProjectInfo() {
            var loadProjectPromiss = $http.get(serverURL + '/info/project', {withCredentials: true});

            $q.all([loadProjectPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null) {
                    InformationData.projectInfo = resultArray[0].data.result;
                }
            });
        }

        function loadColumnInfo() {
            var loadColumnPromiss = $http.get(serverURL + '/info/column', {withCredentials: true});

            $q.all([loadColumnPromiss]).then(function (resultArray) {
                if(resultArray[0].data.result !== null) {
                    InformationData.columnInfo = resultArray[0].data.result;
                }
            });
        }
        function loadAllInfo(){
            loadPersonalInfo();
            loadSchoolInfo();
            loadWorkingInfo();
            loadAwardInfo();
            loadAbilityInfo();
            loadActivityInfo();
            loadProjectInfo();
            loadColumnInfo();
        }

        return {
            'loadPersonalInfo'    : loadPersonalInfo,
            'loadSchoolInfo'      : loadSchoolInfo,
            'loadWorkingInfo'     : loadWorkingInfo,
            'loadAwardInfo'       : loadAwardInfo,
            'loadAbilityInfo'     : loadAbilityInfo,
            'loadActivityInfo'    : loadActivityInfo,
            'loadProjectInfo'     : loadProjectInfo,
            'loadColumnInfo'      : loadColumnInfo,
            'loadAllInfo'         : loadAllInfo
        };

    }]);
});
