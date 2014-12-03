/**
 * Created by gimbyeongjin on 14. 11. 11..
 */

define(['app','services/serverURL'], function(app) {
    app.factory('createPortfolio', ['serverURL', function (serverURL) {
        return function ($http, data, callback) {
            $http({
                method: 'POST',
                url: serverURL + '/portfolio',
                data: data,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            }).error(function (data){
                callback(data);
            });
        }
    }]);
});