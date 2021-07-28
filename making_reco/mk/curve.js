// quadratic curve maths adapted from: http://wa.zozuar.org/code.php?c=9os2
// LOVE MATRIX by nutsu, a study for drawing curl curve.
"use strict";
el.href`
body,
html {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    user-select: none;
}
canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    user-select: none;
    touch-action: none;
    content-zooming: none;
    background: #000;
    cursor: crosshair;
}
`
class Mat2 {
    constructor() {
        this.a = 1.0;
        this.b = 0.0;
        this.c = 0.0;
        this.d = 1.0;
        this.tx = 0.0;
        this.ty = 0.0;
    }
    static create() {
        return new Mat2();
    }
    multiply(b) {
        const aa = this.a,
            ab = this.b,
            ac = this.c,
            ad = this.d;
        this.a = aa * b.a + ac * b.b;
        this.b = ab * b.a + ad * b.b;
        this.c = aa * b.c + ac * b.d;
        this.d = ab * b.c + ad * b.d;
        this.tx += aa * b.tx + ac * b.ty;
        this.ty += ab * b.tx + ad * b.ty;
        return this;
    }
    rotate(rad) {
        const aa = this.a,
            ab = this.b,
            ac = this.c,
            ad = this.d;
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        this.a = aa * c + ac * s;
        this.b = ab * c + ad * s;
        this.c = aa * -s + ac * c;
        this.d = ab * -s + ad * c;
        return this;
    }
    translate(x, y) {
        this.tx += this.a * x + this.c * y;
        this.ty += this.b * x + this.d * y;
        return this;
    }
    scale(x, y) {
        this.a *= x;
        this.b *= x;
        this.c *= y;
        this.d *= y;
        return this;
    }
}
class WormObject {
    constructor(x, y, vx, vy, len) {
        this.vmt = Mat2.create().translate(x, y).rotate(Math.atan2(vy, vx));
        const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4);
        this.tmt = Mat2.create().scale(0.92, 0.92).translate(len, 0).rotate(angle);
        this.c1x = this.p1x = -0.5 * this.vmt.c + this.vmt.tx;
        this.c1y = this.p1y = -0.5 * this.vmt.d + this.vmt.ty;
        this.c2x = this.p2x = 0.5 * this.vmt.c + this.vmt.tx;
        this.c2y = this.p2y = 0.5 * this.vmt.d + this.vmt.ty;
        this.r = angle;
        this.w = len * 0.4;
    }
    draw() {
        if (Math.random() > 0.9) {
            this.tmt.rotate(-this.r * 2);
            this.r *= -1;
        }
        this.vmt.multiply(this.tmt);
        const cc1x = -this.w * this.vmt.c + this.vmt.tx;
        const cc1y = -this.w * this.vmt.d + this.vmt.ty;
        const pp1x = (this.c1x + cc1x) / 2;
        const pp1y = (this.c1y + cc1y) / 2;
        const cc2x = this.w * this.vmt.c + this.vmt.tx;
        const cc2y = this.w * this.vmt.d + this.vmt.ty;
        const pp2x = (this.c2x + cc2x) / 2;
        const pp2y = (this.c2y + cc2y) / 2;
        ctx.beginPath();
        ctx.shadowColor = "#000";
        ctx.shadowBlur = this.w * 2;
        ctx.shadowOffsetX = this.w * 0.5;
        ctx.shadowOffsetY = this.w * 0.5;
        ctx.strokeStyle = "#fff";
        ctx.fillStyle = `hsl(${Math.round(this.w * 6 - (hue += 0.04))}, 80%, 60%)`;
        ctx.moveTo(this.p1x, this.p1y);
        ctx.quadraticCurveTo(this.c1x, this.c1y, pp1x, pp1y);
        ctx.lineTo(pp2x, pp2y);
        ctx.quadraticCurveTo(this.c2x, this.c2y, this.p2x, this.p2y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.c1x = cc1x;
        this.c1y = cc1y;
        this.p1x = pp1x;
        this.p1y = pp1y;
        this.c2x = cc2x;
        this.c2y = cc2y;
        this.p2x = pp2x;
        this.p2y = pp2y;
    }
}
const canvas = {
    init() {
            this.elem = document.querySelector("canvas");
            this.resize();
            window.addEventListener("resize", () => this.resize(), false);
            return this.elem.getContext("2d");
        },
        resize() {
            this.width = this.elem.width = this.elem.offsetWidth;
            this.height = this.elem.height = this.elem.offsetHeight;
        }
};
const pointer = {
    frame: 0,
    grow(x, y) {
        const vx = x - this.px;
        const vy = y - this.py;
        const len = Math.min(Math.sqrt(vx * vx + vy * vy), 150);
        if (len < 10) return;
        vms.push(new WormObject(x, y, vx, vy, len));
        this.px = x;
        this.py = y;
    },
    move(e, touch) {
        e.preventDefault();
        const pointer = touch ? e.targetTouches[0] : e;
        this.x = pointer.clientX;
        this.y = pointer.clientY;
        this.grow(this.x, this.y);
        this.frame++;
        if (!(this.frame % 2)) {
            ctx.fillStyle = "rgba(0, 8, 16, 0.02)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },
    init(canvas) {
        canvas.elem.addEventListener("mousemove", e => this.move(e, false), false);
        canvas.elem.addEventListener("touchmove", e => this.move(e, true), false);
    }
};
const ctx = canvas.init();
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
pointer.init(canvas);
const vms = [];
let hue = 180;
const run = () => {
    requestAnimationFrame(run);
    for (let i = 0; i < vms.length; i++) {
        const o = vms[i];
        const x = o.vmt.a * o.vmt.a + o.vmt.b * o.vmt.b;
        if (x * o.w < 0.01) {
            vms.splice(i, 1);
            i--;
        } else o.draw();
    }
};
for (let a = 0; a < 2 * Math.PI; a += Math.random() > 0.9 ? 0.5 : 0.1) {
    setTimeout(() => {
        pointer.grow(
            canvas.width * 0.5 + Math.cos(a) * canvas.width * 0.25,
            canvas.height * 0.5 + Math.sin(a) * canvas.height * 0.25
        );
    }, a * 200);
}
run();