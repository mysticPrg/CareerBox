/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-20.
 */
define(['app', 'services/serverURL'], function (app) {
    app.factory('getInformationByType', ['serverURL', function (serverURL) {
        return function ($http, infoType, callback) {
            var type = infoType.split('Info')[0];
            $http({
                method: 'GET',
                url: serverURL + '/info/' + type,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                callback(data);
            });
        }
    }]);
});