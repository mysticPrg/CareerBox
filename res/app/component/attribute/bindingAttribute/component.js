
define([
    'app',
    'classes/Enums/InfoCategory',
    'services/getAttributeNames',
    'services/EditorData',
    'services/InformationData',
    'services/getAvailableAttribute'
], function (app, InfoCategory) {

    app.directive('bindingAttribute', function (getAttributeNames, EditorData, getAvailableAttribute, InformationData) {
        return {
            restrict: 'A',
            scope: {
                data : "=to",
                layoutType : "=type"
            },
            templateUrl: require.toUrl('component/attribute/bindingAttribute/template.html'),
            link: function ($scope, element, att) {

                $scope.infoCategory = InformationData;
                $scope.category = '';
                $scope.setCategory = function(){
                    // 템플릿에 카테고리를 매칭
                    $scope.data.bindingType = $scope.category;
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

                // 페이지 에디터에서 인덱스를 선택
                $scope.itemIndex = function() {
                    // 하위에 있는 아이템을 돌아가면서 매칭
                    for(var i in $scope.data.childArr){
//                        $scope.data                 // 아티클
//                        $scope.data.childArr[i];  // 하위 아이템

//                        console.log('bindingType', $scope.data.childArr[i].bindingType);
//                        $scope.data.childArr[i].bindingType = $scope.data.bindingType.items[$scope.index-1][ $scope.data.childArr[i].bindingType['key'] ];

//                        console.log('$scope.data.childArr[i]' , $scope.data.childArr[i]);
//
//                        console.log('바인딩 적용될 것' , element);
//                        console.log('바인딩 적용된 모델' , $scope.data.bindingType.items[$scope.index-1][ $scope.data.childArr[i].bindingType['key'] ])

                    }
                };
            }
        };
    });

});