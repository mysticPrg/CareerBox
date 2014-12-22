/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define(['app', 'service/WaitServer'], function (app) {
    app.factory('SaveTemplate', function (WaitServer) {
        return function ($http, template, callback) {
            WaitServer.show();
            $http({
                method: 'POST',
                url: 'http://210.118.74.166:8123/template',
                data: {template: template},
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                WaitServer.hide();
                callback(data);
            });
        }
    });
});

