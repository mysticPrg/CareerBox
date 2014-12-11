/**
 * Created by careerBox on 2014-10-18.
 */

require.config({
    baseUrl: '../js',

    paths: {
        'angular': '../libs/angular/angular',
        'angular-route': '../libs/angular/angular-route',
        'angular-bootstrap': '../libs/bootstrap/ui-bootstrap',
        'jquery': '../libs/jquery/jquery.min',
        'jquery-ui': '../libs/jquery/jquery-ui.min',
        'domReady': '../libs/require/domReady',
        'twitter-bootstrap': '../libs/bootstrap/bootstrap.min',
        'kendo': '../libs/kendo/js/kendo.custom',
        'facebook': '../libs/facebook/angular-facebook',

        'component': '../component',
        'classes': '../../../src/classes'
    },

    shim: {
        'facebook': {
            deps: ['angular'],
            exports: 'facebook'
        },

        'kendo': {
            deps: ['angular', 'jquery', '../libs/kendo/js/cultures/kendo.culture.ko-KR.min'],
            exports: 'kendo'
        },
        'angular-bootstrap': {
            deps: ['angular'],
            exports: 'angular-bootstrap'
        },
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },

        'angular-route': {
            deps: ['angular'],
            exports: 'ngRoute'
        },

        'jquery-ui': {
            deps: ['jquery'],
            exports: 'jquery-ui'
        },

        'twitter-bootstrap': {
            deps: ['jquery'],
            exports: 'twitter-bootstrap'
        }
    }
});

require([
    'jquery'
], function ($) {

    var cntl = $('body').attr('ng-controller');

    require([
        'controllers/' + cntl
    ], function () {
        require(['bootstrap'])
    });
});