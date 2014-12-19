/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-20.
 */
define(['app', 'services/serverURL'], function (app) {
    app.factory('fileUpload', ['serverURL', function (serverURL) {
        return function ($upload, files, isBinding, progressCallBack, successCallBack) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: serverURL + '/file',
                    method: 'POST',
                    withCredentials: true,
                    data: {isBinding: isBinding},
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