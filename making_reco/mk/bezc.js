(function() {//margin,ovf
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
// ends requestAnimationFrame polyfill

var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cw = c.width = window.innerWidth;
var ch = c.height = window.innerHeight;



ctx.globalAlpha = .1;
ctx.lineWidth = 2;
var kappa = 0;


var T = 0;

var bezierRy = [{
        color: "Tomato",
        r: 550,
        x0: -150,
        y0: -150,
        x1: cw / 4,
        y1: ch,
        x2: cw / 2,
        y2: -ch / 2,
        x3: cw,
        y3: ch / 2
    }, {
        color: "Chartreuse",
        r: 300,
        x0: -300,
        y0: ch - 250,
        x1: 4 * cw / 5,
        y1: -2 * ch / 3,
        x2: cw / 2,
        y2: 2 * ch / 3,
        x3: cw,
        y3: ch / 2
    },

    {
        color: "gold",
        r: 200,
        x0: -200,
        y0: 450,
        x1: cw / 4,
        y1: -2 * ch / 3,
        x2: cw / 2,
        y2: 2 * ch / 3,
        x3: cw,
        y3: ch / 2
    }, {
        color: "LightSkyBlue",
        r: 150,
        x0: -100,
        y0: 250,
        x1: cw / 2,
        y1: 2 * ch / 3,
        x2: cw / 4,
        y2: -2 * ch / 3,
        x3: cw,
        y3: ch / 2
    }
]


var increment = .4 / bezierRy.length;

function shamrock(w, h, x, y) {

    kappa = -1.25;

    var ox = (w / 2) * kappa; // desplasamiento horizontal (offset x);
    var oy = (h / 2) * kappa; // desplazamiento vertical (offset y);
    var xf = x + w; // x final
    var yf = y + h; // y final
    var xm = x + w / 2; // x medio
    var ym = y + h / 2; // y medio


    ctx.beginPath();

    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xf, ym - oy, xf, ym);
    ctx.bezierCurveTo(xf, ym + oy, xm + ox, yf, xm, yf);
    ctx.bezierCurveTo(xm - ox, yf, x, ym + oy, x, ym);
    ctx.closePath();
    ctx.stroke();
    console.log("sham")
}

function DrawShamrock(i) {

    if (T > 100) {
        T = 0;
    } else {
        T += increment;
    };

    var w = bezierRy[i].r;
    var h = bezierRy[i].r;
    var x0 = -bezierRy[i].r;
    var y0 = bezierRy[i].y0;
    var x1 = bezierRy[i].x1;
    var y1 = bezierRy[i].y1;
    var x2 = bezierRy[i].x2;
    var y2 = bezierRy[i].y2;
    var x3 = bezierRy[i].x3;
    var y3 = bezierRy[i].y3;




    //ctx.strokeStyle = "white";
    ctx.strokeStyle = bezierRy[i].color;

    ctx.lineWidth = 1; //bezierRy[i].lineWidth;
    //point on a Bézier curve                         
    var t = T / 100; // t toma valores entre 0 - 1
    var x = (1 - t) * (1 - t) * (1 - t) * x0 + 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t * x3;
    var y = (1 - t) * (1 - t) * (1 - t) * y0 + 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t * y3;



    shamrock(w, h, x, y);

    //ctx.globalCompositeOperation="xor";	  

}

function Draw() {

    for (var i = 0; i < bezierRy.length; i++) {
        DrawShamrock(i);
    }
    requestId = window.requestAnimationFrame(Draw);

}







function start() {
    console.log("start")
    requestId = window.requestAnimationFrame(Draw);
    stopped = false;
}

function stopAnim() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
    }
    stopped = true;
}



window.addEventListener("load", start, false);


window.setInterval(stopAnim, cw * 10);
c.addEventListener("click", function() {
    (stopped == true) ? start(): stopAnim();
}, false);

//window.onresize = function(){ location.reload(); }
