/**
 * Created by JEONGBORAM-PC-W1 on 2014-10-24.
 */
define(['app', 'service/WaitServer', 'service/serverURL'], function (app) {
    app.factory('SetIndex', ['$http', 'WaitServer', 'serverURL', function ($http, WaitServer, serverURL) {
        return function (data, callback) {
            WaitServer.show();
            $http({
                method: 'POST',
                url: serverURL + '/portfolio/paper/setIndex',
                data: data,
                responseType: 'json',
                withCredentials: true
            }).success(function (result) {
                WaitServer.hide();
                callback(result);
            });
        };
    }]);
});
