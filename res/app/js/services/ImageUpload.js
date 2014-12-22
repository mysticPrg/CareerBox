/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-20.
 */
define(['app', 'service/serverURL'], function (app) {
    app.factory('ImageUpload', ['serverURL', function (serverURL) {
        return function ($upload, files, type, progressCallBack, successCallBack) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: serverURL + '/image/'+type,
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