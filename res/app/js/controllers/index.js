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

        var zoomImgArr = [
            $('#zoomImg_1'),
            $('#zoomImg_2'),
            $('#zoomImg_3')
        ];

        function zoomIn(target) {
            target.stop().animate({
                width: '182px',
                height: '212px'
            }, 200, 'swing');
        }
        function zoomOut(target) {
            target.stop().animate({
                width: '122px',
                height: '152px'
            }, 200, 'swing');
        }
        function zoomOri(target) {
            target.stop().animate({
                width: '142px',
                height: '172px'
            }, 200, 'swing');
        }
        function zoomOriAll() {
            zoomOri(zoomImgArr[0]);
            zoomOri(zoomImgArr[1]);
            zoomOri(zoomImgArr[2]);
        }

        zoomImgArr[0].on('mouseover', function() {
            zoomIn(zoomImgArr[0]);
            zoomOut(zoomImgArr[1]);
            zoomOut(zoomImgArr[2]);
        });
        zoomImgArr[1].on('mouseover', function() {
            zoomOut(zoomImgArr[0]);
            zoomIn(zoomImgArr[1]);
            zoomOut(zoomImgArr[2]);
        });
        zoomImgArr[2].on('mouseover', function() {
            zoomOut(zoomImgArr[0]);
            zoomOut(zoomImgArr[1]);
            zoomIn(zoomImgArr[2]);
        });

        var i;
        for (i=0 ; i<3 ; i++) {
            zoomImgArr[i].on('mouseout', zoomOriAll);
        }

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