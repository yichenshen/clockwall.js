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
    var START_DELAY = 1500;

    function Clock(x, y, paper) {
        this.x = x;
        this.y = y;

        this.minDelay = 0;
        this.hrDelay = 0;

        this.paper = paper;

        paper.circle(x, y, CLOCK_SIZE).attr({"stroke" : "grey"});
        this.minHand = paper.path("M" + x + "," + y + "l0,-" + CLOCK_SIZE).attr({"stroke-width": "2"});
        this.minHand.node.id = "aaa";
        this.hrHand = paper.path("M" + x + "," + y + "l0," + CLOCK_SIZE * HR_TO_MIN_RATIO).attr({"stroke-width": "2"});
    }

    Clock.prototype.queueTurnMin = function(angle, time, tl) {
        
        tl.to(this.minHand, time/1000, {raphael:{rotation: "+="+angle, globalPivot:{x: this.x, y: this.y}}, ease:Linear.easeNone}, this.minDelay/1000);

        this.minDelay += time;
    };

    Clock.prototype.queueTurnHr = function(angle, time, tl){
        tl.to(this.hrHand, time/1000, {raphael:{rotation: "+="+angle, globalPivot:{x: this.x, y: this.y}}, ease:Linear.easeNone}, this.hrDelay/1000);

        this.hrDelay += time;
    }

    function Scheme(minData, hrData){
        this.minData = minData;
        this.hrData = hrData;
        this.timeLine = new TimelineLite();
    }

    Scheme.prototype.animate = function(clocks){
        
        for(var i = 0; i < clocks.length; i++){
            for(var j = 0; j < clocks[i].length; j++){
                var minList = this.minData[i][j];
               
                for(var k = 0; k < minList.length; k++){
                   clocks[i][j].queueTurnMin(minList[k][0], minList[k][1], this.timeLine);
                }

                var hrList = this.hrData[i][j];

                for(var k = 0; k < hrList.length; k++){
                    clocks[i][j].queueTurnHr(hrList[k][0], hrList[k][1], this.timeLine);
                }
            }
        }
    };

    env.Clockwall = function(container, width, height) {

        this.paper = Raphael(container, width, height);

        var clocks = new Array(NUM_CLOCKS_X);

        for(var i = 0; i < NUM_CLOCKS_X; i++){
            clocks[i] = new Array(NUM_CLOCKS_Y);
            for(var j = 0; j < NUM_CLOCKS_Y; j++){
                clocks[i][j] = new Clock(CLOCK_SIZE + i * 2 * CLOCK_SIZE, CLOCK_SIZE + j * 2 * CLOCK_SIZE, this.paper);
            };
        };

        var select = Math.floor(Math.random()*schemes.length);

        var hrScheme = schemes[select].hrHand;
        var minScheme = schemes[select].minHand;

        var s = new Scheme(minScheme,hrScheme);
        TweenLite.delayedCall(START_DELAY/1000, s.animate, [clocks], s);       
    }

})(this);

