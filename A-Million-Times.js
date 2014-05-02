function(env){
	"use strict";

    //For browsers without Object.create
    if (typeof Object.create === "undefined") {
        Object.create = function(o) {
            function F() {
            }
            F.prototype = o;
            return new F();
        };
    }

    var NUM_CLOCKS_X = 30;
    var NUM_CLOCKS_Y = 20;
    var CLOCK_SIZE = 20;

    function Clock(x, y){
    	this.x = x;
    	this.y = y;
    }

	Clock.prototype.turn(hand, angle, time){
		if(hand == "min"){

		}else if(hand == "hr"){

		}
	};


}(this);