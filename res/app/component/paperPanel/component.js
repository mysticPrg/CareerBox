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
    'services/getTemplateList',
    'services/deleteTemplate',
    'services/ApplyCommonItemAttribute',
    'services/SetZOrder'
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
        'getTemplateList',
        'DeleteTemplate',
        'ApplyCommonItemAttribute',
        'SetZOrder',
        function ($scope, $rootScope, $http, $modal, $window, $compile, EditorData, HTMLGenerator, SaveTemplate, getTemplateList, DeleteTemplate, ApplyCommonItemAttribute, SetZOrder) {
            $scope.templates = [];
            $scope.childIndex = 0;

//            console.log('EditorData', EditorData);

            $scope.initializeSectionEditor = function () {
                $('#SectionEditorTab a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                });

                $('#articleTabLink').click();
                $scope.loadArticleTemplate();


                $("#content > div").hide(); // Initially hide all content
                $("#SectionEditorTab li:first").attr("id","current"); // Activate first tab
                $("#SectionEditorTab li:first a img").attr("src", "../img/editor_img/articleIcon.png");
                $("#content div:first").fadeIn(); // Show first tab content

                $('#SectionEditorTab a').click(function(e) {
                    e.preventDefault();
                    $("#content > div").hide(); //Hide all content
                    $("#SectionEditorTab li").attr("id",""); //Reset id's
                    $(this).parent().attr("id","current"); // Activate this

                    if($(this).children().attr('id') === 'articleTabImg')
                    {
                        $(this).children().attr("src", "../img/editor_img/articleIcon.png");
                        $(this).parent().siblings().children().children().attr("src", "../img/editor_img/itemIconActive.png");
                    }
                    else if($(this).children().attr('id') === 'itemTabImg')
                    {
                        $(this).children().attr("src", "../img/editor_img/itemIcon.png");
                        $(this).parent().siblings().children().children().attr("src", "../img/editor_img/articleIconActive.png");
                    }


                    $('#' + $(this).attr('title')).show();
                    $('#' + $(this).attr('title')).fadeIn(); // Show content for current tab
                });

            }

            $scope.loadArticleTemplate = function () {
                var articleTemplateArray = new Array();

                getTemplateList($http, 'article', function (data) {
                    if (data.returnCode == 000) {
                        $scope.templates = data.result;
//                        console.log('load data',$scope.templates);
                    }
                });
            };

            function newItem(type) {
                var item;
                if (type === 'text') {
                    item = new Text();
                    item.radius = 3;
                    item.font.size = 15;
                    item.size.width = 250;
                    item.size.height = 100;
                    item.outline.color.R = "d9";
                    item.outline.color.G = "d9";
                    item.outline.color.B = "d9";

                } else if (type === 'image') {
                    item = new Image();
                    item.size.width = 140;
                    item.size.height = 180;
                    item.outline.weight = 0;

                } else if (type === 'line') {
                    item = new Line();
                    item.outline.weight = 2;
                    item.size.width = 250;

                } else if (type === 'link') {
                    item = new Link();
                    item.size.width = 100;
                    item.size.height = 50;
                    item.url = 'http://';
                    item.name = '여기로 이동';
                    item.outline.weight = 0;
                    item.font.size = 15;

                } else if (type === 'shape') {
                    item = new Shape();
                    item.outline.weight = 3;
                    item.fill.color.R = "f2";
                    item.fill.color.G = "57";
                    item.fill.color.B = "5a";

                    item.outline.color.R = "e1";
                    item.outline.color.G = "3b";
                    item.outline.color.B = "3d";
                }

                item._id = $scope.childIndex++;
                item.itemType = type;
                item.state = 'new';

                return item;
            }

            $scope.itemClone = function (type) {
                var item = newItem(type);

                EditorData.childArr[item._id] = item;

                var option = {draggable: true, resizable: true, rotatable: true};

                var domObj = HTMLGenerator('loadItem', item, item._id, option);

                $(domObj).appendTo('#canvas-content');

                $compile($('#' + item._id))($scope);

                EditorData.focusId = item._id;    // 클론될 때 클론된 아이템의 속성창을 바로 띄워줌.

                SetZOrder(item, item._id);
            };

            $scope.templateClone = function (template_ori) {
                var template = jQuery.extend(true, {}, template_ori);   // 객체 복사해주어야함!.

                // 로드된 템플릿과 아이디가 겹치지 않도록함.
                for(var key in EditorData.childArr){

                    if(EditorData.childArr[key].layoutComponentType != "item")  // 아이템은 무시
                    if($scope.childIndex <= Number(EditorData.childArr[key]._id.split(template._id + '_')[1])){


                        $scope.childIndex = Number(EditorData.childArr[key]._id.split(template._id + '_')[1]) + 1;
                    }
                }

                var templateDomId = template._id + '_' + $scope.childIndex;
                var templateItemDom = '';

                template._template_id = template._id;
                template.state = 'new';

                // template의 article을 저장.
                template.target._id = templateDomId;
                template.target._template_id = template._id;

                EditorData.childArr[templateDomId] = template.target;
                SetZOrder(template.target, templateDomId);

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

                // 나중에 한번 더 컴파일 하므로 불필요
//                $compile($(domObj))($scope);

                $('#' + id).css('position', 'absolute');
                $('#' + id).width(template.target.size.width);
                $('#' + id).height(template.target.size.height);
                $('#' + id).css("background-color", "gray");

//                다른 요소까지 컴파일 되므로 주석처리 함
//                $compile($('#canvas-content'))($scope);

            }

            $scope.editTemplate = function (template) {
                EditorData.template = template;
                EditorData.templateState = 'edit';
            }

            $scope.deleteTemplate = function (id) {
                DeleteTemplate($http, id, function (result) {
                    if (result.returnCode == 000) {
                        $scope.loadArticleTemplate();
                        window.location.reload();
                    } else {
                        alert('실패하였습니다.');
                        console.log('error: ' + result);
                    }
                });
            }

            // create template modal
            $scope.popCreateTemplateModal = function () {
                EditorData.templateState = 'new';
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