/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define(['app'], function (app) {
    app.factory('LoadTemplate', function () {
        return function ($http, type, callback) {
            $http({
                method: 'GET',
                url: 'http://210.118.74.166:8123/template/' + type,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        }
    });
});

