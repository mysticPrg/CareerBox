/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define(['app'], function (app) {
    app.factory('SaveTemplate', function () {
        return function ($http, template, callback) {
            $http({
                method: 'POST',
                url: 'http://210.118.74.166:8123/template',
                data: {template: template},
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        }
    });
});

