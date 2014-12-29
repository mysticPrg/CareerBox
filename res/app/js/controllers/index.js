/**
 * Created by careerBox on 2014-10-18.
 */

define([
    'jquery',
    'angular',
    'app',
    'component/tutorialModal/component'
], function ($, ng, app, tutorialModal) {
    app.controller('index', ['$scope', '$modal', function ($scope, $modal) {
        $scope.tutorial = function () {
            var modalInstance = $modal.open(tutorialModal);
            modalInstance.result.then(function () {
            }, function () {
            });
        };

        $('.overImg').on('mouseover', function (e) {
            $(e.target).stop().animate({
                top: '-30px'
            }, 200);
        });
        $('.overImg').on('mouseout', function (e) {
            $(e.target).stop().animate({
                top: '0px'
            }, 200);
        });

        $('#sampleBtn1').on('mouseover', function () {
            $('#samplePaperImg_1').stop().fadeIn('fast');
        });
        $('#sampleBtn2').on('mouseover', function () {
            $('#samplePaperImg_2').stop().fadeIn('fast');
        });
        $('#sampleBtn3').on('mouseover', function () {
            $('#samplePaperImg_3').stop().fadeIn('fast');
        });
        $('#sampleBtn4').on('mouseover', function () {
            $('#samplePaperImg_4').stop().fadeIn('fast');
        });

        $('#sampleBtn1').on('mouseout', function () {
            $('#samplePaperImg_1').stop().fadeOut('fast');
        });
        $('#sampleBtn2').on('mouseout', function () {
            $('#samplePaperImg_2').stop().fadeOut('fast');
        });
        $('#sampleBtn3').on('mouseout', function () {
            $('#samplePaperImg_3').stop().fadeOut('fast');
        });
        $('#sampleBtn4').on('mouseout', function () {
            $('#samplePaperImg_4').stop().fadeOut('fast');
        });
    }]);
});