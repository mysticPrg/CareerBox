/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define(['app', 'service/serverURL'], function (app) {
    app.factory('getTemplateList', ['serverURL', function (serverURL) {
        return function ($http, infoType, callback) {
            var url = serverURL + '/template';
            if(infoType !== ''){
                url = url + '/' + infoType;
            }

            $http({
                method: 'GET',
                url: url,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        };
    }]);
});

