define([
    'app',
    'jquery-ui',
    'services/SetAttributeInformation'
], function (app) {


    app.directive('image', ['SetAttributeInformation', function (SetAttributeInformation) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict: 'A',
            scope : true,   // 새로운 스코프
            link: function(scope, element, att) {

                element.css ({
//                   'content': 'url(\"../img/noImage.png\")'
                });



            },

        templateUrl: require.toUrl('component/item/image/template.html')
        };
    }]);
});
//
//var img = document.createElement('img');
//
//// setAttribute(name, value) : 객체의 속성을 지정
//// getAttribute(name, value) : 객체의 속성을 가져옴
//img.setAttribute('src', 'test.png');
//img.setAttribute('width', 600);
//img.setAttribute('height', 500	);
//
//// appendChild(node) : 객체에 노드를 연결
//document.body.appendChild(img);