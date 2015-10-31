import NumberList from "src/dataTypes/numeric/NumberList";

/**
 * @classdesc Provides a set of tools that work with Numbers.
 *
 * @namespace
 * @category numbers
 */
function NumberOperators() {}
export default NumberOperators;

/**
 * converts number into a string
 *
 * @param {Number} value The number to convert
 * @param {Number} nDecimals Number of decimals to include. Defaults to 0.
 */
NumberOperators.numberToString = function(value, nDecimals ) {
  var string = value.toFixed(nDecimals);
  while(string.charAt(string.length - 1) == '0') {
    string = string.substring(0, string.length - 1);
  }
  if(string.charAt(string.length - 1) == '.') string = string.substring(0, string.length - 1);
  return string;
};

/**
 * decent method to create pseudo random numbers
 * @param {Object} seed
 */
NumberOperators.getRandomWithSeed = function(seed) {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / (233280.0);
};

/**
 * @todo write docs
 */
NumberOperators.numberFromBinaryPositions = function(binaryPositions) {
  var i;
  var n = 0;
  for(i = 0; binaryPositions[i] != null; i++) {
    n += Math.pow(2, binaryPositions[i]);
  }
  return n;
};

/**
 * @todo write docs
 */
NumberOperators.numberFromBinaryValues = function(binaryValues) {
  var n = 0;
  var l = binaryValues.length;
  for(var i = 0; i < l; i++) {
    n += binaryValues[i] == 1 ? Math.pow(2, (l - (i + 1))) : 0;
  }
  return n;
};

/**
 * @todo write docs
 */
NumberOperators.powersOfTwoDecomposition = function(number, length) {

  var powers = new NumberList();

  var constructingNumber = 0;
  var biggestPower;

  while(constructingNumber < number) {
    biggestPower = Math.floor(Math.log(number) / Math.LN2);
    powers[biggestPower] = 1;
    number -= Math.pow(2, biggestPower);
  }

  length = Math.max(powers.length, length == null ? 0 : length);

  for(var i = 0; i < length; i++) {
    powers[i] = powers[i] == 1 ? 1 : 0;
  }

  return powers;
};

/**
 * @todo write docs
 */
NumberOperators.positionsFromBinaryValues = function(binaryValues) {
  var i;
  var positions = new NumberList();
  for(i = 0; binaryValues[i] != null; i++) {
    if(binaryValues[i] == 1) positions.push(i);
  }
  return positions;
};

//////////Random Generator with Seed, From http://baagoe.org/en/w/index.php/Better_random_numbers_for_javascript

/**
 * @ignore
 */
