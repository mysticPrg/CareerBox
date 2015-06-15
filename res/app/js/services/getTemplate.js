/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-23.
 */
define(['app', 'service/serverURL'], function (app) {
    app.factory('getTemplate', ['serverURL', function (serverURL) {
        return function ($http, _id, callback) {
            $http({
                method: 'GET',
                url: serverURL + '/template/preview/' + _id,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        };
    }]);
});