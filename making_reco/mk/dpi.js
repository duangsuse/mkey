`.control (div label[t="quality (dpi)"]+label[id=curDPI,_float:right])+labeled-range[type=range,min=0.1,step=0.1]+div (button[id=useScrDPI]+small[t=当然我们看不到比屏幕DPI更大的])`

el.href("stats.js/r16/Stats jquery/jquery-1.11.1.min.js")
el.href`
.controls {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  box-shadow: 0 0 10px 0 #999;
}
canvas {
  display: block;
}
`
el("canvas")
colors="#233D4D #ee0000 #66ccff #673ab7 #8ACB88".split(" ")

quality = devicePixelRatio,maxQuality = 10 //max[t],curDPI[v]-bind
e.id.useScrDPI.let(wOp.click(_=>{quality=device}))

(new Stats).apply(_=>{
  Object.assign(domElement.style,{position:"absolute",right:0,top:0})
})
ScaledVal=Newtype(Number,{get_val:(n)=>n*quality}),
Point=Newtype(Array, {val:a=>a.map(x=>x.val)})

function inside(r, p) {
  var left = r.position.val[0],
      top = r.position.val[1],
      right = left + r.size.val,
      bottom = top + r.size.val,
      px = p.val[0],
      py = p.val[1];
  return px > left && px < right && py > top && py < bottom;
}

winSize=prop(win).bind("width",Point(),o=>{let [w,h]=win.rect; o.sets(w,h)})()
eCan.let(wBind(winSize, _=>wSty({_width:_[0],_height:_[1]})))

lSquare=ScaledVal(50), cursor=Point(0,0), sqs=makeGrid()

wOp.mousemove(ev=>{cursor.sets(ev.clientX, ev.clientY)})(win)

function makeSquare(position) {
  return {
      position: position,
      size: squareSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.2
  };
}

function makeGrid() {
  var position = Point.create(0, 0);
  var grid = [];
  while ((position.val[0] + squareSize.val < width.val || position.val[1] + squareSize.val < height.val) && grid.length < 5000) {
      grid.push(makeSquare(position));
      var nx = position.values[0].actual + squareSize.actual,
          ny = position.values[1].actual;
      if (nx > width.actual) {
          nx = 0;
          ny += squareSize.actual;
      }
      position = Point.create(nx, ny);
  }
  return grid;
}

function updateSquares() {
  for (var i = 0; i < squares.length; i++) {
      if (inside(squares[i], cursor)) {
          squares[i].opacity = 0.5;
          squares[i].color = 'black';
          continue;
      }
      squares[i].opacity -= Math.random() / 100;
      if (squares[i].opacity < 0.1) {
          squares[i] = makeSquare(squares[i].position); //k color
      }
  }
}

function setSize() {
  width = ScaledValue.create(window.innerWidth), height = ScaledValue.create(window.innerHeight);//dup L26
  canvasNode.width = width.val;
  canvasNode.height = height.val;
  canvasNode.style.width = width.actual + 'px';
  canvasNode.style.height = height.actual + 'px';
  squares = makeGrid();
}
window.addEventListener('resize', setSize);

function drawSquare(square) {
  context.globalCompositeOperation = "screen"; // 和 DIP 根本无关，抄的，笑死
  context.globalAlpha = square.opacity;
  context.fillStyle = square.color;
  context.fillRect(square.position.val[0], square.position.val[1], square.size.val, square.size.val);
}

function clear() {
  context.clearRect(0, 0, width.val, height.val);
}

function render() {
  requestAnimationFrame(render);

  stats.begin();
  clear();

  updateSquares();
  squares.forEach(drawSquare);
  stats.end();
}

render();
