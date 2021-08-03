- https://blog.csdn.net/CodingNoob/article/details/101060235 canvas裁图
- https://blog.csdn.net/LJL0310/article/details/80450158 五子棋md
- https://blog.csdn.net/pangji0417/article/details/104337878 五子棋ubuntu

`chrome.runtime.sendMessage({ chromeAction: "screenshot" }` webext `browser.tabs.captureTab` 截图有意思

createImageBitmap 可以预先解码图片

```html
<style> div { background: -webkit-canvas(squares); width:600px; height:600px; border:2px solid black } </style>
<script type="application/x-javascript"> function draw(w, h) { var ctx = document.getCSSCanvasContext("2d", "squares", w, h); ctx.fillStyle = "rgb(200,0,0)"; ctx.fillRect (10, 10, 55, 50); ctx.fillStyle = "rgba(0, 0, 200, 0.5)"; ctx.fillRect (30, 30, 55, 50); } </script>
<div onload="draw(300, 300)"/>
```

https://webkit.org/blog/176/css-canvas-drawing/

https://webkit.org/demos/canvas-debugging/demo.html

https://imququ.com/post/use-canvas-as-background-image.html

也很酷的计算机渲染 https://www.cnblogs.com/fangsmile/p/10132920.html

还有限制绘制区域的 `clip` https://www.cnblogs.com/fangsmile/p/10180344.html ，类似 mask 好像不能用 graident (难道 inset black~gray 也不行吗)


https://blog.csdn.net/iteye_4865/article/details/82307275
updated : 将原始 textarea 设置为 margin:0; padding:0; 后 firefox 完全一致，但 chrome 仍有少许误差。
updated : 将 fake div 设置为 pre-wrap ，则位置完全没有误差了!

关于 g.measureText 可以直接 `pt=parseInt()` 或 `px*1.5` 甚至直接另起一个 getImageData

```js
let metrics = ctx.measureText(text);
let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

//即以下 JQ
text=span (fontFamily)
block = $('<div style="display: inline-block; width: 1px; height: 0px;">');
body.tail=par=div(text,block); //white-space : nowrap
    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;

    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;

    result.descent = result.height - result.ascent; par.remove();

```

据说直接弄个 span text offsetHeight 也行

谈到编辑器 selection:start,end,isCollapse(无选区)

跨浏览器 DOM Selection 取设…… https://stackoverflow.com/questions/7745867/how-do-you-get-the-cursor-position-in-a-textarea

```js
function setCursorPos(input, start, end) {
    if (arguments.length < 3) end = start;
    if ("selectionStart" in input) {
        setTimeout(function() {
            input.selectionStart = start;
            input.selectionEnd = end;
        }, 1);
    }
    else if (input.createTextRange) {
        var rng = input.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        rng.select();
    }
}

function getCursorPos(input) {
    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0;
                     rng.compareEndPoints("EndToStart", rng) > 0;
                     rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = { start: 0, end: len };
                     rng.compareEndPoints("EndToStart", rng) > 0;
                     rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}
```

之前那个人的博客……

- http://docs.kissyui.com/1.4/docs/html/demo/combobox/xhr.html 淘宝 sug complete&UI
- http://docs.kissyui.com/1.4/docs/html/demo/tabs/lazyRender.html HTML Tabs add&sel=show
- http://docs.kissyui.com/1.4/docs/html/demo/uri/query.html URL params IE 真是烦
- http://docs.kissyui.com/1.4/docs/html/demo/button/demo1.html 竟能插入到未添加元素前……关系求解器啊
- http://docs.kissyui.com/1.4/docs/html/demo/xtemplate/base.html 基于类 YaCC 的模板引擎

EQuery 连 AJAX 和 PJAX 都没有，更别提为老浏览器的 anim queue ，太屑了，草

噢 [这个](https://www.c-sharpcorner.com/UploadFile/65794e/generate-screenshot-using-html-and-javascript/) 牛逼了 `window.open(Blob([ObjectURL],"text/html"))` 叫网页截屏啊

quackit.com/css/functions/css_url_function.cfm 普通示例，可惜没法 js 创建

https://developer.mozilla.org/en-US/docs/Web/CSS/url() 弄 canvasvg 可能是个好方法，可惜还是要建节点
