/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-22.
 */
define(['app', 'service/serverURL'], function(app) {
    app.factory('LoadPaperList', ['serverURL', function (serverURL) {
        return function ($http, portfolioId, callback) {
            $http({
                method: 'POST',
                url: serverURL + '/portfolio/paperList',
                data: {_portfolio_id : portfolioId},
                responseType: 'json',
                withCredentials: true
            }).success(function (data) {
                callback(data);
            });
        };
    }]);
});
