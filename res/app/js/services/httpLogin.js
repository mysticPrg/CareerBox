/**
 * Created by gimbyeongjin on 14. 10. 24..
 */
define(['app',
    'classes/Member',
    'service/serverURL'
], function (app, Member) {
    app.factory('httpLogin', ['serverURL', '$http', function (serverURL, $http) {
        return function (email, password, isFacebook, callback) {
            var member = new Member();
            member.email = email;
            member.password = password;
            member.isFacebook = isFacebook;
            $http({
                method: 'POST',
                url: serverURL + '/member/login',
                responseType: 'json',
                data: {member: member},
                withCredentials: true
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                callback(data);
            });
        };
    }]);
});
