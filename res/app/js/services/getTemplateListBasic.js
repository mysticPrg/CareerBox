/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-26.
 */
define(['app', 'service/serverURL'], function (app) {
    app.factory('getTemplateListBasic', ['serverURL', function (serverURL) {
        return function ($http, infoType, callback) {
            var url = serverURL + '/template/basic/list';
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