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

        this.minAngle = 90.0;
        this.hrAngle = 270.0;

        this.paper = paper;


        paper.circle(x, y, CLOCK_SIZE);
        this.minHand = paper.path("M" + x + "," + y + "l0,-" + CLOCK_SIZE);
        this.hrHand = paper.path("M" + x + "," + y + "l0," + CLOCK_SIZE * HR_TO_MIN_RATIO);
    }

    Clock.prototype.turn = function(hand, angle, time) {
        function recur(rHand) {
            if (angle > ANGLE_STEP) {
                angle -= ANGLE_STEP;
                obj[rHand + "Angle"] = cirAngle(obj[rHand + "Angle"], -1 * ANGLE_STEP);
                obj[rHand + "Hand"].animate({"path": "M" + obj.x + "," + obj.y + "l" + CLOCK_SIZE * Math.cos(rad(obj[rHand + "Angle"])) + "," + -1 * CLOCK_SIZE * Math.sin(rad(obj[rHand + "Angle"]))},
                stepTime,
                        "linear",
                        function() {
                            recur(rHand)
                        });
            } else {
                obj[rHand + "Angle"] = cirAngle(obj[rHand + "Angle"], -1 * angle);
                obj[rHand + "Hand"].animate({"path": "M" + obj.x + "," + obj.y + "l" + CLOCK_SIZE * Math.cos(rad(obj[rHand + "Angle"])) + "," + -1 * CLOCK_SIZE * Math.sin(rad(obj[rHand + "Angle"]))},
                stepTime * (angle / ANGLE_STEP),
                        "linear");
            }

        }

        var stepTime = 1.0 * time / (angle / ANGLE_STEP);
        var obj = this;


        recur(hand);
    };

    Clock.prototype.turnTo = function(hand, posAngle, extraRounds ,time){
        var angle = posAngle - this[hand+"Angle"];

        angle = cirAngle(angle);
        angle += extraRounds*360;
        this.turn(hand, angle, time);
    }

    function rad(deg) {
        return deg / 180 * Math.PI;
    }

    function deg(rad) {
        return rad / Math.PI * 180;
    }

    function cirAngle(angle, step) {
        angle += step;

        if (angle < 0) {
            angle += 360;
        }
        angle %= 360;
        return angle;
    }

    env.AMillionTimes = function(width, height) {
        this.paper = Raphael(20, 20, width, height);

        var c = new Clock(50, 50, this.paper);
        c.turn("min", 360, 10000);
        c.turn("hr",360, 10000);
    }
})(this);