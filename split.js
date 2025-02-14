global.crypto = require('crypto');
const Decimal = require('decimal.js');
Decimal.set({ rounding: 5 });
Decimal.set({ modulo: Decimal.ROUND_FLOOR });
Decimal.set({ crypto: true });
Decimal.set({ precision: 1e+4 });
Decimal.set({ toExpPos: 1000 });
const secret = '0x6a17a7d15ace9582eee61573e9c646c2f206c707261077668e24a7802cedbe16'; // hexadecimal string representing the secret to be split
const prime = Decimal('2').pow(333).sub(1);

function divmod(a, b, n) {
  let aCopy = (a instanceof Decimal) ? a : new Decimal(a);

  let bCopy = (b instanceof Decimal) ? b : new Decimal(b);

  let nCopy = (n instanceof Decimal) ? n : new Decimal(n);

  let t = Decimal('0');
  let nt = Decimal('1');
  let r = nCopy;
  let nr = bCopy.mod(n);
  let tmp;
  while (!nr.isZero()) {
    let quot = Decimal.floor(r.div(nr));
    tmp = nt;  nt = t.sub(quot.times(nt));  t = tmp;
    tmp = nr;  nr = r.sub(quot.times(nr));  r = tmp;
  };
  if (r.greaterThan(1)) return Decimal(0);
  if (t.isNegative()) t = t.add(n);
  return aCopy.times(t).mod(n);
}

function random(lower, upper) {
  if (lower > upper) {
    const temp = lower;
    lower = upper;
    upper = temp;
  }

  return lower.add(Decimal.random().times(upper.sub(lower + 1)).floor());
}

// Polynomial function where `a` is the coefficients
function q(x, { a }) {
  let value = a[0];
  for (let i = 1; i < a.length; i++) {
    value = value.add(x.pow(i).times(a[i]));
  }

  return value;
}

function split(secret, n, k, prime) {
  if (Number.isInteger(secret) || Number.isInteger(prime)) {
    throw new TypeError(
      'The shamir.split() function must be called with a String<secret>' +
      'but got Number<secret>.'
    );
  }

  if (Number.isInteger(prime)) {
    throw new TypeError(
      'The shamir.split() function must be called with a String<prime>' +
      'but got Number<prime>.'
    );
  }

  if (secret.substring(0, 2) !== '0x') {
    throw new TypeError(
      'The shamir.split() function must be called with a' +
      'String<secret> in hexadecimals that begins with 0x.'
    );
  }

  if (!(prime instanceof Decimal) && prime.substring(0, 2) !== '0x') {
    throw new TypeError(
      'The shamir.split() function must be called with a' +
      'String<prime> in hexadecimals that begins with 0x.'
    );
  }

  const S = Decimal(secret);
  const p = Decimal(prime);

  if (S.greaterThan(prime)) {
    throw new RangeError('The String<secret> must be less than the String<prime>.');
  }

  let a = [S];
  let D = [];

  for (let i = 1; i < k; i++) {
    let coeff = random(Decimal(0), p.sub(0x1));
    a.push(coeff);
  }

  for (let i = 0; i < n; i++) {
    let x = Decimal(i + 1);
    D.push({
      x,
      y: q(x, { a }).mod(p),
    });
  }

  return D.map((share) => ({
    x: share.x.toString(),
    y: share.y.toHex(),
  }));
}
var ans = split(secret,4,3,prime);
const combI = combine(ans,prime);
console.log(ans);
console.log(combI, "split + combi");

function lagrangeBasis(data, j) {
  // Lagrange basis evaluated at 0, i.e. L(0).
  // You don't need to interpolate the whole polynomial to get the secret, you
  // only need the constant term.
  let denominator = Decimal(1);
  let numerator = Decimal(1);
  for (let i = 0; i < data.length; i++) {
    
    if (!data[j].x.equals(data[i].x)) {
      denominator = denominator.times(data[i].x.minus(data[j].x));
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (!data[j].x.equals(data[i].x)) {
      numerator = numerator.times(data[i].x);
    }
  }

  return {
    numerator,
    denominator,
  };
}

function lagrangeInterpolate(data, p) {
  let S = Decimal(0);
 console.log(p,"prime")
  for (let i = 0; i < data.length; i++) {
    let basis = lagrangeBasis(data, i);
    console.log(basis, "basis")
    console.log("divmod is",divmod(basis.numerator, basis.denominator, p),"divMod for i",i,"prime:",p)
    S = S.add(data[i].y.times(divmod(basis.numerator, basis.denominator, p)));
  }

  const rest = S.mod(p);
  console.log(rest,"lagrange result")


  return rest;
}

function combine(shares, prime) {
  const p = Decimal(prime);

  // Wrap with Decimal on the input shares
  const decimalShares = shares.map((share) => ({
    x: Decimal(share.x),
    y: Decimal(share.y),
  }));
  console.log(decimalShares)

  return lagrangeInterpolate(decimalShares, p);
}



// const ansW = combine(shares,prime)


// secret_str = ansW.toString()


// console.log(secret_str , "combined");

exports.split = split;
exports.combine = combine;
exports.divmod = divmod;