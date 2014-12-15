/**
 * Created by gimbyeongjin on 14. 11. 14..
 */

define(['app'
], function(app) {
    app.factory('CommonCallback', [ function () {
        return function(data, successCallback) {
            var stateText = "";
            // Error
            if(data == null){
                stateText = "서버와의 연결이 되지 않았습니다.";
                alert(stateText);
            }
            // Success
            else if (data.returnCode == '000') {
                stateText = "성공하였습니다.";
                successCallback();    // 성공 시 실행되어야하는 콜백 함수
            }
            // Invalid Arguments
            else if (data.returnCode == '001') {
                stateText = "오류 발생";
                alert(stateText);
            }
            // Not Login
            else if (data.returnCode == '002') {
                stateText = "로그인이 안되어있습니다.";
                alert(stateText);
                window.location.href = "../partials/login.html";
            }
            else{
                stateText = "파싱 오류 발생";
                console.log(stateText);
                console.log(data);
            }
//            console.log(stateText);
        }
    }]);
});