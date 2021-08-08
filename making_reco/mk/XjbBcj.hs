import Prelude hiding(read,write, replicate)
import GHC.Prim(RealWorld)
import Data.Vector.Unboxed.Mutable
import qualified Text.Read

type UFind=(MVector RealWorld) Int

walk :: UFind->Int-> IO Int
walk o a = do
  b<-read o a
  if a==b then pure a else do
    b0<-walk o b
    write o a b
    pure b0

merg :: Bool-> UFind->(Int,Int)->IO Int
merg q o (a,b) = do
  a0<-_0 a
  b0<-_0 b
  if q then (write o a0 b0)>>pure b0 else pure(if a0==b0 then 1 else 0)
  where
    _0=walk o

main=do
  [n,nC]<-ints
  o<-replicate (n+1) (0::Int)
  forM_ o (\i->write o i i)
  rep o nC
  where
  rep o n=if n==0 then return() else do
    let yn q=if q then "Y" else "N" in do
    [k,a,b]<-ints
    (merg (k==1) o (a,b) )>>=(putStrLn.yn.(==1))
    rep o (n-1) --各种算符优先级问题，有受够Hs了
  ints=readLn>>= (readIO::String->IO [Int])