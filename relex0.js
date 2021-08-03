class Automat {
  copy(){}
  get size(){}
  get beginCell(){}
  isFinal(i){}
  //indices
  //eq,hashcode,toString,Iter
}

/*
 静态 非确定、无穷状态机
 把状态作为整数，而其数据存储在几个数组里(有 分取of,分加append,整体set,容器clear 操作)，机保存起始状态。
 若某次吃字后 bfs 搜索到了 final 格(此格没数据 只是指示其引用格)，即匹配
 
 状态转移储存在每单位(格)里，若新字符存于格的字符类，CellList 添加它: transit(i,c,list)=test|fin? final&!dum: add, child[i] add ，dum 意味着字符类始终为真，如果你要记录加了啥可传 ret=out.reduce mark[i] mergeMark(m,rec|nul)
 clearRange 删除一部分单元，match=CL(this).also{add(begin,it)}.match
 CL. 是 BitSet 压缩的NFA格子集合，merge 时 finalCount 叠加，其 add remove 都要计数终点
 CL 叠加是 charCs 和另项 outs 非fin整体右移 size
 
 其 match(cs, isExact) 基于字符流整体非前缀?测试匹配，过程需要源、至*俩状态表交替，从任何单元找到 final 的至(全字匹配则需到尾)；若当下已有 final 据EOF或!exact直接结果
 其转移集 transSet=cl.flatMapSet { cl1=CellList(){out[i].each(i1) putInto(i1,it)}; charCs[i].ranges { it to Tuple2(cl1, null) } } /或 mark 是所有下项到其前区间的收集
 转移集叠加 finalCount, mark
 
 NFA 其实只代表其整体上的一个改写规则，它是像 1*1 一样可累积修改的，但上面也没有没用变量很难重排层次
 *FA 都可用 PairAry, TripleAry .add(a,b) .a(i) 来改写，CL 可用 ListCounts 重构，俩区间插入可提出 bisect 二分法
Binarize 的 read/save/size 操作可用组合子树形计算
RegExp 解析器本质上是 [] *{}, | 单项修饰/中缀的 reduce ，tmp:NFA 的加号其实可先各自解析再合并
 */
class SNFA extends Automat {
  get size(){charCs}
  constructor(charCs,out){beginCell=finalCell}
  link(a,b){outs[a] .clear .add(b)}
  static finalCell=-1
}
/*
非确定状态机暴露有达-1 的 endCell 即可编织顺序逻辑 seq, br, opt, more/more0, repeat(start,stop?)
*/
class NFA extends SNFA {
  constructor(iend){}
}
class DFA {
  static beginCell=0 // DFA 不可变，构自NFA
}
/*
NFA reduce-dead https://github.com/KiotLand/kiot-lexer/blob/master/src/commonMain/kotlin/org/kiot/automaton/NFA.kt#L134
SNFA.toDFA https://github.com/KiotLand/kiot-lexer/blob/master/src/commonMain/kotlin/org/kiot/automaton/StaticNFA.kt#L306
DFA.minize https://github.com/KiotLand/kiot-lexer/blob/master/src/commonMain/kotlin/org/kiot/automaton/DFA.kt#L142
DFA.compress https://github.com/KiotLand/kiot-lexer/blob/master/src/commonMain/kotlin/org/kiot/automaton/DFA.kt#L258 , L395 for output
DFA mark https://github.com/KiotLand/kiot-lexer/blob/master/src/commonMain/kotlin/org/kiot/automaton/MarkedDFA.kt#L59
TranSet.split bisect https://github.com/KiotLand/kiot-lexer/blob/master/src/commonMain/kotlin/org/kiot/automaton/TransitionSet.kt#L42
bisect https://github.com/KiotLand/kiot-lexer/blob/master/src/commonMain/kotlin/org/kiot/automaton/DFA.kt#L122
 */
