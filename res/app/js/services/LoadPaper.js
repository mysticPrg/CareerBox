/**
 * Created by JEONGBORAM-PC-W1 on 2014-10-24.
 */
define(['app'], function (app) {
    app.factory('LoadPaper', function () {
        return function ($http, paperId, callback, _member_id) {

            var member_id_param = '';
            if ( _member_id ) {
                member_id_param += '/' + _member_id;
            }

            $http({
                method: 'GET',
                url: 'http://210.118.74.166:8123/portfolio/paper/' + paperId + member_id_param,
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        }
    });
});
