(function(env) {
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
    var CLOCK_SIZE = 15;
    var HR_TO_MIN_RATIO = 0.9;

    function Clock(x, y, paper) {
        this.x = x;
        this.y = y;

        this.minAngle = 0;
        this.hrAngle = 0;

        this.minCount = 0;
        this.hrCount = 0;

        this.paper = paper;

        paper.circle(x, y, CLOCK_SIZE).attr({"stroke" : "grey"});
        this.minHand = paper.path("M" + x + "," + y + "l0,-" + CLOCK_SIZE).attr({"stroke-width": "2"});
        this.minHand.node.id = "aaa";
        this.hrHand = paper.path("M" + x + "," + y + "l0," + CLOCK_SIZE * HR_TO_MIN_RATIO).attr({"stroke-width": "2"});
    }

    Clock.prototype.turn = function(hand, angle, time, endFunc) {
        if(angle === 0){
            TweenLite.delayedCall(time/1000, endFunc(this));
        } else{
            console.log(time/1000);
            TweenLite.to(this[hand+"Hand"], time/1000, {raphael:{rotation: "+="+angle, globalPivot:{x: this.x, y: this.y}}, ease:Linear.easeNone, onComplete: endFunc(this)});
        }
    };

    Clock.prototype.resetCount = function(){
        this.minCount = 0;
        this.hrCount = 0;
    };

    Clock.prototype.resetAngle = function(){
        this.minAngle = 0;
        this.hrAngle = 0;
    };

    function Scheme(minData, hrData){
        this.minData = minData;
        this.hrData = hrData;
    }

    Scheme.prototype.callBackFunction = function(x, y, hand){
        
        var list = this[hand + "Data"][x][y];

        var func = function(clock){
            return function(){
                var count = clock[hand+"Count"];
                if(count < list.length){
                    var instruct = list[count];
                    clock[hand+"Count"]++;
                    clock.turn(hand, instruct[0],instruct[1], func);
                }
            }
        };

        return func;
    };

    env.Clockwall = function(container, width, height) {
        this.paper = Raphael(container, width, height);

        var select = Math.floor(Math.random()*schemes.length);

        var hrScheme = schemes[select].hrHand;
        var minScheme = schemes[select].minHand;

        var s = new Scheme(minScheme,hrScheme);
        
        for(var i = 0; i < NUM_CLOCKS_X; i++){
            for(var j = 0; j < NUM_CLOCKS_Y; j++){
                var clock = new Clock(CLOCK_SIZE + i * 2 * CLOCK_SIZE, CLOCK_SIZE + j * 2 * CLOCK_SIZE, this.paper);
                s.callBackFunction(i, j, "min")(clock)();
                s.callBackFunction(i, j, "hr")(clock)();
            };
        };
    }

})(this);
