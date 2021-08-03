drawSky(ctx, geom) {
    const { height, width } = geom
    // 绘制矩形背景
    ctx.rect(0, 0, width, height)
    ctx.stroke()

    // 为矩形背景添加渐变的夜空
    const skyGradient = ctx.createLinearGradient(0, 0, width, height);
    skyGradient.addColorStop(0, '#3323CB')
    skyGradient.addColorStop(1, '#090A55')
    ctx.fillStyle = skyGradient
    ctx.fill()
}

drawStar(ctx) {
  const starColor = '#FFE900'
  const x = 10
  const y = 10
  const r = 5
  
  ctx.translate(x, y)
  ctx.scale(r, r);

  ctx.beginPath()
  // 绘制五角星
  for (var i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI),
      -Math.sin((18 + i * 72) / 180 * Math.PI));
    ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 0.5,
      -Math.sin((54 + i * 72) / 180 * Math.PI) * 0.5);
  }
  ctx.closePath();

  // 填充颜色
  ctx.fillStyle = starColor
  ctx.fill()

}

drawVariousStars(ctx, geom) {
  const { width, height } = geom
  const Num = 10 // 个数
  // 随机展示星星
  for (var i = 0; i < Num; i++) {
    var r = Math.random() * 5 + 5;
    var x = Math.random() * width;
    var y = Math.random() * height * 0.65;
    var a = Math.random() * 360;
    this.drawStar(ctx, r, x, y, a);
  }
}

window.CSS.registerProperty({ //-end, --star-color, -num
  name: '--sky-color-start', // 变量名, @property Name
  syntax: '<color>', // 类型
  inherits: false, // 是否继承
  initialValue: '#fff' // 默认值
})

`
.starry {
  background-image: paint(starry);
  transition: --sky-color-start 1s ease-in-out;
  
  // hover 时修改定义的变量
  &:hover {
    --sky-color-start: #f9f8ff;
    --sky-color-end: #bdefff;
    --star-color: transparent;
  }
}


作者：大转转FE
链接：https://juejin.cn/post/6942662875005583391
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
`
