/**
 * Created by JEONGBORAM-PC-W1 on 2014-10-24.
 */
define(['app', 'service/serverURL'], function (app) {
    app.factory('LoadPaper', ['serverURL', function (serverURL) {
        return function ($http, paperId, callback) {
            $http({
                method: 'GET',
                url: serverURL + '/portfolio/paper/' + paperId,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        };
    }]);
});
