/**
 * Created by gimbyeongjin on 14. 10. 24..
 */
define(['app',
    'classes/Member',
    'services/serverURL'
], function (app, Member) {
    app.factory('httpJoin', ['serverURL','$http', function (serverURL, $http) {
        return function (email, password, callback) {
            var member = new Member();
            member.email = email;
            member.password = password;
            member.isFacebook = false;
            $http({
                method: 'POST',
                url: serverURL + '/member/join',
                responseType: 'json',
                data: {member : member},
                withCredentials: true
            }).success(function (data) {
                callback(data);
            }).error(function(data) {
                callback(data);
            });
        }
    }]);
});
