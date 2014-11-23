/**
 * Created by careerBox on 2014-11-22.
 */


var requirejs = require('../require.config');

var ItemType = requirejs('classes/Enums/ItemType');

var async = require('async');

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

function setIconType($, item, callback) {
    if (!item.iconType) {
        callback(null, $, item);
        return;
    }

    var jItem = $('#' + item._id);
    jItem.append('<span class="glyphicon glyphicon-' + item.iconType + '"></span>', function () {
        callback(null, $, item);
    });
}

function itemToHTML($, item, callback) {

    async.waterfall([
        function (_callback) {
            $('body').append('<div id="' + item._id + '"></div>', function () {
                _callback(null, $, item);
            });
        },
        setSize,
        setPos,
        setOutline,
        setFill,
        setRadius,
        setRotate,
        function($, item, callback) {
            switch (item.itemType) {
                case ItemType.icon:
                    setIconType($, item, callback);
                    break;

                case ItemType.text:
                    break;

                case ItemType.link:
                    break;

                case ItemType.line:
                    break;

                case ItemType.image:
                    break;
            }
        }
    ], function () {
        callback();
    });
}


var exports = {
    itemToHTML: itemToHTML
}

module.exports = exports;
