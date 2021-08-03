nextCharForNumStr = (str) =>
  String.fromCharCode(parseInt(str.trim()) + 1)

_("64")=='A';

nextCharForNumStr1 = (str) => {
  const trimmed = str.trim()
  const number = parseInt(trimmed)
  const nextNumber = number + 1
  return String.fromCharCode(nextNumber)
}

nextCharForNumStr2=pipe(_.trim(), parseInt, i=>i+1, String.fromCharCode)

const Box = (x) => ({
  map: f => Box(f(x)),        // 返回容器为了链式调用
  fold: f => f(x),            // 将元素从容器中取出
  inspect: () => `Box(${x})`, // 看容器里有啥
})
Box(1) === Box.of(1);
//map 单向转化律 (f.g) 组合律， id 定点律

findColor = (name) => ({
  red: '#ff4444',
  blue: '#3b5998',
  yellow: '#fff68f',
})[name]
findColor('red').slice(1) .toUpperCase()=="FF4444";

Ei={L:noOp,R:"x=>f(x)"}
gen(Ei, (v,k)=>x=>Instype(x. {
  map:f=>eval(v); //不在错误值上继续计算
  fold:k=="L"? (f,_)=>x=>f(x) : (_,g)=>x=>g(x)
  //chain=flatMap 相当于现在的 map
}))

$YN(q=>(q?Ei.R:Ei.L)(4)
  .map(x => x * 7 + 1)
  .map(x => x / 2)
  .fold(just("err"), noOp)
)

Ei.nul=v=>(isNun(v)?Ei.L:Ei.R)(v)

findColor('green')
  .map(c => c.slice(1))
  .fold(
    e => 'no color',
    c => c.toUpperCase()
  )=="no color";

getPort = () => {
  try {
    const str = fs.readFileSync('config.json')
    const { port } = JSON.parse(str)
    return port
  } catch(e) {
    return 3000
  }
}

tryCatch=f=>{
  try{return Ei.R(f());}
  catch(ex){return Ei.L(ex);}
}

getPort1 = () => tryCatch(
    () => fs.readFileSync('config.json')
  )
  .map(c => JSON.parse(c)) //也可能出错
  .fold(e => 3000, c => c.port)

getPort = () => tryCatch(
    () => fs.readFileSync('config.json')
  )
  .chain(c => tryCatch(() => JSON.parse(c))) // 结果递交给第二层Either 去决定下一步map
  .fold(
    e => 3000,
    c => c.port
  )
// chain 的作用是将两个操作类型联系起来
{
join = m => m.chain(noOp)
join(m.map(join)) == join(join(m))
join(M.of(m)) == join(m.map(M.of))
m.map(f) == m.chain(x => M.of(f(x))) //实现了 Functor
}

//半群（Semigroup）：抽象(+) 若 T 其 a+b 属 T 则 {T,+} 是广义群；广义群满足 (a+b)+c==a+(b+c) 结合性为半群
//(a/b)/c==a/(b/c) 不满足， (*) 满足，不可直接导出 a+c+b 但推测求值是无序的
//String,Array 与其 concat 方法构成半群

Sum=x=>({x, concat:({x:x1})=>x+x1 }) //Bool(&&) 也满足半群
Sum(1)
  .concat(Sum(2))//Sum(3)

//First.concat 只知道首个 x ，它不满足 f(f(a,b),c) ==f(a,f(b,c)) 但仍很像
//如果有两个记录，可以将其键各自化为半群如 Sum+,All&, First
concatObj = (obj1, obj2) => Object.entries(obj1)
  .map(([ key, val ]) => ({
    // concat 两个对象的值
    [key]: val.concat(obj2[key]),
  }))
  .reduce((acc, cur) => ({ ...acc, ...cur }))

//幺(yao1)半群（Monoid）：存在单位元的半群；单位x满足 x+a==a+x 即 (o=>x+o) ==noOp 不动点函数
{
  Number:[["*", 1], ["", 0], ["Max",Infinity],["Min",-Infinity]],
  Boolean:[["&",true], ["|",false]]
}
//First 没有定点参数，不是幺半群

