#include<stdio.h>
main(){
  int x, a[30],i=0,iH=0;
#define inc(i) i=(i+1)%30
  while(scanf("%d",&x))if(x!=-1)a[inc(i)]=x;//首次写a[1[
  else{ while(iH!=i)printf("%d ",a[inc(iH)]);  puts("");}
}
