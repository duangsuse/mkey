## 大无语事件

>我的第一个高亮代码编辑器 Ded(Destruct EDitor) 编写时遇到了很多困难，毕竟有 runP,noWhite,trie,rangemap,Ta:hlbg/measure 与词条区间,树增量更新等一大堆算法和API设计要做，在不断迭代的过程中我抽空瞻仰了下现在 web 编辑器的标杆 - VSCode Monaco ，才知道这些行编辑器的设计者有多爱重造反直觉轮子

>先声明：Ded 从算法智商上是比不过 Monaco,Ace,CodeMirror,Atom 等任何现有行编辑器的，毕竟它们的文本模型、字串插删操作是自有数据结构而 Ded 只是包了层 DOM Textarea,div.scroll,selection ，以下只是作者个人审美观点，作者很喜欢它们的 UX，并且非常尊重这些团队

我还以为 Monaco 作为 VSCode 这么高大上又现代的编辑器背后名字又好听的 core 会用 DOM Element 以外的方法来渲染高亮，没想到它也和 CodeMirror, Ace 一样抄那些 iframe ckeditor 之类的富文本编辑器，还搞了个按行分的增量更新(比CM好点)！这还只是实现了渲染侧！也就是说 Minimap(缩略图纲 scroll) 是单独渲染的蛤？

回想下 CodeM. 6 的「完整解析」居然被当作革命特性，然后渲染就只是 CSS DOMString 缩短了??? 莫名其妙的类名减少了 wdnmd，反正这些前端后端技术调研捉鸡的人能不能搞点策划，只懂算法不懂解析器？

我也一直以为 Mon 它会负责管理 AST 增量更新(据说 IDEA 会，但 Java 系智商够 1.9G简洁审美真不敢恭维)，那我就明白了，并不需要管理区间和光标符号查询，它只需要按 token 为单位把数据绑定到 DOM span ，对语言只需还要再抱 LSP 大腿，容忍另一边再解析一遍和JSON类序列化开销，因为它就当代码堆 token ，主要还是肝用户交互非数据模型，真nmd机智，我一直把 Mon 当 IDEA 同层次的编辑器，现在想想还不如易语言和 KDE Kate ，人家算法上没吃亏啊

span 可以保存信息和提供 hover 等事件，也能方便内联变量预览等，但不值得——编程时大部分时间都是在浏览和新增，极少数时间才有机会动这些 span 的区间之外的信息，把本身没大意义的信息集结在一起，才会更有意义（比如 reformat 时全语言都可以利用 scanjs 的 toS 重显）。

