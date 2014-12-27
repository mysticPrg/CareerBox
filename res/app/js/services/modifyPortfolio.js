/**
 * Created by gimbyeongjin on 14. 11. 11..
 */

define(['app','service/serverURL'], function(app) {
    app.factory('modifyPortfolio', ['serverURL', function (serverURL) {
        return function ($http, data, callback) {
            $http({
                method: 'PUT',
                url: serverURL + '/portfolio',
                data: data,
                responseType: 'json',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (data) {
                callback(data);
            });
        };
    }]);
});