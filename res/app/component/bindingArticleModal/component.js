
define([
    'app',
    'services/EditorData',
    'services/getInformationByType',
    'services/getInformationItem'
], function (app) {
    app.controller('bindingArticleModalController', ['$scope', '$http', '$modalInstance', 'EditorData', 'getInformationByType', 'getInformationItem',
        function ($scope, $http, $modalInstance, EditorData, getInformationByType, getInformationItem) {
            $scope.myData;
            $scope.myOptions = { data: 'myData' };
            var InformationItem = getInformationItem(EditorData.infoType);

            getInformationByType($http, EditorData.infoType, function (data) {
                var items = data.result.items

                var dataItems = [];
                var dataitem;

                var item;
                for(var i = 0 ; i < items.length; i++){
                    dataitem = new Object();
                    item = items[i];

                    for (var key in item) {
                        var keyKr = InformationItem.getAttributeName(key);

                        if(key === '_id')
                            continue;

                        if(key === 'F_file'){
                            dataitem[keyKr] = item[key].originalName;
                            continue;
                        }

                        if(key === 'I_image'){
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

                $scope.myData = dataItems;
                $scope.myOptions = { data: 'myData' };
            });

            $scope.save = function () {
//                $modalInstance.close($scope.paper);
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