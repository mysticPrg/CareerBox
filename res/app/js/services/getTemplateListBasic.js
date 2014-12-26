/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-26.
 */
define(['app'], function (app) {
    app.factory('getTemplateListBasic', function () {
        return function ($http, infoType, callback) {
            var url = 'http://210.118.74.166:8123/template/basic/list';
            if(infoType !== ''){
                url = url + '/' + infoType;
            }

            console.log(url);

            $http({
                method: 'GET',
                url: url,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        }
    });
});