/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-20.
 */
define(['app', 'services/serverURL'], function (app) {
    app.factory('profileImageUpload', ['serverURL', function (serverURL) {
        return function ($upload, files, progressCallBack, successCallBack) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: serverURL + '/image/profile',
                    method: 'POST',
                    withCredentials: true,
                    file: file
                }).progress(function (evt) {
                    progressCallBack(evt);
                }).success(function (data, status, headers, config) {
                    successCallBack(data);
                });
            }
        }
    }]);
});