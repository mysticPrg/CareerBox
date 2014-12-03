/**
 * Created by careerBox on 2014-10-19.
 */

define([
    'angular',
    'app'
], function (ng, app) {
    'use strict';


    require(['domReady'], function (document) {
        ng.bootstrap(document, ['myApp']);
    });
});