monoid = xs => xs.reduce(//fold(empty=幺元)
    (acc, cur) => acc.concat(cur),  // 使用 concat 结合
    Monoid.empty()                  // 传入幺元
)

//List,Map 相当于 Array,Map/Object.create(null) ，其幺元是 [], new Map

List.of(1, 2, 3)
  .map(Sum)
  .fold(Sum.empty())
List().fold(Sum.empty())

fold=(s,f)=>s.foldMap(noOp,NO)
foldMap=(s,f,x0)=>isNul(x0)? s.map(f).reduce((a,x)=>a:x) : s.reduce((a, x,i)=>a:f(x,i) , x0)

List.of(1, 2, 3)
  .foldMap(Sum, Sum.empty()) //合并 map&fold

LazyBox = (g) => ({
  map: f => LazyBox(() => f(g())), //它会记录所有 f 但直到 fold 才链表式执行
  fold: f => f(g()),
})

//chain flatMap,map Functor,concat Semigroup,empty mzero

Task.of(1).fork()//Entier.fold
Task
  .rejected(1)
  .map(x => x + 1)
Task
  .of(1)
  .chain(x => new Task.of(x + 1))

lauchMissiles = () => (// 和 promise 很像，不过 promise 会立即执行；参数位置相反
  new Task((rej, res) => {
    console.log('lauchMissiles')
    res('missile')
  })
)
lauchMissiles()
  .map(x => x + '!').fork()//这时才 log

app = () => (
  fs.readFile('config1.json', 'utf-8', (err, contents) => {
    if (err) throw err

    const newContents = content.replace(/8/g, '6')

    fs.writeFile('config2.json', newContents, (err, _) => {
      if (err) throw err

      console.log('success!')
    })
  })
)
readFile = (file, enc) => (
  new Task((rej, res) =>
    fs.readFile(file, enc, (err, str) =>
      err ? rej(err) : res(str)
    )
  )
), writeFile = (file, str) => (
  new Task((rej, res) =>
    fs.writeFile(file, str, (err, suc) =>
      err ? rej(err) : res(suc)
    )
  )
)

app1 = readFile(cfg1, 'utf-8')
  .map(str => str.replace(/8/g, '6'))
  .chain(str => writeFile(cfg2, str))

app.fork(
  e => console.log(`err: ${e}`),
  x => console.log(`suc: ${x}`)
)

Box(2).map(add).inspect() // Box(y => 2 + y)
//String((x=>y=>x-y)(1))

Box(2)
  .chain(x => Box(3).map(add(x))) //先映为 Box(y=>) 的“部分参数”应用，再提供参2；不过这样 map 得等 Box 完整执行才能去部分应用，双异步想 map (一套一)会麻烦

Box.ap= box => box.map(x) //扩充,内容x是函数
F(x).map(f) === F(f).ap(F(x))// 就是说：
Box(add).ap(Box(2)) == Box(2).map(add)

liftA2 = f => fx => fy => fx.map(f).ap(fy) //x,y 两个f_ 的ap ；把 f 提升到 f_ 之间去操作
liftA3 = f => fx => fy => fz => fx.map(f).ap(fy).ap(fz)//本质是 curry&reduce

liftA2(add, Box(2), Box(4)) // Box(6)

// 假装是个 jQuery 接口~
const $ = css =>
  Either.of({ selector:css, height: 10 })

const getScreenSize = screen => head => foot =>
  screen - (head.height + foot.height)

liftA2(getScreenSize(800/*scr*/))($('header'))($('footer')) // Right(780)

// List 的笛卡尔乘积(翻卡钟组合)
List.of(x => y => z => [x, y, z].join('-'))
  .ap(List.of('tshirt', 'sweater'))
  .ap(List.of('white', 'black'))
  .ap(List.of('small', 'medium', 'large'))

const Db = ({
  find: (id, cb) =>
    new Task((rej, res) =>
      setTimeout(() => res({ id, title: `${id}`}), 100)
    )
})

const reportHeader = (p1, p2) =>
  `Report: ${p1.title} compared to ${p2.title}`

