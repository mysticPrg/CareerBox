/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-04.
 */
define(['app','services/serverURL'], function(app) {
    app.factory('deleteImage', function ($http, serverURL) {
        return function (data, callback) {
            $http({
                method: 'DELETE',
                url: serverURL + '/image',
                data: data,
                responseType: 'json',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (data) {
                callback(data);
            }).error(function(data) {
                callback(data);
            });
        }
    });
});