/**
 * Created by Bo-ram on 2014-11-09.
 */
define(function(){
    function Item(){
        this._id;
        this.type;
        this.pos = {x: 0, y: 0};
        this.size = {width: 0, height:0};
        this.status;
    }

    return Item;
});
