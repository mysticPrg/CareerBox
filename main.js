/**
 * Created by mysticPrg on 2014-09-22.
 */

//var capture = require('./src/util/Capture');
//var genID = require('./src/util/genID');
//
//var server = require('./src/services/server');
//
//var MemberService = require('./src/services/MemberService');
//var PortfolioService = require('./src/services/PortfolioService');
//var TemplateService = require('./src/services/TemplateService');
//var PaperService = require('./src/services/PaperService');
//
//MemberService.set(server);
//PortfolioService.set(server);
//TemplateService.set(server);
//PaperService.set(server);
//
//server.get('/capture', function(req, res) {
//    capture(genID(), genID());
//
//    res.end();
//});
//
//server.start(8123);

var dummy = {
    "_id": "5470c82fab20e0580acf2ddd",
    "title": "test2",
    "templateType": "article",

    "childArr": [
        {
            "size": {
                "width": 192,
                "height": 40
            },
            "pos": {
                "x": 161,
                "y": 7
            },
            "outline": {
                "use": true,
                "color": {
                    "R": "FF",
                    "G": "FF",
                    "B": "FF"
                },
                "alpha": 100,
                "weight": 1
            },
            "fill": {
                "use": true,
                "color": {
                    "R": "FF",
                    "G": "FF",
                    "B": "FF"
                },
                "alpha": 100
            },
            "radius": 0,
            "rotate": 0,
            "layoutComponentType": "item",
            "itemType": "Text",
            "value": "Text",
            "font": {
                "color": {
                    "R": "00",
                    "G": "00",
                    "B": "00"
                },
                "size": 11,
                "family": "dotum",
                "italic": false,
                "bold": false
            },
            "align": "left",
            "vAlign": "middle",
            "_id": "5470c82fab20e0580acf2dda"
        },
        {
            "size": {
                "width": 146,
                "height": 146
            },
            "pos": {
                "x": 0,
                "y": 0
            },
            "outline": {
                "use": true,
                "color": {
                    "R": "FF",
                    "G": "FF",
                    "B": "FF"
                },
                "alpha": 100,
                "weight": 1
            },
            "fill": {
                "use": true,
                "color": {
                    "R": "FF",
                    "G": "FF",
                    "B": "FF"
                },
                "alpha": 100
            },
            "radius": 0,
            "rotate": 0,
            "layoutComponentType": "item",
            "itemType": "Image",
            "name": "",
            "thumbnail": "",
            "_id": "5470c82fab20e0580acf2ddb"
        },
        {
            "size": {
                "width": 192,
                "height": 40
            },
            "pos": {
                "x": 161,
                "y": 60
            },
            "outline": {
                "use": true,
                "color": {
                    "R": "00",
                    "G": "00",
                    "B": "00"
                },
                "alpha": 100,
                "weight": 1
            },
            "fill": {
                "use": true,
                "color": {
                    "R": "FF",
                    "G": "FF",
                    "B": "FF"
                },
                "alpha": 100
            },
            "radius": 0,
            "rotate": 0,
            "layoutComponentType": "item",
            "itemType": "Text",
            "value": "Text",
            "font": {
                "color": {
                    "R": "00",
                    "G": "00",
                    "B": "00"
                },
                "size": 11,
                "family": "dotum",
                "italic": false,
                "bold": false
            },
            "align": "left",
            "vAlign": "middle",
            "_id": "5470c82fab20e0580acf2ddc"
        }
    ],
    "description": "",
    "timestamp": "2014-11-22T17:29:30.623Z",
    "thumbnail": null
};

var requirejs = require('./src/require.config');
var Text = requirejs('classes/LayoutComponents/Items/Text');
var Shape = requirejs('classes/LayoutComponents/Items/Shape');
var Link = requirejs('classes/LayoutComponents/Items/Link');
var Color = requirejs('classes/Structs/Color');
var Icon = requirejs('classes/LayoutComponents/Items/Icon');
var IconType = requirejs('classes/Enums/IconType');

var capture = require('./src/util/Capture');

var t = new Shape();
t._id = '1129asd3150125';
t.size.width = 500;
t.size.height = 500;
t.outline.use = true;
t.fill.color = new Color('00AA00');
//t.value = 'asdasfasfasfasfasf This is Text test';
//t.font.color = new Color('FF0000');
//t.font.size = 20;
//t.font.bold = true;
//t.font.italic = true;
//t.align = 'right';
//t.vAlign = 'bottom';
t.pos.x = 10;
t.pos.y = 20;
t.radius = 10;
t.rotate = 0;
//t.url = 'www.naver.com';
//t.iconType = IconType.film;

//t.outline.use = false;

capture(t);
