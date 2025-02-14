pragma circom 2.1.4;
include "circomlib/comparators.circom";
include "circomlib/sign.circom";
include "circomlib/bitify.circom";



template floor(v){
    var t;

    signal output outf;
    if(v<0){

       t=v +(-1);
       outf <== t;
    }
    else outf <== v;
}


template lagrangeBasis(data, i) {
   var numerator = 1;
   var denominator = 1;

   signal output outa;
   signal output outb;

   for (var j=0; j<3; j++) {
      if (i != j) {
         numerator = numerator * (-data[j]);
         denominator = denominator * (data[j] - data[i]);
      }
   }

   outa <== numerator;
   outb <== denominator;

}
template IsNegative(){
    signal input in;
    signal output out;
    component n2b = Num2Bits(254);
    component sign = Sign();
    in ==> n2b.in;
    for (var i = 0; i<254; i++) {
        n2b.out[i] ==> sign.in[i];
    }
    sign.sign ==> out;
}

template divmod(num,den,p){

  var t = 0;
  var nt = 1;
  var r = num;
  var nr = den % p;
  var tmp;
  component res;
  component isz = IsZero();
//   component gt = GreaterThan();
  component neg = IsNegative();
  var quot;
  component outd;
  while (!nr.isz) {
    
    quot === floor(r / nr);
    tmp = nt; 

     nt = t - (quot * (nt)); 
      t = tmp;
    tmp = nr;  
    nr = r - (quot * (nr));
      r = tmp;
  }

  if (r > 1 ) 
  {
     outd <== 0;
  }
   
     if (t.neg) 
     {
        t += p;
        }
        res = num * t % p;
  outd <== res;
}



// Lagrange interpolation

template lagrangeInterpolate(data,p){
   var S = 0;
   signal input share[3];

   signal output oute;
   component basis;
   component divI;
   component datA;

   for (var i=0; i<3; i++) {
             basis = lagrangeBasis(data, 1);
             
             var num = basis.outa;
             var den = basis.outb;
             divI = divmod(num,den,p);
             datA = (data[i].y * divI);

   S = S + datA ;
  }

  var rest = S % (p);

  oute <== rest;
}
template combine () {
    signal input share[3][2];
  var sharesX;
   var sharesY; 
    signal output secret[3][2]; 

    var  shares[3][2];
 for(var i = 0;i<3;i++)

 {
    sharesX = share[i][0];
    sharesY = share[i][1];
    shares[i][0] = sharesX;
    
    shares[i][1] = sharesY;

    
 }
  secret <== shares;
}
// component main = combine();

  /* INPUT = {
    "share":[["0","1"],["8","1"],["1","4"]]
} */


// secret <== lagrangeInterpolate(shares, prime);
// }


component main{public[share,prime]} = combine();