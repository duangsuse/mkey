文1=`英文名	中文名	英文名	中文名	英文名	中文名
abstract	虚	any	化	as	作
boolean	两	break	断	case	当
catch	接	class	类	continue	续
const	常	constructor	构	debugger	练
declare	宣	default	默	delete	删
do	行	else	别	enum	举
export	出	extends	承	false	假
finally	终	for	为	from	自
function	务	get	取	if	若
implements	具	import	引	in	于
infer	析	instanceof	属	interface	型
is	同	keyof	键	let	定
module	模	namespace	名	never	戒
new	启	null	空	number	数
object	象	package	包	private	隐
protected	护	public	显	readonly	固
require	需	global	宇	return	回
set	置	static	静	string	文
super	先	switch	支	symbol	符
this	此	throw	抛	true	真
try	试	type	种	typeof	样
undefined	灭	unique	特	var	变
void	无	while	复	with	与
yield	生	async	途	await	等
of	在			`//https://zhuanlan.zhihu.com/p/144872757
con=console,n=o=>o.length,说=con.log, next=g=>g.next().value,isNon=o=>(typeof o==="undefined"),不动=x=>x,
换代码=(f,s,s1)=>eval(/(function\*?).*?\(/[Symbol.replace](String(f),"($1(").replace(s,s1)+")");
function 计时(s,o_in,f){let N=计时.N,n;f(o_in,N[0]);for(n of N){con.time(s);f(o_in,n);con.timeEnd(s)} console.timeLog(s,N)}
计时.N=[100, 2000, 100000]

test=0
if(test){
说(`FIFO队`)
计时(`push+shift`,[],(a,n)=>{while(n--){a.push(1);a.shift()} }) //看来 performance.mark/measure 的 midi 似 API 很生；然后 JS shift 不能像 Ruby 一样记给 unshift
计时(`unshift+pop`,[],(a,n)=>{while(n--){a.unshift(1);a.pop()} })
说(`LIFO栈`)
计时(`push+pop`,[],(a,n)=>{while(n--){a.push(1);a.pop()} })
计时(`unshift+shift`,[],(a,n)=>{while(n--){a.unshift(1);a.shift()} }) //所以尽量右push
}
function* 交替0(a){while(n(a)) {let xs=a.shift(),x;if(isNon(x=next(xs)))break; yield(x);a.push(xs)}}
function* 交替1(a){a.reverse();while(n(a)) {let xs=a.pop(),x;if(isNon(x=next(xs)))break; yield(x);a.unshift(xs)}}
function* 交替2(rs){ let i=0,n=rs.length; while(n!=0) { let x=next(rs[i]); if(isNon(x)){rs.splice(i,1);n--} else yield x;  i=(i+1)%n } }
交替3=换代码(交替2,`i=(i+1)%n`,`i+=1;if(i==n)i=0`) //不元编程是快的
function* 不断(a,i=0,N=n(a)){while(true)if(i===N)i=0; else yield a[i]}

if(test){
  let 测试=[[..."一二三四五"], [1,2,3,4,5], [..."abcdefg"]].map(a=>不断(a)), 众=[交替0,交替1,交替2,交替3],op;
  for(op of 众)计时(op.name, 测试, (a,n)=>{let g=op([...a]);while(n--)if(!next(g))break})//说(a,op,g);
}

说(`构造拆解分列 KV表`)//本质是分页+横拼
表1={
  小猪:"切西瓜", 大狗:"篮球", 野鸡:"唱跳rap", 大熊: "乒乓球", 小蜂: "羽毛球"
}
function* 分块(a,N){while(n(a))yield a.splice(0,N)}//可视作特例 concat(same N) 的反操作
function* 交替(a,on_row=不动){ let i=0,n=a.length; while(n!=0) { let x=next(a[i]); if(isNon(x)){a.splice(i,1);n--;if(i>=n)i=0;} else yield x;
  i++;if(i===n){i=0;let x1=on_row(x,a);if(x1!==x)yield x1} } }
const 分列=(o,cols=["K","V"])=>{let nj=n(cols),a=Object.entries(o), //a,b c,d
  页=[...分块(a,Math.floor(n(a)/nj))],//[a,b c,d][e,f] =?> [a,b e,f][c,d]
  每首=交替(页.map(pg=>{pg.unshift(cols);return pg.values()}),()=>"\n")//带头，多纵变多横
  return 每首//a,b e,f\nc,d
},
文表=(...a)=>"\t"+[...分列(...a)].flat().join("\t")
说(文表(表1,["动物","爱动"]))

const
newA=(n,op)=>{let a=[],i=0;for(;i<n;i++)a[i]=op(i); return a},
反分块=a=>a.flatMap(r=>[...分块(r,2)]),//=reduce concat a[0]
反交替=(a,n)=>newA(n,j=>a.filter((_,i)=>i%n==j)),
反分列=(a,nj)=>{let col=Array(nj),o={},
  每无首=反交替(a.filter(x=>x!="\n"),nj).map(pg=>{col.push(...pg[0]); return pg.slice(1)}),
  合=每无首.flatMap(pg=>反分块(pg))
  return Object.fromEntries(合)//就看到 unification 对输出建模的正确性了。有损失到信息
},
反文=s=>s.split("\n").map(s=>s.split("\t"))
//大致相等，因为 分列 是为方便先加 \n 了的，它实际是靠线性结构模拟

表2=反分列(反文(文1),6);
说(表2)
说(文表(表2)) // 嗯缺了点…… rows分页再每行\t每页\n 不就是了?

// 草泥马，老子用的全是中文，不见得代码好懂一点:doge哭:
不动. 搞个好玩的
/*
虚化作两断当接类续常构练宣默删行别举出承假终为自务取若具引于析属型同键定模名戒启空数象包隐护显固需宇回置静文先支符此抛真试种样灭特变无复与生途等在
为x在[1,2,3]{}
为变x于[1]{}

种 用户名=文
种 典<K,V>=Map<K,V|文>
种 号=符|象|两|化|空

务 叠数(i){若(i同0)回i;  回 叠数(i-1)+1作数}
常pi=3.14

//宣,引 自,需require,模,名namespace,析infer,特unique,宇global
//虚,举enum,包package
出某模块={
  途务 启动(){启动图;等 睡(200);},
  取 魔数(){回1+假},
  固 ver:"1.0"
}
型 OK{护 务 说(){}}
类 OOK 承 Object 具 OK {
  构(){}
  显 静 i=1
  隐 取 魔(){回""}
  务 主(){
    此.内容=此属OK? 1: 空
    定i=0
    行{i++}复(i!=10)
    复(i!=0)i--;
    复(i++)若i是1{断}别{得色;续}
    支(i){
      当-1:删 window.x;练//debugger
      默: 试{样i=="number"}接(ex){}终{}
    }
    与(window){回 无 0}
  }
  置 内容(x){先.说(x)同 灭}
  务* 序(){为(变i=0;i<10;i++)生 此.魔}
}
起 OOK||不可能()
务<K 承键 Element> 某(k:K){回 doc.body[k]}
务 不可能():戒{复(真){抛 错误()}}

量 _=说("吃了么")是效果
变数 n 初42
变，a初1；b初2；c：数初3
恒数 Pi=3.14
恒事 同(i：数)=i去并路零(0、同(i-1)+1)
可为<数、文、真假>("哈")去并路(「+1」、::说、真假::去取非)

【内基元】对何<值>类 表达式
对何<型>类 动态键 为 --dynamic
  算符的事 取(k：文)
  算符的事 置(k：文、v：值)
对何<值>物『懒』为
  隐式的造于(：表达式<值>)=内定
  隐式的造于(：值)=内定
  算符的事 化值=内定

事 入口 为
  量购物单=动组("wtf")顺便，它[0]="he"。
  量提取(苹果、橘子)=俩项(3、5)
  若 提取 序(a、b、剩余(xs))是建行(1、"wtf")，说(a、b、xs的长是0)。
  空组<文>()去拼文()
  对建行(12、34)里的分数，
    判分数存，
      于0~50，队得分令置为「+1」。
      否则，队得分令置为「+3」。
  对建表(1到2、"1"到"二")里的提取(a、b)，
    判a属，
      于数，说(b作数-1)。
      于文，说("$a$b")。
  --let also run apply 令为 顺便 令做 配置为
  说((2止100)的末项+(2至100)的末项+1)

属别名 数列=列<数>“类型别名还是太长”
事 统计(：数列)：仨项仅<数> = 此列去对每项，
  判它，
    「>最大」，最大=它。
    「<最小」，最小=它。
  总和令置「+它」
  回仨项(最小、最大、总和)
其中，
  变，最小初0；最大初0；总和初0

统计(建行(1、2、-2、-4))
统计(建行(1.3、2、-2.3、-4))

量 数列.大小差 取者，
  统计(我)令为，首项-次项。


直白——储例况标内、组行集表合；事回抛断过、映滤排组归；若判对重复，令顺做置配。 真假空字数文列、函数错误值断止
逗号表示法——优雅地解决了英文里也不易写得美观的缩排层次，为
文法人称——你我它包涵作用域优化、面向对象、函数式的编程思想
记法——前中后缀自分词运算符，实现 按钮当被点击时；若此行试存无(0) 等优雅
便利写法——不变量提取/惰性参数、变量逗号表、其中块后置、对何<>同名传参、中缀逻辑否定、且或链 若你x[1]且是1 且先x长是1
泛化——数是数1,2,4,8 的结合，行是不定长的组、集是不重复的行、表是有项值的集、列是 Iter,Sequence 的结合、合是能写入的列，心智模型只有一个，何时何地不受影响。
新特性——自动转化类实例、隐式构造数储类、自属继承自改写、尾递归重写内联类、恒常不变编译算、查关系成立算式、传递惰性表达式、灵活弱型动态键
*/
/**
https://www.jtu.net.cn/?docs=cankao/tuyu
 */
if(0){
  a=[...$0.children].map(e=>e.lastChild)//.wp-block-table > table:nth-child(1) > tbody:nth-child(2)
  b=a.map(e=>e.innerText)//.join("")
  sa=new Set(`为x在`)
  b.filter(x=>!sa.has(x));
  [...$0.querySelectorAll("p+figure")].map(e=>{s=e=>e.innerText; return s(e.previousElementSibling)+":"+s(e) }) //.entry-content
}
/**
https://git.jtu.net.cn/xuexi/wu
https://git.jtu.net.cn/xuexi/jl
https://git.jtu.net.cn/xuexi/jlspxs/-/blob/master/%E4%BB%A3%E7%A0%81/%E5%85%A5%E5%8F%A3.%E7%A8%8B
https://git.jtu.net.cn/xuexi/jlspjs/-/blob/master/%E6%8E%A5%E6%94%B6%E6%95%B0%E6%8D%AE/%E4%BB%A3%E7%A0%81/%E6%8E%A5%E6%94%B6.%E5%BC%8F
https://git.jtu.net.cn/zdx/tupian
https://git.jtu.net.cn/xuexi/ewm
https://git.jtu.net.cn/xuexi/qibu/-/blob/master/%E4%BB%A3%E7%A0%81/%E5%85%A5%E5%8F%A3.%E7%A8%8B
https://git.jtu.net.cn/xuexi/css1/-/blob/master/%E4%BB%A3%E7%A0%81/%E5%85%A5%E5%8F%A3.%E7%A8%8B
https://git.jtu.net.cn/xuexi/xuexi_cx/-/blob/master/%E7%A0%81/%E5%BA%94%E7%94%A8.%E7%A8%8B
https://git.jtu.net.cn/xuexi/tq1
https://git.jtu.net.cn/xuexi/tq3
https://git.jtu.net.cn/xuexi/shi_fu
https://git.jtu.net.cn/xuexi/shi_ke
 我还把 https://www.jtu.net.cn/?docs=tuyu 及 docs=cankao `.children>li>a` 给 wget -r; find -name '*rest_route**' -exec rm '{}' \; 下来了


引 * 作 回应 自 '回应';
引 { 绘制 } 自 '回应-模';
引 样式 自 '样式-组件';

定 题1 = 样式.题1`
颜:蓝;
`;
定 容 = 样式.容``;
定 点 = 样式.点``;

常 应用 = () => (
      <容>
            <题1>世界你好！</题1>
            <点 用="https://git.jtu.net.cn/xuexi/xuexi_1">
                  项目地址
            </点>
      </容>
);

绘制(<应用 />, 文档.查选('#根'));

emet.题1=el("h1",wColor("blue"))
el(qsOne("#根"), emet`div 题1[t=${"世界你好"}]+a[${url},t=${"项目地址"}]`)

类 应用 承 回应.组件 {
    绘制() {
        回 (
            <根>
                <题1>{'世界, 你好!'}</题1>
                <像 源={需('./图像/君兔.png')} />
            </根>
        )
    }
}

app=()=>emet`div h1[t=${"世界，你好"}]+img[src=${url("图像/君兔.png")}]`
el(qsOne("#根"),wBind({},app))

https://git.jtu.net.cn/xuexi/jtlan/-/blob/master/antd/lib/index.d.ts
引 * 作 回应 自 '回应';
引 { 用状态 } 自 '回应';
引 { 绘制 } 自 '回应-模';

引 { 阿波罗客户端 } 自 '阿波罗-客户端';
引 { 建立传输链路 } 自 '阿波罗-链路-传输';
引 { 在内存缓存 } 自 '阿波罗-缓存-在内存';
引 { 用查询, 阿波罗提供者 } 自 '@阿波罗/回应-钩子';
引 图 自 '图询-签'
引 页头 自 '蚂蚁设计/码/页头';
引 时间轴 自 '蚂蚁设计/码/时间轴';
引 对话框 自 '蚂蚁设计/码/对话框';

引 样式 自 '样式-组件';

常 显示文件列表查询 = 图`
查 显示文件列表($用户代号: 文!, $文件夹列表:[文!]!) {
  显示文件列表(用户代号: $用户代号, 文件夹列表:$文件夹列表) {
    编号 访问地址 略图地址 文件名 描述
  }
}
`;

常 框 = 样式.容``;

常 小图 = 样式.像``;

常 大图 = 样式.像`
宽: 100%;
`;

定 项目 = 样式.点``;
定 隔 = 样式.隔``;

常 图片轴 = 样式(时间轴)`
衬左: 3素;
`;

型 文件项 {
  编号: 文;
  访问地址: 文;
  略图地址?: 文;
  文件名: 文;
  描述: 文;
}

常 传输链路 = 建立传输链路({
  识别元: 'https://sj.jtu.net.cn/wj',
});

常 客户 = 启 阿波罗客户端(
  {
    链路: 传输链路,
    缓存: 启 在内存缓存()
  }
);
常 相册 = () => {
  常 果 = 用查询(显示文件列表查询, { 变量: { 用户代号: 'xuexi', 文件夹列表: ['/图片'] } });

  常[图片, 置图片] = 用状态(空);

  若 (果.加载中) {
    回 (<框>加载中...</框>);
  }

  若 (果.错误) {
    回 (<框>错误 + {果.错误.信息}</框>);
  }

  常 显示图片框 = (地址: 文, 描述?: 文) => {
    置图片({ 地址, 描述 });
  }

  常 显示文件列表: 文件项[] = 果.数据.显示文件列表;
  回 (
    <框>
      <页头
        标题="君土相册"
        副题="可爱的相册"
      />
      <对话框
        标题={图片?.描述}
        可见={图片 != 空}
        居中={真}
        底部={空}
        当取消={() => 置图片(空)}
      >
        <大图 源={图片?.地址} />
      </对话框>
      <图片轴>
        {显示文件列表.映((文件) => {
          回 (<时间轴.项 键={文件.编号}>
            <框>
              <框>{文件.描述}</框>
              <小图 源={文件.略图地址} 当点={() => 显示图片框(文件.访问地址, 文件.描述)} />
            </框>
          </时间轴.项>);
        })}
      </图片轴>
    </框>
  );
}

绘制(
  (<阿波罗提供者 客户={客户}>
    <相册 />
    <隔 />
    <项目 用="https://git.jtu.net.cn/xuexi/tupian">查看软件项目</项目>
  </阿波罗提供者>)
  , 文档.查选('#根'));

型 文件项 {
  编号: 文;
  访问地址: 文;
  略图地址?: 文;
  文件名: 文;
  描述: 文;
}


class 图件{constructor(编号,访问地址,略图地址,文件名,描述){}}
图件.QL=图QL`
查 显示文件列表($uid: 文!, $文件夹:[文!]!) {
  显示文件列表(用户代号: $uid, 文件夹列表:$文件夹) {${argNames(图件).join(" ")}}
}`;

prop(emet,{
  框:el("div"),
  小图:el("img")
  大图:el("img",wStyle("width","100%")),
  图片轴:el("时间轴",wStyle("padL",3))
});

let db=new Apollo({
  conn:createConn(`https://sj.jtu.net.cn/wj`),
  cache:new InMemoryCache
})
图集=(uid,...文件夹)=>(查)=>{
  let 果 = 查(图件.QL, {uid, 文件夹}); //其返状态以 uid&文件夹 缓存，平展三次调用
  if(果.isWait)return el("框","加载中……")
  let [图片, 置图片] = 存储(空), 图框=(地址,描述)=>置图片({地址,描述});
  //图片=prop([0])
  if(果.isFail)return el("框", "错误 "+果.error.message)
  //el("框",果.opWaitFailOK("加载中……",ex=>`错误 ${ex}`),list())
  return el("框",
    el("Header", wAttr({title:"君土相册",sub:"可爱的相册"})),
    el("Dialog", wAll(wBind(图片,_=>wAttr({title:_?.描述,hidden:_==null}), wAttr({center:真,bottom:空, onCancel:()=>置图片(空)}) ),
      el("大图", wBind(_=>wAttr("src",_.地址)))),
    el("图片轴",eeach(果.数据.显式文件列表, tp=>el("时间轴-项目", wAttr("key",tp.编号),
      el.框(el.框(tp.描述), el.小图(wAttr("src",tp.略图地址,"onclick":tp.fun(o=> 图框(o.访问地址,o.描述)) )) )
    )))
  )
}
el(qsOne("body"), emet`${el(":bind",{},事件数据(db,图集("xuexi","/图片")))}+hr+a[src=${url},t=${"查看软件项目"}]`)


事 回声(：值) = 判你 此值，
  属文，你。
  属值，
    对象去取其键(你)取若「长是1且你[它[0]]是""」?令为，回[^回声]""。
    JSON去取(你)
  否则，"错误，非预期的参数类型 ${你的类型}"。

事 回声(：值)=此值令为，
  若它的类型是空表()的类型，
    量键=对象去取其键(它)
    若键的长是1且它[键[0]]是""，回""。
    否则，回JSON去取(它)。
  否则，
    若它的类型不是""的类型，回"错误"。
    否则，回"$它"。

量提取(标题、发送节、输入框、回声框)=定义样式("""
色:蓝;齐:中
齐:中
宽:98%
宽:98%
""")
变文 内容=""
储物 数据(变文 发、变文 收)
量 据=数据(""、"")

断续的事 获取回声(：务) 为
  此务去阻止默认
  若据的发是""，回。
  量果=等待 拉取("POST"、`https://wu-huisheng.wu-63-sc.w.jtu.net.cn/`、据的发)后(JSON::去返)--去忘错
  量时=日期()
  内容令置为「+"[$时]: 果的条目\n"」顺便，据的收=它；据的发=""。
回素去容(
  素(标题、"回声")、
  素(回声框、配表<文域>，有(只读到真、行数到5)；绑定(值到据::的收)。、
  素去单(配表<单>，有(路到""、方法到请交、当提交到)。、
    素(输入框、配表<文域>，有(行数到5)；绑定(值到据::的发)。)、
    素去文("输入的内容通过服务器返回后在上面显示")、
    素去容(素的发送钮)
  )、
  素去点(配表，有(路到"https://git.jtu.net.cn/xuexi/wu"、文到"项目地址")。)
)

mcuScript中文编程，Windows解释器发布(很小1MB多点，含测试代码)，有兴趣下载来玩 - 彭贞的文章 - 知乎
https://zhuanlan.zhihu.com/p/259357558

对(0止20步长1)里的，说("$n是"+
若它是0，说("0是特殊的偶数")；略过。
若数 位交1，"奇"。否则，"偶"。
+"数")。说()

记法「~质数」
量组1=建组(10, 1, 9, 6, 4, 8, 2, 2, 3, 6, 7, 5, 7, 9, 8)
对何<项>(其中项：可较)事 冒泡排(：组)：组 为
  对此组与索引里的提取(x、i)， --0止n(a) 0~i1(a)
    对(i后~此组的末引)里的〖i1〗，
      此组令做，
        若x>我[i1]，交换(键[i]、键[i1])。
事 入口 为
  前后事(说("前")、说("后")、组1)
  对(0~1000)里的，说(若它试质数，"质数$它"。否则，"$它"。)。
其中，事 说(：文)=事(：组)=说("数组1 排序$此文: $此组\n\n")

量 数.试.「质数」 取者，
  若数试不整 或 数不大1，回假。
  对(2止数)里的，
    若(数取余它是0)，回假。
  回真


https://covariant.cn/covscript
感觉 CovScript 也变了，以前好像还是需要 end 的现在 lambda 和缩排都支持了

中文编程的意义 - JeepCar的文章 - 知乎
https://zhuanlan.zhihu.com/p/270385062

例物 岗位 为
  老师；建筑师
储物 人(量数学：数、量钢筋：数)
  晚置变岗位 位

  if(change.math>95)change.job=teacher; else if(change.xxxxxx(等等，去查字典了。。。
或者：
if(person[23].course[2]>95)person[23].attribute[4]=job[12];....(写不下去了，记不住那些下标。。。

量嫦娥=人(50、50)配置为，位=数学去并路在(95~数略、老师、物理去并路在(90~数略、建筑师、空))。

量长

量win=app去加活动("main2")配置为，模式=单页。的窗
素(窗、
  素去文("text")、
  素去输入("input")、
  素去钮("btn"、wAbbr("关闭Activity2"))
)
app的活动的main2配置为，
  字体=全局的字体
  被聚焦时，--[win](ev,arg)
    若参数属于文，imgui的风格去换亮色；text的值=参数；input的值=""。
    否则，
      若参数不是空，app去移掉(input的文本)。
    btn当被单击，app去增("main3")。 --[app,win](obj)



导入包:卓语言系统,卓操作系统,卓文件系统,卓批处理
导入类:批处理命令,常用转义符,控制台
属于:唯一类型
启动:
	输出"本程序实现Win7/8/10任务栏取消缩略图和预览,原理是修改相关注册表的任务栏窗口预览数据"
	换行
	显示任务栏窗口预览数据
	取消任务栏缩预览
	显示任务栏窗口预览数据
	输出"程序运行结束,您重新启动电脑后不再出现缩略图预览了"
	换行
	暂停

显示任务栏窗口预览数据：
	A=注册表"HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
	如果A不存在
		输出"不存在注册表项 HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
		退出子程序
	A读取键"ExtendedUIHoverTime"=>B
	如果B==空
		输出"ExtendedUIHoverTime不存在"
	否则
		输出"当前任务栏窗口预览数据是："
		输出B
	换行
	
取消任务栏缩预览:
	A=注册表"HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
	如果A不存在
		A创建
	A向键"ExtendedUIHoverTime"写入90000
	输出"取消任务栏缩预览成功"
  换行


引 文件
引记法 绝句.符「创建~」「~存」「~次」「说~」
事 入口 = 判你 听去单行，
  "任务栏取消缩略图和预览"，
    量 f 取者，显示任务栏窗口预览数据()。
    f;取消缩略预览();f
    说("请重启")
  "设置控制面板桌面显示"，
    显控制面板=听去真假("请输入要操作的选项代号:显示(1/2)")
  否则，余下的(判(你[^判])，
    "设置图标桌面显示"，0。
    "文件扩展名显示隐藏"，1。
    "Sublime"，2。
  )。顺便，“再”听去单行。
其中，事 余下的(：数) = 判此数，
  0，
    对 建表行("文档"到"{59031a47-3f72-44a7-89c5-5595fe6b30ee}"、"电脑"到"{20D04FE0-3AEA-1069-A2D8-08002B30309D}")里的(名、识符)，
      说("设置${名}桌面显示")
      尝试，听去真假空(":显示")?令做，A1[识符]=我；说("好耶")。空则说("跳过。")。
      接迎按键中断，停下。
      终焉，略过。这里不可达()
  1，
    A["HideFileExt"]=听去真假(":显示/隐藏")
    说("刷新文件夹后就可以看到效果了")
  2，
    量 提取(柠檬精、宁、右键)=Win路径("""
    C:\Sublime Text\sublime_text.exe
    HKEY_CLASSES_ROOT\*\shell\SublimeText
    HKEY_CLASSES_ROOT\Directory\shell\SublimeText
    """")
    说"添加SublimeText右键菜单 开始"
    创建宁顺便，它的值=它的名。
    宁["Icon"]="$柠檬精,0"
    (创建宁的子("Command"))的值="""$柠檬精 "%1""""
    创建(创建右键顺便，其值=其名。的子("Command"))的值="""$柠檬精 -n "%1""""
    说("柠檬精的绑定和右键创建了") “父子值名 创建删除呦”
  3，
    重复的起始号=1
    重复(9次)，〖i〗
      重复(a次)，〖j〗量c=i*j；说点("$i*$j=$c")。说()；听去单行
  4，
    窗配置为，标题="我的图形窗口"；背景色=钢蓝色；宽高=矩(230、200)。去显示
    任务， --http://www.zyuyan.org/SmallZyy/SZDemo/Index https://www.grasspy.cn/应用指南/图快库指南.html
      窗的标题="动画"
      量A=矩(50)的形配置为，色=绿色；点=几何.点(200、200)。
      动(A、1秒)去移动至(点(0、0))
      等待 睡(1.05秒)
      窗的标题="动画完了"
  5，
    量k=现薄的现表[0,0]
    k的值="我在学习Office二次开发"
    量计数=3000
    k去移右；k的值=计数
    说("程序终了")
  6，--https://zhuanlan.zhihu.com/p/55463326
    量 小三="张三"到18
    量提取(名字、年龄)=小三
    说("$名字 $年龄")
    说(小三去化列去拼和以(" "))
 
    量 答案=随机去取数(1~100)
    事 看大小(n) = 判n，
      「<答案」，"小"。「>答案」，"大"。「是答案」，"恭喜，是$n"。
    说("猜猜我想的是几?")
    重复若真，
      量 果=看大小(听去数)
      若(果的长不大1)，说("太$果")。
      否则，说(果)；停下。

量A=注册表("""HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced""")；量k="ExtendedUIHoverTime"
事 显示任务栏窗口预览数据 为
  若A 试不存，回。
  A[k]?去令为，说("当前任务栏窗口预览数据是：${它}")。 空则说("版本不对")
事 取消任务栏缩预览 为
  (创建A)[k]=90000 --A去创若无
  说("取消任务栏缩预览成功")
量A1=A的父["HideDesktopIcons\NewStartPanel"]
量 显控制面板=A1的键["{5399E694-6CE5-4D6C-8FCE-1D8870FDCBA0}"]

*/

//感觉Z语言的 tokenize 就有点迷，虽说是 ZStatic,ZCode("以(string:s)拼") 构造出来的字典吧，总觉得它分词时应该预判是 class 还是函数，然后再加 prim value 成序列，是不是未免有点太灵活。。
//你要说是一个先进点，我觉得未必，毕竟这实际就是构造个能分 ["a"]以"wtf"拼 的动态执行多态、跳空格 Trie 树，不能类型推导话挺损性能的，然后即便有，非形式文法代码量也会少很多的，应该是以函数而非流控为主的语言
//事实是它 v=>量; 函数:Tab 如果Tab否则 很像一个“脚本语言”，不过我觉得如果不是作者不会起名字，写起来应该不会太差，而且这貌似支持缩排（虽我在示例没有看到比 2Tab 深的语句）

//你说吴的 求8的oct值， 啊那个形式文法 求Num的Name值，它不就是 oct(8) 或者 8|>oct=>o8 这种表示吗，为什么要弄个所谓清晰易懂的记法？啊？那么长我们写个毛的代码啊
//我发现有些人真是对代码审美都没就生硬在追求中文编程，值与类型都分不清，命名从来没简洁又易懂过，真是无语了，其实用组合子都能规避掉语言结构汉化的，汉化编程有毛用啊，起那种要不然太长要不单字的语言构词


文2=`英文名	中文名	英文名	中文名	英文名	中文名
a	点	abbr	略	address	址
area	域	article	章	aside	旁
audio	音	b	专	base	基
bdi	脱	bdo	盖	big	大
blockquote	引语	body	体	br	起
button	钮	canvas	布	caption	表题
cite	证	code	码	col	列
colgroup	列组	data	料	datalist	数列
dd	描述	del		details	
dfn	释	dialog	话框	div	容
dl	列表	dt	列项	em	注
embed		fieldset	域集	figcaption	物题
figure	物	footer	脚	form	单
h1	题1	h2	题2	h3	题3
h4	题4	h5	题5	h6	题6
head	头	header	首	hgroup	题组
hr	隔	html	标语	i	斜
iframe	内框	img	像	input	入
ins		kbd	键	keygen	
label	签	legend	例	li	项
link	链	main	主	map	图
mark	记	marquee		menu	
menuitem		meta	元	meter	尺
nav	导	noscript		object	件
ol	序	optgroup	项组	option	配
output	出	p	段	param	
picture		pre	预	progress	度
q	录	rp		rt	
ruby		s	划	samp	样
script	令	section	节	select	选
small	小	source	源	span	块
strong	强	style	式	sub	下
summary		sup	上	table	表
tbody	表体	td	数元	textarea	文域
tfoot	表脚	th	头元	thead	表头
time	时	title	标题	tr	表行
track	轨	u	要	ul	杂
var	量	video	影	wbr`


表3=反分列(反文(文2),6);
说(表3)
说(文表(表3)) // 嗯缺了点…… rows分页再每行\t每页\n 不就是了?


const _tpl=(a,...sfill)=>con.log(a,sfill)
_tpl`I love ${"pizza"}`

//呃，很普通啊，emet 里参数名字化封送就要用到
const template=String.raw, //a.reduce((s,ss,i)=>s+ss+arg[i],"")
logic=(a,...vs)=>{
  let no=0, s=a.joinExpr(()=>"_"+ no++), d=Object.fromEntries(vs.zip(newA(no, i=>i), (v,k)=>["_"+k,v])),
  kNeed=[], has=(o,k)=>{kNeed.push(k);return (k in o)||(k in logic)}, get=(o,k)=>(k in o)?o[k]: (L=>{
    let r=L[k];if(typeof r=="function")with(o1)r=eval(r()); return r})(logic), o1; // 如果你的 get 依赖 kNeed 可以现规避TypeError再分两次啊
  with(o1=new Proxy(d,{has,get})){return eval(s)}
}
Object.assign(Array.prototype,{
  zip:function(b,op=(...a)=>a){return this.map((x,i)=>op(x,b[i]))},
  joinExpr:function(op){let n=this.length,z=this.values();return !n?"": newA(n*2-1, i=>(i%2==0)?next(z):op()).join("")}
})

let 销售利润率=1.0, 营业收入=20,营业利润=233,幽默笑话=" 耶哈"
const exampleLogic = logic`
do {
  if(${销售利润率} > 1.2 && ${营业收入} < 700000) { '其实还是蛮高的' }
  else if(${销售利润率} < 0.5) { '不是很高' }
  else { '一般般' }
}while(0)
`;

Object.assign(logic,{
  净利润扣非:()=>"净利润-非经常收益",
  净利润:200, 非经常收益:19
})
con.log(template`
  2017年营业利润为${营业利润}元，营业收入为${营业收入}元，所以销售利润率为${销售利润率}。
他们的销售利润率${exampleLogic}。
  ${logic`Math.random() > 0.5 ? 幽默笑话[1] : 幽默笑话[2]`}
  ${logic`do {
    if (净利润扣非 > ${20}) { '净利润较去年增加，真不错快买' }
    else { '净利润较上期减少，快向你的朋友推荐这只股票' }
  }while(0)`}
`); //净利润=净利润扣非经常+(营业外收入-其支出)
//DAG 就是 Tree 啊，都无环引用的嘛，可是我都不用
//  大扎好，我系${v('明星名1')}，我四${v('明星名2')}，${v('游戏的名字')}，介四里没有挽过的船新版本 ；可是 这样优势不就没了嘛，还 codegen.macro 读 JSON 生成 export
// 然后 ""+do{} 表达式可以用 @babel/standalone 支持

//EDSL 风
logic.need=(f_ctx,...a)=>{ let sa,
  f=eval(/^\((.*?)\)=>/[Symbol.replace](f_ctx,(_,m1)=>`({${(sa=m1)}})=>`)),
  o=Object.fromEntries(sa.split(",").zip(a));
  Object.assign(logic,o); return f(o)
};
con.log(logic.need((老鹰,小鸡,山羊,跳跳虎)=>template`
一天，非常凶猛的老鹰${logic`${老鹰+1}>小鸡?"抓住了":"偷袭了"`}可怜的小鸡；
接着疯狂的山羊=${logic`山羊`} 袭击了${跳跳虎>1? "开心":"伤心"}的${跳跳虎}跳跳虎
`, 1,2,()=>"老鹰+小鸡",-2))


// 博  大  精  深
文3=`颜色:中文名	英文名
浅绿	aqua
黑	black
蓝	blue
樱红	fuch
灰	gray
绿	green
青柠	lime
褐红	maro
海军蓝	nav
橄榄	oliv
橙	orange
紫	purple
红	red
银	silver
蓝绿	teal
白	white
黄	yellow
透	transparent
三透	rgba
相透	hsla
三	rgb
相	hsl

重复:中文名	英文名
复	repeat
无复	no-repeat
复横	repeat-x
复竖	repeat-y

ATTACHMENT_T:中文名	英文名
动	scroll
定	fixed
区	local

POSITION_T:中文名	英文名
左	left
中	center
右	right
上	top
下	bottom

INHERIT_T:中文名	英文名
传	inherit
反	invert
始	initial
无	none
普	normal

UNIT_T:中文名	英文名
素	px
厘	cm
毫	mm
点	pt
英	in
应	rem

DIRECTION_T:中文名	英文名
左右	ltr
右左	rtl

TEXT_ALIGN_T:中文名	英文名
左	left
右	right
中	center
端	justify

TEXT_DECORATION_T:中文名	英文名
下线	underline
上线	overline
中线	line-through
闪	blink

BLUR_T:中文名	英文名
朦	blur

TEXT_TRANSFORM_T:中文名	英文名
首	capitalize
大	uppercase
小	lowercase

UNICODE_BIDI_T:中文名	英文名
嵌	embed
覆	bidi-override

VERTICAL_ALIGN_T:中文名	英文名
基线	baseline
下标	sub
上标	super
上	top
文上	text-top
中	middle
下	bottom
文下	text-bottom

WHITE_SPACE_T:中文名	英文名
预	pre
直	nowrap
预换	pre-wrap
预行	pre-line

FONT_NAME_T:中文名	英文名
宋	SimSun,STSong
黑	SimHei,STHeiti
楷	KaiTi,STKaiti
仿宋	FangSong,STFangsong
衬线	Serif
乔治亚	Georgia

FONT_SIZE_T:中文名	英文名
微	smaller
巨	larger
小	small
中	medium
大	large
x小	x-small
xx小	xx-small
x大	x-large
xx大	xx-large

FONT_STYLE_T:中文名	英文名
斜	italic
倾	oblique
小型	small-caps
粗	bold
重	bolder
细	lighter
题	caption
图	icon
选	menu
盒	message-box
小题	small-caption
态	status-bar

PSEUDO_T:中文名	英文名
链	link
访	visited
旋	hover
击	active

LIST_STYLE_POSITION_T:中文名	英文名
里	inside
外	outside
盘	disc
圆	circle
方	square
数	decimal
数0	decimal-leading-zero
小罗	lower-roman
大罗	upper-roman
小英	lower-alpha
大英	upper-alpha
小腊	lower-greek
小拉	lower-latin
大拉	upper-latin
希	hebrew
尼	armenian
乔	georgian
中	cjk-ideographic
日1	hiragana
日2	katakana
日3	hiragana-iroha
日4	katakanas-iroha

BORDER_WIDTH_T:中文名	英文名
细	thin
中	medium
粗	thick
隐	hidden
点	dotted
虚	dashed
实	solid
双	double
槽	groove
脊	ridge
嵌	inset
突	outset
分	separate
合	collapse
满	fill

AUTO_T:中文名	英文名
机	auto

BORDER_IMAGE_REPEAT_T:中文名	英文名
伸	stretch
铺	repeat
缩	round
布	space

VISIBILITY_T:中文名	英文名
显	visible
隐	hidden
卷	scroll
无示	no-display
无容	no-content

DISPLAY_T:中文名	英文名
块	block
联	inline
联块	inline-block
陈项	list-item
论	run-in
表	table
联表	inline-table
表行组	table-row-group
表头组	table-header-group
表脚组	table-footer-group
表行	table-row
表列组	table-column-group
表列	table-column
表元	table-cell
表题	table-caption
柔	flex
联柔	inline-flex

POSITION_STYLE_T:中文名	英文名
绝	absolute
固	fixed
相	relative
静	static
粘	sticky

CURSOR_T:中文名	英文名
默	default
十	crosshair
点	pointer
移	move
右	e-resize
右上	ne-resize
左上	nw-resize
上	n-resize
右下	se-resize
左下	sw-resize
下	s-resize
左	w-resize
文	text
等	wait
助	help

JUSTIFY_CONTENT_T:中文名	英文名
柔始	flex-start
柔终	flex-end
中	center
空间	space-between
空边	space-around
伸	stretch

名称:中文名	英文名
背景色	background-color
背景图	background-image
背景复	background-repeat
背景附	background-attachment
背景位	background-position
背景	background
字族	font-family
字号	font-size
字样	font-style
字变	font-iant
字粗	font-weight
字体	font
陈样图	list-style-image
陈样位	list-style-position
陈样式	list-style-type
陈样	list-style
框宽	border-width
框样	border-style
框颜	border-color
框角	border-radius
框并	border-collapse
框	border
框底宽	border-bottom-width
框底样	border-bottom-style
框底颜	border-bottom-color
框底左角	border-bottom-left-radius
框底右角	border-bottom-right-radius
框底	border-bottom
框上宽	border-top-width
框上样	border-top-style
框上颜	border-top-color
框上左角	border-top-left-radius
框上右角	border-top-right-radius
框上	border-top
框左宽	border-left-width
框左样	border-left-style
框左颜	border-left-color
框左	border-left
框右宽	border-right-width
框右样	border-right-style
框右颜	border-right-color
框右	border-right
框图源	border-image-source
框图移	border-image-slice
框图宽	border-image-width
框图突	border-image-outset
框图重	border-image-repeat
框图	border-image
框距	border-spacing
廓颜	outline-color
廓样	outline-style
廓宽	outline-width
廓	outline
缘	margin
缘下	margin-bottom
缘左	margin-left
缘右	margin-right
缘上	margin-top
衬	padding
衬下	padding-bottom
衬左	padding-left
衬右	padding-right
衬上	padding-top
颜	color
向	direction
字间	letter-spacing
行高	line-height
文齐	text-align
文饰	text-decoration
文进	text-indent
文影	text-shadow
文换	text-transform
文双向	unicode-bidi
垂齐	vertical-align
空白	white-space
字距	word-space
高	height
顶	max-height
广	max-width
底	min-height
狹	min-width
宽	width
见	visibility
视	display
位	position
下	bottom
剪	clip
标	cursor
左	left
右	right
上	top
溢	overflow
溢横	overflow-x
溢竖	overflow-y
叠序	z-index
浮	float
离	clear
整容	justify-content
齐容	align-content`
