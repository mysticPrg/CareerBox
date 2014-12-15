/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-16.
 */
define(['app'], function (app) {
    app.factory('savePersonal', function () {
        return function ($http, personalInfo, callback) {
            $http({
                method: 'POST',
                url: 'http://210.118.74.166:8123/info/personal',
                data: {personalInfo : personalInfo},
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        }
    });
});

