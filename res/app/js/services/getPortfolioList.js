/**
 * Created by gimbyeongjin on 14. 11. 11..
 */
define(['app','services/serverURL'], function(app) {
    app.factory('getPortfolioList', ['serverURL', function (serverURL) {
        return function ($http, callback) {
            $http({
                method: 'GET',
                url: serverURL + '/portfolio',
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            }).error(function(data) {
                callback(data);
            });
        }
    }]);
});