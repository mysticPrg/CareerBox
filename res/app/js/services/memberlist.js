/**
 * Created by careerBox on 2014-10-19.
 */

define(['app'], function(app) {
    app.factory('memberlist', function($http) {
        return $http.get('http://210.118.74.166:8123/member/list');
    });
});