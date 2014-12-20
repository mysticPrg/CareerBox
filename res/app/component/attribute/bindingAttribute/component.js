
define([
    'app',
    'component/bindingArticleModal/component',
    'services/getAttributeNames',
    'services/EditorData',
    'services/InformationData',
    'services/getAvailableAttribute'
], function (app, bindingArticleModal) {

    app.directive('bindingAttribute', function (getAttributeNames, EditorData, getAvailableAttribute, InformationData) {

        return {
            restrict: 'A',
            scope: {
                data : "=to",
                layoutType : "=type"
            },
            templateUrl: require.toUrl('component/attribute/bindingAttribute/template.html'),
            controller : function ($scope, $modal) {

                $scope.infoCategory = InformationData;
                $scope.category = '';
                $scope.setCategory = function(){
                    // 템플릿에 카테고리를 매칭
                    $scope.data.bindingType = $scope.category;
                    $scope.data.bindingType = {
                        infoType : $scope.category.infoType,
                        title : $scope.category.title
                    }
                };

                // bindingType 비우기
                $scope.clear = function() {
                    $scope.data.bindingType = '';
                };

                // 속성 이름들 모두 가져오기
                $scope.EditorData = EditorData;
                $scope.$watch('EditorData.focusId',function(){
                    try {
                        if($scope.data.itemType === "image"){
                            // key의 첫글자가 I 인 것만 가져오기
                            $scope.attributeNames = getAvailableAttribute(EditorData.template.target.bindingType.infoType, 'I');

                        } else if($scope.data.itemType === "link"){
                            // key의 첫글자가 F 인 것만 가져오기
                            $scope.attributeNames = getAvailableAttribute(EditorData.template.target.bindingType.infoType, 'F');

                        } else if($scope.data.itemType === "text"){
                            // key의 첫글자가 I,F 인 것빼고 가져오기
                            $scope.attributeNames = getAvailableAttribute(EditorData.template.target.bindingType.infoType, '-I -F');
                        }
                    } catch(exception){} // 아이템이 아닌 경우


                    // 템플릿의 아티클일 경우
                    try {
                        $scope.indexs = [];
                        for(var i=0; i < $scope.data.bindingType.items.length; i++){
                            $scope.indexs.push(i+1);
                        };
                    } catch(exception){}


                },true);

                // 아이템에 속성이름을 매칭
                $scope.setAttributeName = function() {
                    for(var key in $scope.attributeNames){
                        if($scope.attributeNames[key] == $scope.attributeName){
                            if(key in EditorData.template.target.bindingType){
                                $scope.data.bindingType = EditorData.template.target.bindingType[key];
                            } else{
                                // key를 등록!
                                $scope.data.bindingType = {key : key};

                            }
                        }
                    }
                };

                $scope.articleBinging = function(infoType) {
                    EditorData.infoType = infoType;
                    var modalInstance = $modal.open(bindingArticleModal);
                    modalInstance.result.then(function () {
                        console.log('test');
                    }, function () {
                    });
                }

            }
        };
    });

});