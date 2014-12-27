/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-04.
 */
define(['app','service/serverURL'], function(app) {
    app.factory('deletePaper', ['serverURL', function (serverURL) {
        return function ($http, data, callback) {
            $http({
                method: 'DELETE',
                url: serverURL + '/portfolio/paper',
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
        };
    }]);
});