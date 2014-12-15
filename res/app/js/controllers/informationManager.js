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
    'component/information/columnInformation/component',
    'services/info/savePersonal'
], function ($, ng, app, InformationData) {
    app.controller('informationManager', ['$scope', '$http', 'InformationData', 'savePersonal', function ($scope, $http, InformationData, savePersonal) {
        $scope.initialize = function () {
            $('#informationTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            $('#personalInformationLink').click();
        }

        $scope.save = function (info){
            if(info === 'personalInfo'){
                savePersonal($http, InformationData.personalInfo, function (result) {
                    console.log(result);
                });
            }

        }



    }]);
});