NumberOperators._Alea = function() {
  return(function(args) {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if(args.length === 0) {
      args = [+new Date()];
    }
    var mash = NumberOperators._Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for(var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if(s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if(s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if(s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      // https://github.com/nquinlan/better-random-numbers-for-javascript-mirror/blob/master/support/js/Alea.js#L38
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function() {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function() {
      return random() +
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

  }(Array.prototype.slice.call(arguments)));
};

/**
 * @ignore
 */
NumberOperators._Mash = function() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for(var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return(n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  mash.version = 'Mash 0.9';
  return mash;
};

// create default random function (uses date as seed so non-repeat)
NumberOperators.random = new NumberOperators._Alea();

NumberOperators.randomSeed = function(seed){
  NumberOperators.random = new NumberOperators._Alea("my", seed, "seeds");
  NumberOperators.lastNormal = NaN;
};

// many of these below are from based on 
// https://github.com/mvarshney/simjs-source/blob/master/src/random.js

NumberOperators.powerLaw = function(x0,x1,n){
  var y = NumberOperators.random();
  var x = Math.pow( (Math.pow(x1,n+1)-Math.pow(x0,n+1))*y + Math.pow(x0,n+1), 1/(n+1) );
  return x;
};

NumberOperators.exponential = function(lambda,bClamp){
  var v = -Math.log(NumberOperators.random()) / lambda;
  while(v > 1 && bClamp){
    v = -Math.log(NumberOperators.random()) / lambda;
  } 
  return v; 
};

NumberOperators.pareto = function(alpha){
  var u = NumberOperators.random();
  return 1.0 / Math.pow((1 - u), 1.0 / alpha);
};

NumberOperators.normal = function(mu, sigma) {
  var z = NumberOperators.lastNormal;
  NumberOperators.lastNormal = NaN;
  if (!z) {
    var a = NumberOperators.random() * 2 * Math.PI;
    var b = Math.sqrt(-2.0 * Math.log(1.0 - NumberOperators.random()));
    z = Math.cos(a) * b;
    NumberOperators.lastNormal = Math.sin(a) * b;
  } 
  return mu + z * sigma;
};

NumberOperators.weibull = function(alpha, beta, bClamp) {
  var u = 1.0 - NumberOperators.random();
  var v = alpha * Math.pow(-Math.log(u), 1.0 / beta);
  while(v > 1 && bClamp){
    u = 1.0 - NumberOperators.random();
    v = alpha * Math.pow(-Math.log(u), 1.0 / beta);
  } 
  return v; 
};

// from https://www.riskamp.com/beta-pert
NumberOperators.betaPERT = function(min,max,mode,lambda){
  var range = max-min;
  if(range==0) return min;
  var mu = (min+max+lambda*mode) / (lambda+2);
  var v;
  if(mu == mode)
    v = (lambda/2) + 1;
  else
    v = ( (mu-min)*(2*mode-min-max)) / ((mode-mu)*(max-min));
  var w = (v * (max-mu)) / (mu-min);
  return NumberOperators.rbeta(v,w)*range + min;
};

// from http://stackoverflow.com/questions/9590225/is-there-a-library-to-generate-random-numbers-according-to-a-beta-distribution-f
NumberOperators.rbeta = function(alpha, beta){
  var alpha_gamma = NumberOperators.rgamma(alpha, 1);
  return alpha_gamma / (alpha_gamma + NumberOperators.rgamma(beta, 1));
};

NumberOperators.SG_MAGICCONST = 1 + Math.log(4.5);
NumberOperators.LOG4 = Math.log(4.0);

NumberOperators.rgamma = function(alpha, beta){
  var v,x;
  // does not check that alpha > 0 && beta > 0
  if (alpha > 1) {
    // Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral
    // shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74
    var ainv = Math.sqrt(2.0 * alpha - 1.0);
    var bbb = alpha - NumberOperators.LOG4;
    var ccc = alpha + ainv;

    while (true) {
      var u1 = NumberOperators.random();
      if (!((1e-7 < u1) && (u1 < 0.9999999))) {
        continue;
      }
      var u2 = 1.0 - NumberOperators.random();
      v = Math.log(u1/(1.0-u1))/ainv;
      x = alpha*Math.exp(v);
      var z = u1*u1*u2;
      var r = bbb+ccc*v-x;
      if (r + NumberOperators.SG_MAGICCONST - 4.5*z >= 0.0 || r >= Math.log(z)) {
        return x * beta;
      }
    }
  }
  else if (alpha == 1.0) {
    var u = NumberOperators.random();
    while (u <= 1e-7) {
      u = NumberOperators.random();
    }
    return -Math.log(u) * beta;
  }
  else { // 0 < alpha < 1
    // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
    while (true) {
      var u3 = NumberOperators.random();
      var b = (Math.E + alpha)/Math.E;
      var p = b*u3;
      if (p <= 1.0) {
        x = Math.pow(p, (1.0/alpha));
      }
      else {
        x = -Math.log((b-p)/alpha);
      }
      var u4 = NumberOperators.random();
      if (p > 1.0) {
        if (u4 <= Math.pow(x, (alpha - 1.0))) {
          break;
        }
      }
      else if (u4 <= Math.exp(-x)) {
        break;
      }
    }
    return x * beta;
  }
};

