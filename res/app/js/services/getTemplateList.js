/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define(['app'], function (app) {
    app.factory('getTemplateList', function () {
        return function ($http, infoType, callback) {
            var url = 'http://210.118.74.166:8123/template';
            if(infoType !== ''){
                console.log('getTemplateList', infoType);
                url = url + '/' + infoType;
                console.log(url);
            }

            $http({
                method: 'GET',
                url: url,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                console.log(data);
                callback(data);
            });
        }
    });
});

