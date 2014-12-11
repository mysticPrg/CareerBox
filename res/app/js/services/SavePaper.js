/**
 * Created by JEONGBORAM-PC-W1 on 2014-10-24.
 */
define(['app'], function (app) {
    app.factory('SavePaper', function () {
        return function ($http, paper, callback) {
            $http({
                method: 'POST',
                url: 'http://210.118.74.166:8123/portfolio/paper',
                data: paper,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        }
    });
});
