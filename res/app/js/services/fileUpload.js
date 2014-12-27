/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-20.
 */
define(['app', 'service/serverURL'], function (app) {
    app.factory('fileUpload', ['serverURL', function (serverURL) {
        return function ($upload, files, isBinding, progressCallBack, successCallBack) {

            function onProgress(evt) {
                progressCallBack(evt);
            }

            function onSuccess(data) {
                successCallBack(data);
            }

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: serverURL + '/file',
                    method: 'POST',
                    withCredentials: true,
                    data: {isBinding: isBinding},
                    file: file
                }).progress(onProgress).success(onSuccess);
            }
        };
    }]);
});