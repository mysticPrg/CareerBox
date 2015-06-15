/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define(['app', 'service/WaitServer', 'service/serverURL'], function (app) {
    app.factory('SaveTemplate', ['WaitServer', 'serverURL', function (WaitServer, serverURL) {
        return function ($http, template, callback) {
            WaitServer.show();
            $http({
                method: 'POST',
                url: serverURL + '/template',
                data: {template: template},
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                WaitServer.hide();
                callback(data);
            });
        };
    }]);
});

