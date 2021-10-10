//水仙花、冰雹数、百钱百鸡枚举
tri(x){return x*x*x;}
sxh(){
  int i,n=1000, a,b,c;//个十百, 末没直接%余10
  for(i=100;i<n;i++){ if(tri(i%10)+tri(i/10%10)+tri(i/100) ==i)printf("%d ",i); }
}

p(int i,int x){printf("(%d):%d\n",i,x);}
xb(int x){//scanf 输入一个&整数
  int i=1;
  while(x!=1) if(x%2==1){x=3*x+1; p(i++,x);} else {x=x/2; p(i++,x);}
  //不可 do while, 可简化, 分支合并+宏def.
}

bqbj(){
  int x,y,z;//for cock,hen,chicken
  if(x+y+z==100 &&
  5*x+3*y+z/3==100);
}
