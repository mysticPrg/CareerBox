/**
 * Created by careerBox on 2014-10-19.
 */

define([
    'app',
    'services/version'
], function (app) {
    app.directive('version', function (version) {
        return function (scope, elm) {
            elm.text(version);
        };
    });
});