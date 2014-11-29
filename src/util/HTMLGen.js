/**
 * Created by careerBox on 2014-11-22.
 */


var requirejs = require('../require.config');

var ItemType = requirejs('classes/Enums/ItemType');
var LayoutComponentType = requirejs('classes/Enums/LayoutComponentType');

var async = require('async');
var genID = require('./genID');

function setSize($, item, callback) {
    var jItem = $('#' + item._id);

    jItem.width(item.size.width, function () {
        jItem.height(item.size.height, function () {
            callback(null, $, item);
        });
    });
}

function setPos($, item, callback) {
    var jItem = $('#' + item._id);

    jItem.css('position', 'absolute', function () {
        jItem.css('left', item.pos.x, function () {
            jItem.css('top', item.pos.y, function () {
                callback(null, $, item);
            });
        });
    });
}

function setOutline($, item, callback) {

    if (!item.outline.use) {
        callback(null, $, item);
        return;
    }

    var jItem = $('#' + item._id);

    var colorStr = '#' + item.outline.color.getColorCode();
    var lineStr = 'solid';
    var weightStr = item.outline.weight + 'px';
    var str = colorStr + ' ' + lineStr + ' ' + weightStr;

    jItem.css('border', str, function () {
        callback(null, $, item);
    });

}

function setFill($, item, callback) {
    if (!item.fill.use) {
        callback(null, $, item);
        return;
    }

    var jItem = $('#' + item._id);
    var colorStr = '#' + item.fill.color.getColorCode();
    jItem.css('background-color', colorStr, function () {
        callback(null, $, item);
    });
}

function setRadius($, item, callback) {
    if (item.radius === 0) {
        callback(null, $, item);
        return;
    }

    var jItem = $('#' + item._id);
    jItem.css('border-radius', item.radius + 'px', function () {
        callback(null, $, item);
    });
}

function setRotate($, item, callback) {

    if (item.rotate === 0) {
        callback(null, $, item);
        return;
    }

    var jItem = $('#' + item._id);
    jItem.css({
        '-webkit-transform': 'rotate(' + item.rotate + 'deg)'
    }, function () {
        callback(null, $, item);
    });
}

function setIcon($, item, callback) {
    if (!item.iconType) {
        callback(null, $, item);
        return;
    }

    var jItem = $('#' + item._id);
    jItem.append('<span class="glyphicon glyphicon-' + item.iconType + '"></span>', function () {
        callback(null, $, item);
    });
}

function setTextValue($, item, callback) {
    var jItem = $('#' + item._id);

//    jItem.append('<input type="text" value="' + item.value + '" style="width: 100%; height: 100%">', function () {
//        callback(null, $, item);
//    });
    jItem.text(item.value, function () {
        callback(null, $, item);
    });
}
function setFont($, item, callback) {
    var jItem = $('#' + item._id);

    var str = '';
    if (item.font.italic) {
        str += 'italic ';
    }
    if (item.font.bold) {
        str += 'bold ';
    }
    str += item.font.size + 'px ';
    str += item.font.family;

    jItem.css('font', str, function () {
        jItem.css('color', '#' + item.font.color.getColorCode(), function () {
            callback(null, $, item);
        })
    });
}

function setAlign($, item, callback) {
    var jItem = $('#' + item._id);

    jItem.css('text-align', item.align, function () {
        callback(null, $, item);
    });
}

function setVerticalAlign($, item, callback) {
    var jItem = $('#' + item._id);

    jItem.css('vertical-align', item.align, function () {
        callback(null, $, item);
    });
}

function setLink($, item, callback) {
    var jItem = $('#' + item._id);

    jItem.html(function (ori) {
        jItem.html(' ', function () {
            jItem.append('<A href="' + item.url + '">' + ori + '</A>', function () {
                callback(null, $, item);
            });
        })
    });
}

function paperToHTML($, parent, paper, callback) {
    async.waterfall([
        function (_callback) { // add div
            parent.append('<div id="' + paper._id + '"></div>', _callback);
        },
        function (_callback) {
            var jPaper = $('#' + paper._id);

            async.each(paper.childArr, function (child, __callback) {
                switch (child.layoutComponentType) {
                    case LayoutComponentType.article:
                        articleToHTML($, jPaper, child, __callback);
                        break;

                    case LayoutComponentType.item:
                        itemToHTML($, jPaper, child, __callback);
                        break;
                }
            }, _callback);
        }
    ], callback)
}

function templateToHTML($, parent, template, callback) {

    template.target._id = genID();

    articleToHTML($, parent, template.target, callback);
}

function articleToHTML($, parent, article, callback) {

    async.waterfall([
        function (_callback) { // add div
            parent.append('<div id="' + article._id + '"></div>', _callback);
        },
        function (_callback) {

            var jArticle = $('#' + article._id);

            async.each(article.childArr, function (item, __callback) {
                itemToHTML($, jArticle, item, __callback);
            }, _callback);
        }
    ], callback);
}

function itemToHTML($, parent, item, callback) {

    async.waterfall([
        function (_callback) {
            parent.append('<div id="' + item._id + '"></div>', function () {
                _callback(null, $, item);
            });
        },
        setSize,
        setPos,
        setOutline,
        setFill,
        setRadius,
        setRotate,
        function ($, item, __callback) {
            switch (item.itemType) {
                case ItemType.icon:
                    setIcon($, item, __callback);
                    break;

                case ItemType.text:
                case ItemType.link:
                    setTextValue($, item, function () {
                        setFont($, item, function () {
                            setAlign($, item, function () {
                                setVerticalAlign($, item, __callback);
                            });
                        });
                    });
                    break;

                default:
                    __callback();
                    break;

//                case ItemType.link:
//                    setTextValue($, item, function () {
//                        setFont($, item, function () {
//                            setAlign($, item, function () {
//                                setVerticalAlign($, item, function() {
//                                    setLink($, item, __callback);
//                                });
//                            });
//                        });
//                    });
//                    break;
//
//                case ItemType.line:
//                    break;
//
//                case ItemType.image:
//                    break;
            }
        }
    ], function () {
        callback();
    });
}


var exports = {
    itemToHTML: itemToHTML,
    articleToHTML: articleToHTML,
    paperToHTML: paperToHTML,
    templateToHTML: templateToHTML
}

module.exports = exports;
