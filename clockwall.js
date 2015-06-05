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
    var CLOCK_SIZE = 20;
    var ANGLE_STEP = 1;
    var HR_TO_MIN_RATIO = 0.9;

    function Clock(x, y, paper) {
        this.x = x;
        this.y = y;

        this.minAngle = 0;
        this.hrAngle = 0;

        this.minCount = 0;
        this.hrCount = 0;

        this.paper = paper;

        paper.circle(x, y, CLOCK_SIZE);
        this.minHand = paper.path("M" + x + "," + y + "l0,-" + CLOCK_SIZE);
        this.hrHand = paper.path("M" + x + "," + y + "l0," + CLOCK_SIZE * HR_TO_MIN_RATIO);
    }

    Clock.prototype.turn = function(hand, angle, time, endFunc) {
        this[hand+"Angle"] += angle;
        this[hand+"Hand"].animate({"transform": "r" + this[hand+"Angle"] + "," + this.x + "," + this.y}, time, endFunc(this));

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

/*
    function create2DArray(cols, rows, iniVal){
        var array = new Array(cols);
        for (var i = 0; i < array.length; i++) {
            array[i] = new Array(rjws);
            for (var j = 0; j < array[i].length; j++) {
                   array[i][j] = iniVal;
               };   
        };

        return array;
    }
*/
    env.clockwall = function(width, height) {
        this.paper = Raphael(20, 20, width, height);

        console.log(schemes);

        var select = Math.floor(Math.random()*schemes.length);

        var hrScheme = schemes[select].hrHand;
        var minScheme = schemes[select].minHand;

        var s = new Scheme(minScheme,hrScheme);
        var clock1 = new Clock(50,50, this.paper);
        var clock2 = new Clock(50,50+2*CLOCK_SIZE,this.paper);

        s.callBackFunction(0,0, "min")(clock1)();
        s.callBackFunction(0,1,"min")(clock2)();
    }

})(this);