const ZOOM = 8;//https://ednl.github.io/mandelbrotjs/
const MAXITER = 720;
const MINX = -2.00, MAXX = 1.00;
const MINY = -1.25, MAXY = 1.25;

let minx = MINX, maxx = MAXX;
let miny = MINY, maxy = MAXY;
let panleft, panright, panup, pandown, zoomin, zoomout, reset, save;

function mousePressed() {
	const px = mouseX;
	const py = mouseY;
	if (px >= 0 && px < width && py >= 0 && py < height) {
		const a = map(px, 0, width, minx, maxx);
		const b = map(py, 0, height, miny, maxy);
		const len = a * a + b * b;
		if (len <= 4) {
			let factor = 0.5 / ZOOM;
			const w = (maxx - minx) * factor;
			const h = (maxy - miny) * factor;
			minx = a - w;
			maxx = a + w;
			miny = b - h;
			maxy = b + h;
			mandelbrot();
			return false;
		}
	}
}

function mandelbrot() {
	loadPixels();
	let pix = 0;
	for (let py = 0; py < height; ++py) {
		const cb = map(py, 0, height, miny, maxy);
		for (let px = 0; px < width; ++px) {
			const ca = map(px, 0, width, minx, maxx);

			let i = 0;
			let a = ca, b = cb;
			let len = a * a + b * b;
			const alph = max(0, map(len, 0, 4, 255, 15));
			while (i < MAXITER && len <= 4) {
				const a1 = a*a - b*b + ca;
				const b1 = 2*a*b + cb;
				if (a1 == a && b1 == b) {
					i = MAXITER;
				} else {
					a = a1;
					b = b1;
					len = a * a + b * b;
					++i;
				}
			}

			if (i == 0 || i == MAXITER) {
				pixels[pix] = 0;
				pixels[pix + 1] = 0;
				pixels[pix + 2] = 0;
			} else {
				const c = color(i, 100, 100, 1);
				pixels[pix] = red(c);
				pixels[pix + 1] = green(c);
				pixels[pix + 2] = blue(c);
			}
			pixels[pix + 3] = alph;
			pix += 4;
		}
	}
	updatePixels();
}

function setup() {
	pixelDensity(1);
	createCanvas(900, 750);
	colorMode(HSB, MAXITER, 100, 100, 1);
	panleft = createButton('Go Left');
	panleft.mousePressed(() => {
		const x = (maxx + minx) / 2;
		const w = (maxx - minx) / 3;
		minx = x - w * 2;
		maxx = x + w;
		mandelbrot();
	});
	panright = createButton('Go Right');
	panright.mousePressed(() => {
		const x = (maxx + minx) / 2;
		const w = (maxx - minx) / 3;
		minx = x - w;
		maxx = x + w * 2;
		mandelbrot();
	});
	panup = createButton('Go Up');
	panup.mousePressed(() => {
		const y = (maxy + miny) / 2;
		const h = (maxy - miny) / 3;
		miny = y - h * 2;
		maxy = y + h;
		mandelbrot();
	});
	pandown = createButton('Go Down');
	pandown.mousePressed(() => {
		const y = (maxy + miny) / 2;
		const h = (maxy - miny) / 3;
		miny = y - h;
		maxy = y + h * 2;
		mandelbrot();
	});
	zoomin = createButton('Zoom In');
	zoomin.mousePressed(() => {
		const zoom = 4;
		const x0 = (minx + maxx) / 2;
		const y0 = (miny + maxy) / 2;
		const w = (maxx - minx) / 2 / zoom;
		const h = (maxy - miny) / 2 / zoom;
		minx = x0 - w;
		maxx = x0 + w;
		miny = y0 - h;
		maxy = y0 + h;
		mandelbrot();
	});
	zoomout = createButton('Zoom Out');
	zoomout.mousePressed(() => {
		const zoom = 4;
		const x0 = (minx + maxx) / 2;
		const y0 = (miny + maxy) / 2;
		const w = (maxx - minx) / 2 * zoom;
		const h = (maxy - miny) / 2 * zoom;
		minx = x0 - w;
		maxx = x0 + w;
		miny = y0 - h;
		maxy = y0 + h;
		mandelbrot();
	});
	reset = createButton('Reset');
	reset.mousePressed(() => {
		minx = MINX; maxx = MAXX;
		miny = MINY; maxy = MAXY;
		mandelbrot();
	});
	save = createButton('Save');
	save.mousePressed(() => saveCanvas('mandelbrot', 'jpg'));
	mandelbrot();
}
