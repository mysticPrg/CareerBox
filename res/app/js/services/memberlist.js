/**
 * Created by careerBox on 2014-10-19.
 */

define(['app', 'service/serverURL'], function(app) {
    app.factory('memberlist', ['$http', 'serverURL', function($http, serverURL) {
        return $http.get(serverURL + '/member/list');
    }]);
});