{-# LANGUAGE Strict #-}
{-# OPTIONS -O2 #-}

module Main where

import Control.Monad hiding (ap)
import GHC.Prim (RealWorld)

--
import qualified Data.Vector.Unboxed.Mutable as Vec

import qualified Data.Text as RD
import qualified Data.Text.IO as IN

import Data.Char (ord)

--
type UnionFind = Vec.MVector (RealWorld) Int

intReadB :: Int -> String -> Int
intReadB n [] = n
intReadB n (c:cs) = intReadB (n*10 + dig2Int c) cs
  where dig2Int = subtract (ord '0') . ord
intRead :: String -> Int
intRead = intReadB 0

readLineInts :: IO [Int]
readLineInts = map(intRead . RD.unpack) . RD.words <$> IN.getLine
--
walkfor :: UnionFind -> Int -> IO Int
walkfor v me = do
  ances <- at me
  if ances == me then (pure ances) else do
    dptr <- walkfor v ances
    make me dptr
    pure dptr {-^also-}
  where
    at = Vec.read v
    make = Vec.write v

cats2 :: UnionFind -> Int -> Int -> IO ()
cats2 v s x = do
  sp <- deep s
  xp <- deep x
  make sp xp
  where
    deep = walkfor v
    make = Vec.write v

iter :: Int -> UnionFind -> IO ()
iter 0 _ = return ()
iter n v = do
  [op, ea, eb] <- readLineInts
  if (merg op) then (cats2 v ea eb) else {-findset-} do
    ap <- deep ea
    bp <- deep eb
    putStrLn . yesno $ ap == bp
  iter (n-1) v
  where
    merg k = k == 1
    deep = walkfor v
    yesno p = if p then "Y" else "N"

main :: IO ()
main = do
  [n, t] <- readLineInts
  vec <- Vec.replicate (n+1) (0::Int)
  forM_[1..n] (\i -> Vec.write vec i i)
  iter t vec
