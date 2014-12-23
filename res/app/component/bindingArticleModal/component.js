
define([
    'app',
    'service/EditorData',
    'service/getInformationByType',
    'service/getInformationItem'
], function (app) {
    app.controller('bindingArticleModalController', ['$scope', '$http', '$modalInstance', 'EditorData', 'getInformationByType', 'getInformationItem',
        function ($scope, $http, $modalInstance, EditorData, getInformationByType, getInformationItem) {
            $scope.informationData;
            $scope.selectedItems = [];
            $scope.informationDataOptions = {
                data: 'informationData',
                selectedItems: $scope.selectedItems,
                multiSelect: true,
                excludeProperties: ['_id']
            };

            $scope.hasItems = false;

            var InformationItem = getInformationItem(EditorData.infoType);

            getInformationByType($http, EditorData.infoType, function (data) {
                if(data.result === null)
                    return;

                var items = data.result.items

                $scope.hasItems = items.length > 0? true: false;

                if($scope.hasItems === true){
                    var dataItems = [];
                    var dataitem;

                    var item;
                    for(var i = 0 ; i < items.length; i++){
                        dataitem = new Object();
                        item = items[i];

                        for (var key in item) {
                            var keyKr = InformationItem.getAttributeName(key);

                            if(key === '_id'){
                                dataitem[key] = item[key];
                                continue;
                            }

                            if(key === 'F_file'){
                                dataitem[keyKr] = item[key].originalName;
                                continue;
                            }

                            if(key === 'I_image'){
                                dataitem[keyKr] = item[key].originalName;
                                continue;
                            }

                            if(key === 'I_picture'){
                                dataitem[keyKr] = item[key].originalName;
                                continue;
                            }

                            if(key === 'T_term'){
                                dataitem[keyKr] = item[key].start.split('T')[0] + '-' + item[key].end.split('T')[0];
                                continue;
                            }

                            dataitem[keyKr] = item[key];
                        }

                        dataItems.push(dataitem);
                    }

                    $scope.informationData = dataItems;
                }
            });

            $scope.$on('ngGridEventData', function(){
                angular.forEach($scope.informationData, function (data, index) {
                    for (var i = 0; i < EditorData.bindingData.length; i++) {
                        if (data._id == EditorData.bindingData[i]) {
                            $scope.informationDataOptions.selectRow(index, true);
                        }
                    }
                });
            });

            $scope.ok = function () {
                var bindingArticleIds = [];
                for(var i = 0; i < $scope.selectedItems.length; i++){
                    bindingArticleIds.push($scope.selectedItems[i]._id);
                }
                $modalInstance.close(bindingArticleIds);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
    }]);
    return {
        templateUrl: require.toUrl('component/bindingArticleModal/template.html'),
        controller: 'bindingArticleModalController',
        size : 'lg'
    }
});