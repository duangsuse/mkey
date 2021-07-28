el.href`
body {
  background-color:#9fbbcb;
}

#icon1 {
  width:142px;
  height:142px;
  background-size:100%;
  background-image:-webkit-canvas(calendar);
}

#icon2 {
  width:284px;
  height:284px;
  background-size:100%;
  background-image:-webkit-canvas(calendar);
}

#icon1, #icon2 {
  transition: all .6s ease-in-out;
  -webkit-transition: all .6s ease-in-out;
}

#icon1:hover, #icon2:hover {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
`

`
<textarea rows="30" cols="50" style="
    font-size: 20px;
    background: -webkit-canvas (can);
    -webkit-background-clip: text;
    color: transparent;
">&lt;/body&gt;</textarea>
<canvas style="
    width: 200px;
    height: 200px;
    /* position: absolute; */
    offset: 197px 30px;
" id="can"></canvas>
`//目前只能对 mozOrient 特殊处理,其它试 CSSCanvasContext 或 bindCanvas("id","2d") ，这个 bind 的 clearRect 会优先更新一帧

doc.body.tail=emet`#icon1+#icon2`

function getContext() {
  var context;

  if(isWebkit && document.getCSSCanvasContext) {
      context = document.getCSSCanvasContext("2d", "calendar", 142 * devicePixelRatio, 142 * devicePixelRatio);
  } else {
      return false;
  }

  return context;
};

var isWebkit = /(webkit)[ \/]([\w.]+)/ig.test(navigator.userAgent),
  devicePixelRatio = window.devicePixelRatio || 1;

(function() {
  var imgUrl = 'calendar_icon_sprite_en_us.png';

  if(devicePixelRatio == 2) {
      imgUrl = 'calendar_icon_sprite_en_us@2x.png';
  }

  var img = new Image();

  img.onload = function() {
      //get canvas context
      var context = getContext();

      if(!context) {
          alert('请使用 safari 浏览器！');
          return;
      }

      //draw icon
      drawIcon(context, this);
  }

  img.src = imgUrl;
})();

function drawIcon(context, imgData) {
	var glyphs = {"1":{left:16,right:59,visualLeftInset:16,visualRightInset:16},"2":{left:59,right:114,visualLeftInset:8,visualRightInset:7},"3":{left:114,right:171,visualLeftInset:11,visualRightInset:10},"4":{left:171,right:226,visualLeftInset:7,visualRightInset:7},"5":{left:226,right:281,visualLeftInset:8,visualRightInset:12},"6":{left:281,right:336,visualLeftInset:7,visualRightInset:10},"7":{left:336,right:385,visualLeftInset:7,visualRightInset:10},"8":{left:385,right:440,visualLeftInset:8,visualRightInset:8},"9":{left:440,right:495,visualLeftInset:10,visualRightInset:10},"0":{left:495,right:550,visualLeftInset:7,visualRightInset:7}};

	var devicePixelRatio = window.devicePixelRatio || 1,
	    date = new Date();

    for(var i in glyphs) {
        var glyph = glyphs[i];
        glyph.width = glyph.right - glyph.left;
        glyph.height = 106;
        glyph.top = 0;

        ['visualLeftInset', 'visualRightInset', 'left', 'right', 'width', 'height'].forEach(function(key) {
            glyph[key] = glyph[key] * devicePixelRatio;
        });
    }

	//draw base
    (function() {
        var top = 100 * devicePixelRatio,
            size = 142 * devicePixelRatio;

        context.drawImage(imgData, 0, top, size, size, 0, 0, size, size);
    })();

    //draw day of week
    (function() {
        var dayOfWeek = date.getDay();

        var left = 216 * devicePixelRatio,
            width = 142 * devicePixelRatio,
            height = 40 * devicePixelRatio,
            top = 116 * devicePixelRatio + dayOfWeek * height;

        context.drawImage(imgData, left, top, width, height, 0, 8 * devicePixelRatio, width, height);
    })();

    //draw day
    (function() {
        var day = date.getDate().toString();

        var leftMargins = [],
            totalMargin = 0,
            lastChar;
        for(var i = 0; i < day.length; i++) {
            var char = day[i],
                glyph = glyphs[char];

            if(lastChar) {
                totalMargin -= 10;
            }

            leftMargins[i] = totalMargin;
            totalMargin += glyph.width;
            lastChar = char; 
        }

        leftMargins[i] = totalMargin;

        var dayWidth = totalMargin;

        if(day[0]) {
            dayWidth -= glyphs[day[0]].visualLeftInset || 0;
        }

        if(day[1]) {
            dayWidth -= glyphs[day[1]].visualRightInset || 0;
        }

        var dayMarginLeft = (142 * devicePixelRatio - dayWidth ) / 2 - glyphs[day[0]].visualLeftInset;

        for (var i = 0; i < day.length; i++) {
            var char = day[i],
                glyph = glyphs[char];

            dayMarginLeft += leftMargins[i];
            context.drawImage(imgData, glyph.left, glyph.top, glyph.width, glyph.height, dayMarginLeft, 50 * devicePixelRatio, glyph.width, glyph.height);
        }
    })();
};