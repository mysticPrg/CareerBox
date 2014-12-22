/**
 * Created by careerBox on 2014-10-18.
 */

require.config({
    baseUrl: '../js',

    paths: {
        'angular': '../libs/angular/angular',
        'angular-route': '../libs/angular/angular-route',
        'angular-bootstrap': '../libs/bootstrap/ui-bootstrap',
        'angular-upload': '../libs/angular/angular-file-upload',
        'jquery': '../libs/jquery/jquery.min',
        'jquery-ui': '../libs/jquery/jquery-ui.min',
        'domReady': '../libs/require/domReady',
        'twitter-bootstrap': '../libs/bootstrap/bootstrap.min',
        'kendo': '../libs/kendo/js/kendo.custom',
        'ngGrid': '../libs/ngGrid/ng-grid',
        'facebook': '../libs/facebook/angular-facebook',
        'rotatable': '../libs/jquery/rotatable/jquery.ui.rotatable.min',
        'component': '../component',
        'classes': '../../../src/classes',
        'service': 'services'
    },

    shim: {
        'facebook': {
            deps: ['angular'],
            exports: 'facebook'
        },
        // grunt custom:splitter,calendar,angular,fx,window,progressbar,colorpicker,notification,tooltip
        'kendo': {
            deps: ['angular', 'jquery', '../libs/kendo/js/cultures/kendo.culture.ko-KR.min'],
            exports: 'kendo'
        },
        'ngGrid': {
            deps: ['angular', 'jquery'],
            exports: 'ngGrid'
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
            deps: ['angular', '../libs/angular/angular-file-upload-shim'],
            exports: 'ngRoute'
        },

        'angular-upload': {
            deps: ['angular'],
            exports: 'angular-upload'
        },

        'rotatable': {
            deps: ['jquery', 'jquery-ui'],
            exports: 'rotatable'
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
    'jquery',
    'classes',
    'service/services'

], function ($) {

    var cntl = $('body').attr('ng-controller');

    require([
            'controllers/' + cntl
    ], function () {
        require(['bootstrap'])
    });
});