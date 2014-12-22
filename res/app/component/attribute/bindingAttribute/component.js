
define([
    'app',
    'classes/Paper',
    'component/bindingArticleModal/component',
    'service/getAvailableAttribute',
    'service/EditorData',
    'service/InformationData',
    'service/reloadPaper'
], function (app, Paper, bindingArticleModal) {

    app.directive('bindingAttribute', function (getAvailableAttribute, EditorData, InformationData, reloadPaper) {

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
                    $scope.data.bindingType = {
                        infoType : $scope.category.infoType,
                        title : $scope.category.title
                    }
                    $scope.data.bindingChanged = true;
//                    console.log('setCategory 이후 bindingType', $scope.data.bindingType);
                };

                // bindingType 비우기
                $scope.clear = function() {
                    $scope.data.bindingType = '';
                };

                // 속성 이름들 모두 가져오기
                $scope.EditorData = EditorData;
                $scope.$watch('EditorData.focusId',function(){

                    // 템플릿의 아이템일 경우
                    if($scope.layoutType === 'template_item'){
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
                    }
                    // 템플릿의 아티클일 경우
                    else if($scope.layoutType === 'template'){

                        // 처음 배열 인덱스 가져오기
                        $scope.categoryInitIndex =$scope.infoCategory[$scope.data.bindingType.infoType];
                    }

                },true);

                // 아이템에 속성이름을 매칭
                $scope.setAttributeName = function() {
                    for(var key in $scope.attributeNames){
                        if($scope.attributeNames[key] == $scope.attributeName){
                            if(key in EditorData.template.target.bindingType){
                                $scope.data.bindingType = EditorData.template.target.bindingType[key];
                            } else{
                                // key를 등록!
                                $scope.data.bindingType = key;

                            }
                        }
                    }
                };

                $scope.articleBinging = function(data) {
                    EditorData.infoType = data.bindingType.infoType;
                    EditorData.bindingData = data.bindingData;

                    var modalInstance = $modal.open(bindingArticleModal);
                    modalInstance.result.then(function (result) {
                        // 성공했을 때
                        $scope.data.bindingData = result;
                        console.log('modalClose',result);

                        // reload
                        reloadPaper($scope, function(){
                            alert('성공했습니다.');
                        });
                    }, function () {});
                }

//                function getPaperChildArr(childArr) {
//                    var paperChildArr = new Array();
//
//                    for (var key in childArr) {
//                        var child = childArr[key];
//
//                        if (child.state == 'new') {
//                            delete child._id;
//                        }
//
//                        if (child.state == 'del') {
//                            continue;
//                        }
//
//                        delete  child.state;
//
//                        paperChildArr.push(child);
//                    }
//
//                    return paperChildArr;
//                }
//
//                $scope.reload = function(callback) {
//                    var paper = EditorData.paper;
//                    paper.childArr = getPaperChildArr(EditorData.childArr);
//
//                    //페이퍼 저장
//                    var data = {_portfolio_id: EditorData.portfolio._id, paper: paper};
//                    console.log('paperSave', data.paper.childArr[0].bindingData);
//                    SavePaper($http, data, function (result) {
//                        if (result.returnCode === '000') {
//                            // 페이퍼 로드
//                            LoadPaper($http, EditorData.paperId, function (result) {
//                                EditorData.paper = result.result;
//                                EditorData.paperTitle = result.result.title;
//
//                                // reload
//                                $('#' + EditorData.focusId).remove();
//                                var articleModel = SetAttributeInformation(EditorData.focusId).attributeInformation;
//                                loadArticle(articleModel ,$scope);
//
//                                callback();
//                            });
//
//                        } else if (result.returnCode === '001') {
//                        } else if (result.returnCode === '002') {
//                        }
//                    });
//                }
            }
        };
    });

});