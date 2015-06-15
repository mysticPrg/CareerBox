/**
 * Created by JEONGBORAM-PC-W1 on 2014-10-24.
 */
define(['app', 'service/WaitServer', 'service/serverURL'], function (app) {
    app.factory('SavePaper', ['WaitServer', 'serverURL', function (WaitServer, serverURL) {
        return function ($http, paper, callback) {
            WaitServer.show();
            $http({
                method: 'POST',
                url: serverURL + '/portfolio/paper',
                data: paper,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                WaitServer.hide();
                callback(data);
            });
        };
    }]);
});
