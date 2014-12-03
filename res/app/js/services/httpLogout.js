/**
 * Created by gimbyeongjin on 14. 10. 24..
 */
define(['app',
    'services/serverURL'
], function(app) {
    app.factory('httpLogout', ['serverURL','$http', function (serverURL,$http) {
        return function (callback) {
            $http({
                method: 'get',
                url: serverURL + '/member/logout',
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