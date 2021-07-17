# 同类项目概况

>from the [offical list](http://minikanren.org/#implementations), only "industrial language"s

```js
let us=[.../\((.*?)\)/g[Symbol.matchAll](prompt())] // paste lists below
us.map(([_,u])=>/\/blob\/.*$/[Symbol.replace](u,"")).forEach(u=>{let e=document.querySelector(`a[href="${u}"]`); if(e)e.classList.add("added")})
// NOTE: Trie algor. is required to detect common prefixes, so pls. recheck by yourself
```

- Py [Microkanren tryout Gist](https://gist.github.com/cheery/d89bfb4c8d6c7a3eb908) 133 `itertools.izip=interleave`. [, by zatax](https://github.com/zaxtax/microKanren/blob/master/microkanren.py)
- [GH:logpy/logpy: Logic Programming in Python](https://github.com/logpy/logpy) 800+star, core+goals=301+205 , with __assoc/comm property facts__
- [pythological/pythological.py · darius/pythological](https://github.com/darius/pythological/blob/master/pythological.py#L153) 285, parser
- [kanrens/main.py · jcoglan/kanrens](https://github.com/jcoglan/kanrens/blob/master/python/main.py)=jcoglan 182, mu-like
- [pykanren/microkanren.py · jtauber/pykanren](https://github.com/jtauber/pykanren/blob/master/microkanren.py) 285, lispy
- [KANREN](https://github.com/mbillingr/miniKANREN/blob/master/Python/goals.py)=mbillingr `poso`, `rangeo`, `once`
- [mKPy](https://github.com/massimo-nocentini/microkanrenpy/blob/master/src/mclock.py) 846 w/o parser, math, __full Reasoned Schemer__
- [mK](https://github.com/ethframe/microkanren/blob/master/mk/core.py) core+unify=81+61, `conde`, full numbero, __great docs__
- Kt [GH:MechaRex/logikaldb: Foundational reactive logical database](https://github.com/MechaRex/logikaldb) database with descriptive/constraint
- veyndan/kanren has only `walk()`
- [KotlinKanren/MicroKanren.kt · neilgall/KotlinKanren](https://github.com/neilgall/KotlinKanren/blob/master/src/main/kotlin/uk/neilgall/kanren/MicroKanren.kt) 80, Kt Sequences, standalone Data, uK/mK
- Lua [miniKanren.lua/mk.lua · handsomecheung/miniKanren.lua](https://github.com/handsomecheung/miniKanren.lua/blob/master/mk.lua) 494, __suduku__
- lua-ukanren, 195, `Cons`, has no examples
- clayrat/kanren has only unification tests
- Ruby [GH:famished-tiger/mini_kraken: A (partial) miniKanren implementation in Ruby.](https://github.com/famished-tiger/mini_kraken/) (_too many files_)
- [mini_kanren/core.rb · spariev/mini_kanren](https://github.com/spariev/mini_kanren/blob/master/lib/mini_kanren/core.rb) 297, __full num relations__
- [Hello, declarative..](https://github.com/tomstuart/kanren) __guide__
- jsl, levthedev: too basic
- [ScottDial mK](http://scottdial.com/projects/minikanren.rb) 472, __good API naming&tests__ _bad code style_
- PHP [GH:igorw/reasoned-php: A miniKanren in PHP.](https://github.com/igorw/reasoned-php) __full docs__
- [GH:mudge/php-microkanren: A PHP implementation of μKanren.](https://github.com/mudge/php-microkanren) full doc-ed muK
- Scala [GH:namin/scalogno: prototyping logic programming in Scala](https://github.com/namin/scalogno) presented in APLAS'19
- [mukanren/MuKanren.scala · jsyeo](https://github.com/jsyeo/mukanren/blob/master/src/main/scala/MuKanren.scala) 195, Data,Cons, `reverseo`
- TS [GH:atennapel/async-kanren: Async version of uKanren in Typescript](https://github.com/atennapel/async-kanren) use pair+Promise stream, backed by EAV(doc DB), REPL
- [microkanren/index.ts · mwjaworski](https://github.com/mwjaworski/microkanren/blob/master/lib/index.ts) 222, 1 file OK
- gamburgm/microKanren.ts: too long, no fun tests

Part2

- [idris-microKanren/Examples.idr · joom](https://github.com/joom/idris-microKanren/blob/master/Examples.idr) 86, basic examples
- [GH:dvberkel/microKanren: An Elm implementation of the μKanren language.](https://github.com/dvberkel/microKanren) 172, sudoku(_low code quality!_ fixed 4x4 grid)
- [FSharp](https://github.com/kurtschelfthout/FsLogic/blob/master/FsLogic/Substitution.fs), [shorter](https://github.com/palladin/logic/blob/master/src/logic.core/logic.fs)
- [GH:various language imp.](https://github.com/bodil/microkanrens) original muK flavor.
- [groovy-logic/Logic.groovy · timyates](https://github.com/timyates/groovy-logic/blob/master/src/main/groovy/com/bloidonia/logic/Logic.groovy) 531, full num rels.
- Go [GH:GoLangsam/kanren: Logic: Programming it is about :-)](https://github.com/GoLangsam/kanren) doc,recommend links,`conda`, _much files_
- [crystal-kanren/state.cr · jemc](https://github.com/jemc/crystal-kanren/blob/master/src/kanren/state.cr) experiment. wrong modeling: `redirect`
- CSharp [NMiniKanren/KPair.cs · sKabYY](https://github.com/sKabYY/NMiniKanren/blob/master/NMiniKanren/KPair.cs) Chinese. muK+
- [yousetme/ykanren](https://github.com/yousetme/ykanren/blob/master/mkc.ss) Chinese. with a pure(full enumeration) `conda` operator
- [kanrenmo/kanrenmo · yuretz](https://github.com/yuretz/kanrenmo/tree/master/kanrenmo) _overdesign?_
- [GH:ozzymcduff/csharp_ukanren: A port of mK(Ruby) to CS(the f# versions mentioned on the kanren site more interesting)](https://github.com/ozzymcduff/csharp_ukanren)= wallymathieu/csharp_ukanren  189 Core, muK+ _too many class-member modifiers_
- [cslogic/Goal.cs · verophyle](https://github.com/verophyle/cslogic/blob/master/CSLogic/Goal.cs) 131 Core, `IUnifiable.unify(other,s)`
- [Logic/LogicEngine.cs · waf](https://github.com/waf/Logic/blob/master/Logic/Engine/LogicEngine.cs) 216 w/o LINQ, very basic
- [GH:naasking/uKanren.NET: A native implementation of the MicroKanren DSL for .NET](https://github.com/naasking/uKanren.NET/blob/master/uKanren/Kanren.cs#L245) 316, __great metaprogramming__
- VPetukhov/miniKanren: no mK side tests

Part3

- [minikanren/Term.java · mmaroti](https://github.com/mmaroti/minikanren/blob/master/src/minikanren/core/Term.java) 212 core, AST, stream
- [java8kanren/Substitution.java · heidisu](https://github.com/heidisu/java8kanren/blob/master/src/main/java/org/morkland/java8kanren/Substitution.java) `condAux`
- [archelogic/MicroKanren.java · free-variation](https://github.com/free-variation/archelogic/blob/master/src/archelogic/MicroKanren.java) 1094, full numbero/listo
- [minikanren4j/And.java at stable · adarshsoodan/minikanren4j · GitHub](https://github.com/adarshsoodan/minikanren4j/blob/stable/src/main/java/in/neolog/minikanren/goal/And.java) SubstMap,stream, `diseq`
- [mk.java/MicroKanren.java · nd](https://github.com/nd/mk.java/blob/master/src/main/java/MicroKanren.java) 241, very basic tests
- sebug/SebuKanren _has no source_
- willkurt/microKanren,  bodil/lolkanren are too basic
- JS/Py/Hs [kanrens/main.js · jcoglan](https://github.com/jcoglan/kanrens/blob/master/es6/main.js) goal+state=65+62, Hello,decl. like
- [jolic/logic.js · stanistan](https://github.com/stanistan/jolic/blob/master/src/logic.js) 207, `occur`, underscore.js
- [node-kanren/jKanren.js · keyz](https://github.com/keyz/node-kanren/blob/master/jKanren.js) 469, not pure
- [microkanren-js/mk.js · keyz](https://github.com/keyz/microkanren-js/blob/master/src/mk.js) 183, with rename
- [ukanren.js/index.js · zaach](https://github.com/zaach/ukanren.js/blob/master/index.js) 177, `conde`
- [mk.js/minikanren.js · cduret](https://github.com/cduret/mk.js/blob/master/minikanren.js) 1335, `conde`
- TS [GH:joshcox/kanren: Port of microKanren to JavaScript.](https://github.com/joshcox/kanren)=microJSKanren Hello,decl. __good docs__
- TS [GH:wjlewis/ramo: miniKanren for JavaScript](https://github.com/wjlewis/ramo) __great docs__
- [reason.js/reason.js · RyanGough](https://github.com/RyanGough/reason.js/blob/master/reason.js#L146) 156, `conso`
- [GH:ramda/ramda-logic(rlg): ramda logic](https://github.com/ramda/ramda-logic) _too many files_
- [logic.js/logic.js · shd101wyy](https://github.com/shd101wyy/logic.js/blob/master/lib/logic.js) 550, __full numbero&listo__, Chinese
- WithUI [GH:tca/veneer: miniKanren in the browser](https://github.com/tca/veneer) examples, REPL
- [GH:asolove/microScopeKanren: The microKanren logic language, in JavaScript, with a focus on tracing program execution](https://github.com/asolove/microScopeKanren/blob/master/src/index.sjs) 350, React, single page `appendo`
- [MicroKanren Evaluator](http://functorial.com/mu-kanren/) __good UI__