你看 Mivik 的 [Malax/ex/y](https://github.com/Mivik/Malax/blob/master/src/main/java/com/mivik/malax/Editable.java) 编[辑](https://github.com/Mivik/MLexer/blob/master/src/main/java/com/mivik/mlexer/JavaScriptLexer.java)器，还有最近的 [Kiot](https://mivik.gitbook.io/kiot-lexer/v/chinese/examples/regexp-reusing) DFA 状态机分词器，哪个不比 Monarch,TextMate 优雅

实现过分词器的人都知道，它不就是 `state=0;switch(state){case N: if(next()) state=N1}` 的这种玩意么，比方说 `"a"`，不就是 st=0->"=>IN_Str->"=>0 的这种状态转移结构吗？你把状态移到 in_str 的 i0 记下来, " 时除移0顺带个 action=yield 不就一 str 词条了么，那表达成数据就是数组状 map, 其 K=状态, `V=["a~z等字符命题", 正数下状态号, -失败时action号]` ，那有 action 的 heredoc 和嵌套 `/**/` 这些词条都可以用 set&Name下状态判定 和 push/pop 状态号解决了么，那分词器也有递归下降的写法，现在很多人压根不整这了，`${}` 字符串里弄这个也很麻烦，区分 `:P<T>=` 是按啥分也很痛苦，直接不分词按字解析完事

你去枚举下状态转移 KV 的正负零情况，就是对应 `action();st=N1;` 的这种操作片段么(正`st=N`负`st=action[-N](i0,st)`零`st=st`)，不过是 switch-ifpeek 换个规范点的写法罢了，Trie 本质 DFA ，这种分词器本质被动状态转移、显式状态号栈、不便于归纳不连续多项的递归下降，那就是解析组合子x字符流的子集，我不如直接去用它爸再顺带上词条区间。

~~嗯大佬新开了个 tako, 开始感觉有点像 OJ perf程序? 后来发觉像物理引擎，或许和音乐分析图示相关？~~

span 渲染整体上没有问题，如果名字复用、精简做好也是很好的(尽管 Object 模型很多冗余属性眼烦)，但它给问题引入了太多 presentation 侧的、databind 的无关麻烦，而且过度利用 DOM&Events 绝对影响性能——明明单画布就够，多元素很多 CSS 还要转化，既有 CSS 特性不能很好利用，而且内联在别个网页上 query 系查询也很累的；其实就是你建模都有问题，利用 Mutation 啥做编辑，格局小了，那按分词也能做好东西，但完整语法树查询也包含 spans 它不香吗？

Scan 的编辑器支持没有按行、按正则的词条更新，但它在分析、重构、提供信息时不需要靠外部 LSP 去独立解析遍、提供重构方案，对 Mon 来说代码就是一堆按行分的单词，而不是完整、动态变化的语法树，所以在补齐之类的场景，它不得不用一些部分解析算法来模糊匹配，而解析规则也自然不能复用

在没有块单位、变量名单位的增量解析前 scan 都得从头扫描整个文本，但有了 `RangeMap` 的支持就能消除大击键量的写名字，保留快速按{}块解析；Mon 系编辑器如果需要 AST 信息，就得完整重解析一遍

但高亮是能按行增量更新的，从整体更新 spans 比较 i,i1 (插入一个字符改变词条类型 可能吗) 找到更新点，重绘到其下一行首个 span。遐想插入 `/* 和 */` 的情况，前者不需考虑(最长到末尾都是它)，后者的下行都是需要更新，这种情况光标 span k 类似 `cmtM`, `strM` 代表多行，尾随末尾更新即可

写了这一段我对高亮编辑器成熟了很多，比如区间映射也不一定必要，因为渲染的画布完全就可以用来判断光标下区间属于那种词条，然后再用 SortedSet 去 maxLE 搜索最右起< i 就能找到，随行高亮更新插入也容易；以前就是格局小&太重视内存开销了，主要是没按行去增量词法更新；那时候哪想到 ParserKt 核心只 60 行呢，甚至加到100就能捎带高亮编辑

Ace 其实小展示常用，它居然好意思说自己是 High Performance，前端界广告词传统异能？

而且我看了它和 Mon 的 scroll 实现，好家伙不谋而合啊，光标和滚动不比 DOM 既有的牛逼(有也是鸡肋)，到全都是自己造轮子哇，而且所有 line 都是绝对定位…… 我真是服了 M$ 家某些人的脑力了，浏览器自己 shift viewport ，明白啥在界外，不比你完全手算优雅；我说为什么滚动性能这么拉垮

>我可真是服了你们了，要自己实现滚动条起码不要遍历 ln.style.top 去叠加好么，你把整个父容器 top 更新下， IO 不会少点么？后端之耻啊……

```js
onmousewheel=(c=>ev=>{c.top=CSS.px(parseFloat(c.top)-ev.deltaY)})($0.style) //不信你自己在 ace_line_group 上删掉既有监听再试一下，啊一下子不要太丝滑
//我tm还以为原是有惰性视图clip，这群人是 DOM 树和 CSS 层叠性都不屑用？
```

~~这程序员脑子怕不是有啥大冰，md前端入门都会的东西不用，学废了都；还是纯函数式用多了呢，可把你牛B坏了，低性能你自豪？你能有 Gecko 和 Blink 计算机图形学的人懂？画蛇添足~~

垠王做的 [ydiff](http://www.yinwang.org/resources/mk1-mk2.html) scroll ~~比你牛B丝滑多了好吗？自动生成命名还搞得老母猪戴罩一套又一套的，CSS giegie 被你们拿去当牛当马瞎用，心疼疼，这么爱给编号起名字啊；人还有 d 对应、可调滚速(*sign)、滚尽检查，`eventCount` 滚时增求滚时减，若0才真启setTimeout滚动动画(!moving积极前断言)~~

那个时候几乎迷惑起来了，梦幻现实，看的真是 industrial 的 code editor? 确定不是一个按行写字的 app? 怎么会有这么过分的操作，滥用 position:absolute ，这对 eb 排版引擎有多大的恶意、对使用环境有多大的被害！

~~事后想想可能是我绞尽脑汁在设计剪枝、增量更新，想办法怎么让分词器和解析器可以互用，让文本编辑器维护语法树结构，好好思考如何实现绘制效果尽量避免开销，居然其他所有人戏弄 DOM 一样是不是觉得啥都自己拿CSS做性能就高，也没用 `will-change` 和 lazy 什么的吧，真是令人莫名其妙~~

还有那么多完全没意义的 CSS 规则， `.overflow-guard{overflow:hid; position:relative}`? `.mouse-cursor-text{cursor:text}`? 你不会用 `style[k]` 吗？滥用 CSS 、可变可配置性不加设计，简直像只学了那几种写法的小学生，还到处混用，好好利用标准属性、整体写法不好吗？看不起交互建模已经与之绑死了的DOM？前端完全外行？

>不愧是人类优质 editor [ATOM](https://github.com/atom/atom/blob/f37fc2a31a7bae588085a60eec01c2c4de3c4d69/src/text-editor-component.js#L2780) L4305, L4506 都，这 DOM diff 给爷整会了, 5k 行 157K ，还只是渲染部分，写一个文件里，没有任何阅读提纲。我这整个中文大记录才 200K 啊；看到 [这种小细节所谓优雅](https://github.com/atom/atom/blob/f37fc2a31a7bae588085a60eec01c2c4de3c4d69/src/color.js#L52) 我就明白了，[它](https://github.com/atom/atom/blob/f37fc2a31a7bae588085a60eec01c2c4de3c4d69/src/text-editor-component.js)[不](https://github.com/atom/atom/blob/f37fc2a31a7bae588085a60eec01c2c4de3c4d69/src/text-editor-element.js)[在](https://github.com/atom/atom/blob/f37fc2a31a7bae588085a60eec01c2c4de3c4d69/src/text-mate-language-mode.js#L366)乎，component 和 element 对 Electron UI 易混什么的更不会在乎

啊我怼完了，好痛快啊家人们，记得 peace~ 心平气和


咱想过 Trie(老朋友了 PKT 和一个翻译都用过)，但用最简单的写法写出来后才发现它只有一行(初次发现)……和 cd/mkdir-p &cat/printf 差不多是，流每项对应一个新 Map ，然后 end 对应端点值；联想到它必须一次一字符(public priv protect 这仨是看俩字就能区别的)，再说这个基本都是 O(n) 过滤带前缀、给前缀收集后缀(补齐用的到 filter starts)的，其实小解析器上根本没必要那么多 Map

然后这种典型递归数据结构里某层的 entries() 就是后序遍历，先 push KZ? 叶子值 再对子项递归，返回值是求和此及下层添加项的总数，那当然是给子项添加此层前缀用的，每项最初就 `[[], KZ]` 的这种形式。啊，那三行就能实现

后来独自考虑很久，决定自造一个耳的后缀树，了能尽快区分 public 系关键字 `pu pri pro` 咱改了：共同前缀 p 找到后 `=Map([next(ks), rec(ks)])`，第一个不同的键得给独立出来

后缀树像K逆序的前缀树，pri 的例子只有后缀是不变的，但它的键是子串而不是单字符，也就是说 abc=1 在插 ad=2 时 a/ 路径有一个切分，这个不是很难，单层去过滤前缀就知道创建 a/ bc=1 d=2 了

这时再 ab=5 顶层就只有前缀 a/ 了，一个 slice(1) 递归下去即可，但这本身是和 get 差不多的逻辑，要知道 get 默认该是取前缀(非完整匹配)，不过 get 的路径没有带值容器，还是不能用（汗,而且get也是遍历）

就这样 public protected private 的 p 会不断被拆开建立新KV, p, ublic, pr, pro pri ；而 get 时按 keys 长度升序去做分段尝试……

不对啦， public, p/u/blic, p/r/otected, p/r/ivate 才是后缀树真正的样子(笑)，它的值默认就是压缩的

在实现这个之前还想到一个 Nano 优化的版本，就是惰性仅 KZ Map 的初始化(set 子径时切分)、单值路径(上面 pu 的就是只有一条后续径的)的 KN 余键-值信息，就是说如果 abc 是 Nano ，再加 adb 后 bc, db 就不是单径(共同前缀 a 是单字符,KN=bc 最开始就加在它)，这个版本进一步就是 sad, sad-ly, sad-ness 这种跟 KN 的后缀能直接跳过中部，但 sed, see 后就不行了(其实原 KN 后移一项也有效，但太麻烦)

利用后缀树就没有 KN,Map 开销且能快速解析/列出后缀了

我们称括号嵌套表 argv `(f a b)` 的调用为 apply ，其 `eval(a[0])` 为可调用值，文件顶层也是 argv 的一个模式

可以用 `(do a b (sum a b))` 创建可调用值，

```
One(
  slicerP(JSON.parse),
  ss("() [] {} <>").map(p=>Paired(p, argv))
)
```

这样写有个问题，`[1]` 会被解释为数组而 `[a]` 却在 `JSON` 出错(它不止含有常量)，而且 `(cond e [a b])` 的这种写法就实现不到了

如果要区分 `[a b]` 和我们复用的 `[1,2]` 外部语法，严谨点要预读看有没有逗号——<2 项是无法区分，如一项时 `[1], [a]` 的语义都有差别，非常不优雅

为此我们把 `Paired("[]"` 独立出、移到 slicerP 前面，它就会覆盖 JSON `[` ，但这样部分外部语法又利用不到了，而且注意下 `{}` 也是冲突的！

作为工具性语言内联 JSON 还是可选的，但显然不该遮盖 Lisp 系固有语法，可以加某种前缀，如 `:[1,2]` 来区分；但是，只为复用 JSON ary/obj 文法添加标符，不鸡肋？

（`:` 没有和 Name,Parened,Json 三既有语法收的前缀冲突，可以加作 `:(JSON|Name)` 顺便模仿 Ruby 的 `:sym` 符号，嘻

Scheme 有 `'(a b)` 这种糖引号语法，不如我们就再定义一种基于 `-*/` 中缀表达式的语法——`let [r (plus 1 2)] in '1 plus 2==r` 其中不允许自定义嵌套调用，而只有圆括号，中缀参数只能是 `JSON` ，这样 `'[1,2]` 就能大大方方表达常量了！
