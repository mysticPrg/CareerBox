/**
 * Created by gimbyeongjin on 14. 11. 11..
 */

define(['app','service/serverURL'], function(app) {
    app.factory('deletePortfolio', ['serverURL', function (serverURL) {
        return function ($http, data, callback) {
            $http({
                method: 'DELETE',
                url: serverURL + '/portfolio',
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
    }]);
});