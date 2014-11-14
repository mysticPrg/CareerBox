/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Size',
    'classes/Structs/Position',
    'classes/Structs/Outline',
    'classes/Structs/Fill'
], function (Size, Position, Outline, Fill) {

    function LayoutComponent() {
        this._id = null;
        this.size = new Size();
        this.pos = new Position();
        this.outline = new Outline();
        this.fill = new Fill();
        this.radius = 0;
        this.rotate = 0;
    };

    return LayoutComponent;
});