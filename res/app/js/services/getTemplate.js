/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-23.
 */
define(['app'], function (app) {
    app.factory('getTemplate', function () {
        return function ($http, _id, callback) {
            $http({
                method: 'GET',
                url: 'http://210.118.74.166:8123/template/preview/' + _id,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        };
    });
});