Task.of(p1 => p2 => reportHeader(p1, p2))
  .ap(Db.find(20))
  .ap(Db.find(8))
  .fork(console.error, console.log) // Report: 20 compared to 8

liftA2
  (p1 => p2 => reportHeader(p1, p2))
  (Db.find(20))
  (Db.find(8))
  .fork(console.error, console.log) // Report: 20 compared to 8

//假设我们想用 Monoid 上的映射解决一组问题
a.traverse = (a,point, fn)=>a.reduce((a,x)=>a.map(z => y => z.concat(y)).ap(fn(x)),
    point(a.empty)
  ) // point 是目标类型，fn 是要ap解法
files.traverse(Task.of, file => readFile(file, 'utf-8'))//主要就是通过 applicative functor 调用 ap 方法，再将其执行结果使用 concat 方法合并到数组中
 
const boxToEitherNT= b => b.fold(Right)
nt(x).map(f) == nt(x.map(f)) //函子到函子的变换，Left 不满足此规则
//^对函子 a 做改变再将其转换为函子 b，是等价于先将函子 a 转换为函子 b 再做改变

first = xs => fromNullable(xs[0]),
double = x => x * 2,
getLargeNums = xs => xs.filter(x => x > 100)

first(
  getLargeNums([2, 400, 5, 1000]).map(double)
)

fakeApi = (id) => ({
  id,
  name: 'user1',
  bestFriendId: id + 1,//找这个对应关系
})

const Db = {
  find: (id) => new Task(
    (rej, res) => (
      res(id > 2
        ? Right(fakeApi(id))
        : Left('not found')
      )
    ) //在这个 task 上实现2项关系 filter 操作
  )
},
eitherToTask = (e) => (
  e.fold(Task.rejected, Task.of)
),
four = Db.find(3) //作者在短时间迭代了4版才写出来，所以说范畴论编程的注意点很怪；写半天就是 query.let{query} 的惰性 catch 嵌套
  .chain(eitherToTask) // Task(user)
  .chain(user => Db
    .find(user.bestFriendId) // Task(Either(user))
  )
  .chain(eitherToTask) // Task(user)
  .fork()//总结前两版： chain{fold .chain*2} 多余chain^1, chain*3 ，都出现了 .fold(Task.rejected, Task.of) 所以抽提了

  
to(from(x)) === x
from(to(y)) === y//前提是无损， isEq(x,y)

const Iso = (to, from) => ({ to, from })//map:f, from(f(to(x)))

const chars = Iso(
  s => s.split(''),
  c => c.join('')
),
singleton = Iso( //n(1) 数组<- Either
  e => e.fold(() => [], x => [x]),
  ([ x ]) => x ? Right(x) : Left()
)

getUCH = (str) =>( ((a,p)=>singleton.map(a=>a.filter(p), a)) (
  Right(str),
  x => x.match(/h/ig) //数组的 filter
)).map(x => x.toUpperCase())

getUCH('hello') // Right(HELLO)
getUCH('ello') // Left() // 注意 match结果是[]|null ，.map 表达的是如有继续计算

/*
 'Lorem ipsum dolor sit amet consectetur adipiscing elit'
 with(Equiv){pipe(join(" ").flip, map(n,randStrN), max.fwd)}

getIncompleteTaskSummaries = function(membername) {
  return fetchData()
    .then(R.prop('tasks'))
    .then(R.filter(R.propEq('username', membername)))
    .then(R.reject(R.propEq('complete', true)))
    .then(R.map(R.pick(['id', 'dueDate', 'title', 'priority'])))
    .then(R.sortBy(R.prop('dueDate')));
};

f=name=>fetch().then(
  prop.tasks,
  _.filter(opr.username("=",name), opr. opr.getK.complete ),
  _.map(_.key(ss("id dueDate title priority"))),
  _.incre($Y, prop.dueDate)
)

对何<项、返>性质推导，
  变，a：列；p：命题；op：(项)返
  a去映为(op)去滤出(p)是a去滤出(p)去映为(op)
 */
