/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-22.
 */
define(['app'], function(app) {
    app.factory('LoadPaperList', function () {
        return function ($http, portfolioId, callback) {
            $http({
                method: 'POST',
                url: 'http://210.118.74.166:8123/portfolio/paperList',
                data: {_portfolio_id : portfolioId},
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        }
    });
});
