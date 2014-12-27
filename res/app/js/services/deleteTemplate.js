/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-20.
 */

define(['app','service/serverURL'], function(app) {
    app.factory('DeleteTemplate', ['serverURL', function (serverURL) {
        return function ($http, id, callback) {
            $http({
                method: 'DELETE',
                url: serverURL + '/template',
                data: {_id: id},
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
        };
    }]);
});