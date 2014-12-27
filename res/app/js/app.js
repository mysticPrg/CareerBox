/**
 * Created by careerBox on 2014-10-18.
 */
define([
    'angular',
    'angular-route',
    'angular-upload',
    'twitter-bootstrap',
    'kendo',
    'ngGrid',
    'angular-bootstrap',
    'facebook'
], function (ng) {
    'use strict';

    var app = ng.module('myApp', ['kendo.directives', 'ngGrid', 'ui.bootstrap', 'facebook', 'ngRoute', 'angularFileUpload']);

    app.config(function (FacebookProvider) {
        // Set your appId through the setAppId method or
        // use the shortcut in the initialize method directly.
        FacebookProvider.init('883004338385143');
    });

    kendo.culture("ko-KR")

    return app;
});