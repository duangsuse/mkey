//割线动画 https://wow.techbrood.com/fiddle/32154
/* Canvas Setup */
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.style.position = "absolute";
canvas.style.left = 0;
canvas.style.top = 0;
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

/* Runtime variables */
var lastTime; // time of the last frame
var deltaTime; // diffrence in time since last frame
var progress; // used to mesure 
var animationID;

/* App variables */
var line = [];
var moveSpeed = 100; // pixels per second
var waitTime = 3500;
var iterations = 18; // CAREFUL THIS AFECTS PERFORMANCE

/* Objects */
class P {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    substract(p) {
        var result = new P(this.x - p.x, this.y - p.y);
        return result;
    }
    add(p) {
        var result = new P(this.x + p.x, this.y + p.y);
        return result;
    }
    divide(value) {
        if (value == 0)
            return this;
        var result = new P(this.x / value, this.y / value);
        return result;
    }
    multiply(value) {
        var result = new P(this.x * value, this.y * value);
        return result;
    }
    distance() {
        return (Math.sqrt(this.x * this.x + this.y * this.y));
    }
    normal() {
        return this.divide(this.distance());
    }
}
class lineNode {
    constructor(startPos, endPos) {
        this.current = startPos;
        this.end = endPos;
    }
    update() {
        var next = this.end.substract(this.current);
        if (next.distance() < moveSpeed * deltaTime / 1000) {
            this.current = this.end;
        } else {
            next = next.normal();
            next = next.multiply(moveSpeed * deltaTime / 1000);
            next = next.add(this.current);
            this.current = next;
        }
    }
}

/* Event handlers */
window.addEventListener('resize', function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    init();
});

/* Functions */
function init() {
    window.cancelAnimationFrame(animationID);

    progress = 0;

    line = [];
    line.push(new lineNode(new P(0, h / 2), new P(w / 4, 3 * h / 5)));
    line.push(new lineNode(new P(w, h / 2), new P(3 * w / 4, 3 * h / 5)));

    animationID = window.requestAnimationFrame(loop);
}

function splitLine() {
    var newLine = [];
    newLine.push(line[0]);
    for (var i = 1; i < line.length; i++) {
        var current = line[i].end.substract(line[i - 1].end).divide(2);
        var end;
        if (i % 2 != 0) {
            end = current.add(new P(current.y, -current.x))
        } else {
            end = current.add(new P(-current.y, current.x))
        }
        current = current.add(line[i - 1].end);
        end = end.add(line[i - 1].end);
        var node = new lineNode(current, end);
        newLine.push(node);
        newLine.push(line[i]);
    }
    line = newLine;
}

function update() {
    if (progress > waitTime && iterations > 0) {
        progress = 0;
        splitLine();
        iterations--;
        waitTime = waitTime * 0.8
    }

    line.forEach((node) => {
        node.update();
    });
}

function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.moveTo(line[0].current.x, line[0].current.y);
    line.forEach((node) => {
        ctx.lineTo(node.current.x, node.current.y);
    });
    ctx.stroke();
}

function loop(timestamp) {
    if (!lastTime)
        lastTime = timestamp;
    deltaTime = timestamp - lastTime;
    progress += deltaTime;
    lastTime = timestamp;

    update();
    if (progress < waitTime)
        draw();
    /*
    ctx.clearRect(0,0,300,100)
    ctx.font = "16px Consolas";
    //ctx.fillText( Math.floor(1000/deltaTime) + " fps", 10, 20);
    ctx.fillText( "timestamp: " + timestamp , 10, 20);
    ctx.fillText( "lastTime:  " + lastTime , 10, 40);
    ctx.fillText( "detaTime:  " + deltaTime , 10, 60);
    ctx.fillText( "progress:  " + progress , 10, 80);
    */

    animationID = window.requestAnimationFrame(loop);
}

init();