/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-17.
 */
define([
    'app',
    'classes/Templates/Template',
    'classes/LayoutComponents/Items/Icon',
    'classes/LayoutComponents/Items/Image',
    'classes/LayoutComponents/Items/Item',
    'classes/LayoutComponents/Items/Line',
    'classes/LayoutComponents/Items/Link',
    'classes/LayoutComponents/Items/Shape',
    'classes/LayoutComponents/Items/Text',
    '../createTemplateModal/component',
    '../deleteTemplateModal/component',
    '../paperComponent/component',
    'services/EditorData',
    'services/HTMLGenerator',
    'services/SaveTemplate',
    'services/LoadTemplate',
    'services/deleteTemplate',
    'services/ApplyCommonItemAttribute'
], function (app, Template, Icon, Image, Item, Line, Link, Shape, Text, createTemplateModal, deleteTemplateModal, paperComponent) {
    app.controller('paperPanel', [
        '$scope',
        '$rootScope',
        '$http',
        '$modal',
        '$window',
        '$compile',
        'EditorData',
        'HTMLGenerator',
        'SaveTemplate',
        'LoadTemplate',
        'DeleteTemplate',
        'ApplyCommonItemAttribute',
        function ($scope, $rootScope, $http, $modal, $window, $compile, EditorData, HTMLGenerator, SaveTemplate, LoadTemplate, DeleteTemplate, ApplyCommonItemAttribute) {
            $scope.templates = [];

            $scope.childIndex = 0;

            $scope.initializeSectionEditor = function () {
                $('#SectionEditorTab a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                });

                $('#articleTabLink').click();
                $scope.loadArticleTemplate();
            }

            $scope.loadArticleTemplate = function () {
                var articleTemplateArray = new Array();

                LoadTemplate($http, 'article', function (data) {
                    if (data.returnCode == 000) {
                        $scope.templates = data.result;
                    }
                });
            };

            function newItem(type) {
                var item;
                if (type === 'text') {
                    item = new Text();
                } else if (type === 'image') {
                    item = new Image();
                } else if (type === 'line') {
                    item = new Line();
                } else if (type === 'link') {
                    item = new Link();
                } else if (type === 'shape') {
                    item = new Shape();
                }

                item._id = $scope.childIndex++;
                item.itemType = type;
                item.state = 'new';

                return item;
            }

            $scope.itemClone = function (type) {
                var item = newItem(type);

                EditorData.childArr[item._id] = item;

                var option = {draggable: true, resizable: true};

                var domObj = HTMLGenerator('loadItem', item, item._id, option);

                $(domObj).appendTo('#canvas-content');

                $compile($('#' + item._id))($scope);

                EditorData.focusId = item._id;    // 클론될 때 클론된 아이템의 속성창을 바로 띄워줌.
            };

            $scope.templateClone = function (template) {
                var templateDomId = template._id + '_' + $scope.childIndex;
                var templateItemDom = '';

                template._template_id = template._id;
                template.state = 'new';

                EditorData.childArr[templateDomId] = template;

                var templateItemArray = template.target.childArr;

                createTemplateDiv(template, templateDomId);

                var option = {draggable: false, resizable: false};

                var templateItemId;
                var templateItem;
                for (var index = 0; index < templateItemArray.length; index++) {
                    templateItem = templateItemArray[index];

//                    var item = newItem(templateItem.itemType);
//                    item._id = templateItemArray[index]._id;
//                    EditorData.childArr[templateDomId].target.childArr[index] = item;

                    // Item of template 's id = template id_item id
                    templateItemId = templateDomId + '_' +templateItemArray[index]._id;
                    templateItemDom += HTMLGenerator('loadItem', templateItemArray[index], templateItemId, option);
                }

                $('#' + templateDomId).append(templateItemDom);
                $compile($('#' + templateDomId))($scope);

                $scope.childIndex++;
            }

            function createTemplateDiv(template, id) {
                var domObj = "<div id=" + id + " draggable ng-click common-attribute></div>";

                $(domObj).appendTo('#canvas-content');
                $compile($(domObj))($scope);

                $('#' + id).css('position', 'absolute');
                $('#' + id).width(template.target.size.width);
                $('#' + id).height(template.target.size.height);
                $('#' + id).css("background-color", "gray");

                $compile($('#canvas-content'))($scope);

            }

            $scope.createTemplate = function (template) {
                $window.location.href = "#/TemplateEditor";
                EditorData.templateState = 'new';
                EditorData.template.title = template.title;
                EditorData.template.description = template.description;
            };

            $scope.editTemplate = function (template) {
                EditorData.template = template;
                EditorData.templateState = 'edit';
                $window.location.href = "#/TemplateEditor";
            }

            $scope.deleteTemplate = function (id) {
                DeleteTemplate($http, id, function (result) {
                    if (result.returnCode == 000) {
                        $scope.loadArticleTemplate();
                    } else {
                        alert('실패하였습니다.');
                        console.log('error: ' + result);
                    }
                });
            }

            // create template modal
            $scope.popCreateTemplateModal = function () {
                var modalInstance = $modal.open(createTemplateModal);
                modalInstance.result.then(function (template) {
                    $scope.createTemplate(template);
                }, function () {
                });
            };

            // delete template modal
            $scope.popDeleteTemplateModal = function (id) {
                var modalInstance = $modal.open(deleteTemplateModal);
                modalInstance.result.then(function () {
                    $scope.deleteTemplate(id);
                }, function () {
                });
            };

            // modify template modal
//            $scope.popModifyTemplateModal = function (template) {
//                createTemplateModal.resolve = {
//                    template: template
//                };
//
//                var modalInstance = $modal.open(createTemplateModal);
//                modalInstance.result.then(function (template) { // OK
//                    $scope.templateClone(template);
//                }, function () {
//                });
//            };
        }
    ]);

    app.directive('paperPanel', function () {
        return {
            restrict: 'A',
            templateUrl: require.toUrl('component/paperPanel/template.html'),
            controller: 'paperPanel'
        };
    });

});