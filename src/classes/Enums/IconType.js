/**
 * Created by careerBox on 2014-11-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var IconType = {
        asterisk: 'asterisk',
        plus: 'plus',
        euro: 'euro',
        minus: 'minus',
        cloud: 'cloud',
        envelope: 'envelope',
        pencil: 'pencil',
        glass: 'glass',
        music: 'music',
        search: 'search',
        heart: 'heart',
        star: 'star',
        star_empty: 'star_empty',
        user: 'user',
        film: 'film',
        th_large: 'th_large'
    };

    return IconType;
});