/**
 * Created by JEONGBORAM-PC-W1 on 2014-10-24.
 */
define(['app'], function (app) {
    app.factory('SetIndex', function ($http) {
        return function (data, callback) {
            console.log('data', data)
            $http({
                method: 'POST',
                url: 'http://210.118.74.166:8123/portfolio/paper/setIndex',
                data: data,
                responseType: 'json',
                withCredentials: true
            }).success(function (result) {
                callback(result);
            });
        }
    });
});
