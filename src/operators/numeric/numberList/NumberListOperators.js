import Rectangle from "src/dataTypes/geometry/Rectangle";
import Point from "src/dataTypes/geometry/Point";
import NumberList from "src/dataTypes/numeric/NumberList";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import ListGenerators from "src/operators/lists/ListGenerators";
import TableGenerators from "src/operators/lists/TableGenerators";

/**
 * @classdesc NumberList Operators
 *
 * @namespace
 * @category numbers
 */
function NumberListOperators() {}
export default NumberListOperators;

/**
 * Returns dot product between two numberLists
 *
 * @param  {NumberList1} numberList NumberList of the same length
 * as numberList2.
 * @param  {NumberList2} numberList NumberList of the same length
 * as numberList1.
 * @return {Number} Dot product between two lists.
 */
NumberListOperators.dotProduct = function(numberList1, numberList2) {
  var sum = 0;
  var i;
  var nElements = Math.min(numberList1.length, numberList2.length);
  for(i = 0; i < nElements; i++) {
    sum += numberList1[i] * numberList2[i];
  }
  return sum;
};

/**
 * Returns linear regression between two numberLists in another numberList with items
 * slope, intercept, r squared, n OR in a Point representing the line
 *
 * @param  {NumberList} numberListX of the same length as numberListY.
 * @param  {NumberList} numberListY of the same length as numberListX.
 * @param  {Number} returnType <br>0:NumberList with items slope, intercept, r squared, n.<br>1: Point with slope,intercept
 * @return {Object} result depending on returnType
 * tags:statistics
 */
NumberListOperators.linearRegression = function(numberListX, numberListY, returnType) {
  returnType = returnType == null || returnType > 1 ? 0:returnType;
  var numberListR = new NumberList();
  if(numberListX == null || numberListY == null ||
     numberListX.length != numberListY.length || numberListX.length === 0)
    return returnType===0?numberListR:new Point();
  var sumx=0,sumy=0,sumx2=0,sumxy=0,sumy2=0;

  var n = numberListX.length;
  for(var i = 0; i < n; i++) {
    sumx += numberListX[i];
    sumy += numberListY[i];
    sumx2 += numberListX[i]*numberListX[i];
    sumxy += numberListX[i]*numberListY[i];
    sumy2 += numberListY[i]*numberListY[i];
  }
  var slope = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
  var intercept = (sumy / n) - (slope * sumx) / n;
  if(returnType==1)
    return new Point(slope,intercept);
  var r2 = Math.pow((n*sumxy - sumx*sumy)/Math.sqrt((n*sumx2-sumx*sumx)*(n*sumy2-sumy*sumy)),2);
  numberListR.push(slope);
  numberListR.push(intercept);
  numberListR.push(r2);
  numberListR.push(n);
  return numberListR;
};

/**
 * Calculates Euclidean distance between two numberLists
 *
 * @param  {NumberList1} numberList NumberList of the same length
 * as numberList2.
 * @param  {NumberList2} numberList NumberList of the same length
 * as numberList1.
 * @return {Number} Summed Euclidean distance between all values.
 * tags:
 */
NumberListOperators.distance = function(numberList1, numberList2) {
  var sum = 0;
  var i;
  var nElements = Math.min(numberList1.length, numberList2.length);
  for(i = 0; i < nElements; i++) {
    sum += Math.pow(numberList1[i] - numberList2[i], 2);
  }
  return Math.sqrt(sum);
};

/**
 * cosine similarity, used to compare two NumberLists regardless of norm (see: http://en.wikipedia.org/wiki/Cosine_similarity)
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 *
 * @param  {Number} norm0 accelerates operations if this values has benn previously calculated
 * @param  {Number} norm1 accelerates operations if this values has benn previously calculated
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.cosineSimilarity = function(numberList0, numberList1, norm0, norm1) {
  norm0 = norm0==null?numberList0.getNorm():norm0;
  norm1 = norm1==null?numberList1.getNorm():norm1;
  var norms = norm0 * norm1;
  if(norms === 0) return 0;
  return NumberListOperators.dotProduct(numberList0, numberList1) / norms;
};

/**
 * calculates the covariance between two numberLists
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.covariance = function(numberList0, numberList1) {
  if(numberList0==null || numberList1==null) return;

  var l = Math.min(numberList0.length, numberList1.length);
  var i;
  var av0 = numberList0.getAverage();
  var av1 = numberList1.getAverage();
  var s = 0;

  for(i = 0; i<l; i++) {
    s += (numberList0[i] - av0)*(numberList1[i] - av1);
  }

  return s/l;
};


/**
 * @todo finish docs, maybe change name
 */
NumberListOperators.standardDeviationBetweenTwoNumberLists = function(numberList0, numberList1) {
  if(numberList0==null || numberList1==null) return;
  var s = 0;
  var l = Math.min(numberList0.length, numberList1.length);
  var i;

  for(i = 0; i < l; i++) {
    s += Math.pow(numberList0[i] - numberList1[i], 2);
  }

  return s/l;
};

/**
 * returns Pearson Product Moment Correlation, the most common correlation coefficient ( covariance/(standard_deviation0*standard_deviation1) )
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 *
 * @param {Number} sd0 standrad deviation of list 0, accelerates opeartion if previously calculated
 * @param {Number} sd1 standrad deviation of list 1, accelerates opeartion if previously calculated
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.pearsonProductMomentCorrelation = function(numberList0, numberList1, sd0, sd1) { //TODO:make more efficient
  if(numberList0==null || numberList1==null) return;
  if(sd0==null) sd0 = numberList0.getStandardDeviation();
  if(sd1==null) sd1 = numberList1.getStandardDeviation();
  
  var stndDeviations = sd0*sd1;//numberList0.getStandardDeviation() * numberList1.getStandardDeviation();
  if(stndDeviations===0) return 0;
  return NumberListOperators.covariance(numberList0, numberList1) / stndDeviations;
};

/**
 * returns a NumberList normalized to the sum, all its values will add up 1 (or optionally provided factor)
 * @param  {NumberList} numberlist NumberList to Normalize.
 *
 * @param {Number} factor optional factor value (values will add up factor)
 * @param {Number} sum provide this value if sum has been previously calculated, it will reduce calculations. If not provided, sum will be calculated automatically.
 * @return {NumberList} new NumberList of values normalized to the sum
 * tags:
 */
NumberListOperators.normalizeToSum = function(numberlist, factor, sum) {
  if(numberlist==null) return;
  
  factor = factor == null ? 1 : factor;
  var newNumberList = new NumberList();
  newNumberList.name = numberlist.name;
  if(numberlist.length === 0) return newNumberList;
  var i;
  sum = sum == null ? numberlist.getSum() : sum;
  if(sum === 0) return numberlist.clone();

  for(i = 0; i < numberlist.length; i++) {
    newNumberList.push(factor * numberlist[i] / sum);
  }
  return newNumberList;
};

/**
 * @param  {NumberList}
 *
 * @param {Number}
 * @param {Number}
 * @return {NumberList}
 * tags:deprecated
 * replaceBy:normalizeToSum
 */
NumberListOperators.normalizedToSum = function(numberlist, factor, sum) {
  return NumberListOperators.normalizeToSum(numberlist, factor, sum);
};


/**
 * Returns a NumberList normalized to min-max interval.
 *
 * @param  {NumberList} numberlist NumberList to Normalize.
 * @param {Number} factor Optional multiplier to modify the normalized values by.
 * Defaults to 1.
 * @return {NumberList}
 * tags:deprecated
 */
NumberListOperators.normalized = function(numberlist, factor) {//@todo: remove
  if(numberlist==null) return;
  return numberlist.getNormalized();
};

/**
 * Returns a NumberList normalized to z-scores (mean of 0, stdev of 1).
 * @param  {NumberList} numberlist NumberList to Normalize.
 * @return {NumberList}
 * tags:statistics
 */
NumberListOperators.normalizeByZScore = function(numberlist) {
  if(numberlist==null) return;
  if(numberlist.length === 0) return null;

  var i;
  var mean = numberlist.getAverage();
  var stddev = numberlist.getStandardDeviation();
  if(stddev===0) stddev=1; // all returned values will be zero

  var newNumberList = new NumberList();
  for(i = 0; i < numberlist.length; i++) {
    newNumberList.push((numberlist[i] - mean) / stddev);
  }
  newNumberList.name = numberlist.name;
  return newNumberList;
};

/**
 * Returns a NumberList normalized to Max.
 * @param  {NumberList} numberlist NumberList to Normalize.
 *
 * @param {Number} factor Optional multiplier to modify the normalized values by. Defaults to 1.
 * @return {NumberList}
 * tags:
 */
NumberListOperators.normalizeToMax = function(numberlist, factor) {
  if(numberlist==null) return;
  
  factor = factor == null ? 1 : factor;

  if(numberlist.length === 0) return null;

  var max = numberlist.getMax();
  if(max === 0) {
    max = numberlist.getMin();
    if(max === 0) return ListGenerators.createListWithSameElement(numberlist.length, 0);
  }
  var newNumberList = new NumberList();
  for(var i = 0; numberlist[i] != null; i++) {
    newNumberList.push(factor * (numberlist[i] / max));
  }
  newNumberList.name = numberlist.name;
  return newNumberList;
};


/**
 * Returns a NumberList normalized to an Interval.
 * @param  {NumberList} numberlist NumberList to Normalize.
 * @param {Interval} interval that defines the range of the new numberList
 * @return {NumberList}
 * tags:
 */
NumberListOperators.normalizeToInterval = function(numberlist, interval) {
  if(numberlist==null || interval==null || numberlist.length === 0) return;

  var i;
  var numberListInterval = numberlist.getInterval();
  var nLAmplitude = numberListInterval.getAmplitude();
  if(nLAmplitude===0) return ListGenerators.createListWithSameElement (numberlist.length, interval.x, numberlist.name);
  var amplitude = interval.getSignedAmplitude();
  var factor = amplitude/nLAmplitude;
  var newNumberList = new NumberList();
  for(i = 0; i < numberlist.length; i++) {
    newNumberList.push( interval.x + factor*(numberlist[i] - numberListInterval.x) );
  }
  newNumberList.name = numberlist.name;
  return newNumberList;
};


/**
 * generates a new numberList of desired size (smaller than original), with elements claculated as averages of neighbors
 * @param  {NumberList} numberList
 * @param  {Number} newLength length of returned numberList
 * @return {NumberList}
 * tags:statistics
 */
NumberListOperators.shorten = function(numberList, newLength) {
  if(numberList==null) return null;
  if(newLength==null || newLength>=numberList.length) return numberList;

  var windowSize = numberList.length/newLength;
  var newNumberList = new NumberList();
  var windowSizeInt = Math.floor(windowSize);
  var val;
  var i, j, j0;

  newNumberList.name = numberList.name;

  for(i=0; i<newLength; i++){
    j0 = Math.floor(i*windowSize);
    val = 0;
    for(j=0; j<windowSizeInt; j++){
      val += numberList[j0+j];
    }
    newNumberList[i] = val/windowSizeInt;
  }
  return newNumberList;
};

/**
 * simplifies a numer list, by keeping the nCategories-1 most common values, and replacing the others with an "other" element
 * this method reduces the number of different values contained in the list, converting it into a categorical list
 * @param  {NumberList} numberList NumberList to shorten
 *
 * @param  {Number} method simplification method:<b>0:significant digits (default)<br>1:quantiles (value will be min value in percentile)<br>2:orders of magnitude
 * @param  {Number} param different meaning according to choosen method:<br>0:number of significant digits<br>1:number of quantiles<br>2:no need of param
 * @return {NumberList} simplified list
 * tags:
 */
NumberListOperators.simplify = function(numberList, method, param) {
  if(numberList==null) return;

  method = method||0;
  param = param||0;

  var newList = new NumberList();
  newList.name = numberList.name;


  switch(method){
    case 0:
      var power = Math.pow(10, param);
      numberList.forEach(function(val){
        newList.push(Math.floor(val/power)*power);
      });
      break;
    case 1:
      //deploy quantiles first (optional return of n percentile, min value, interval, numberTable with indexes, numberTable with values)
      break;
  }

  return newList;
};

/**
 * calculates k-means clusters of values in a numberList
 * @param  {NumberList} numberList
 * @param  {Number} k number of clusters
 *
 * @param {Boolean} returnIndexes return clusters of indexes rather than values (false by default)
 * @return {NumberTable} numberLists each being a cluster
 * tags:ds
 */
NumberListOperators.linearKMeans = function(numberList, k, returnIndexes) {
  if(numberList == null || k == null || (k <= 0)) {
    return null;
  }

  var interval = numberList.getInterval();

  var min = interval.x;
  var max = interval.y;
  var clusters = new NumberTable();
  var i, j;
  var jK;
  var x;
  var dX = (max - min) / k;
  var d;
  var dMin;
  var n;
  var N = 1000;
  var means = new NumberList();
  var nextMeans = new NumberList();
  var nValuesInCluster = new NumberList();
  var length = numberList.length;

  var initdMin = 1 + max - min;

  for(i = 0; i < k; i++) {
    clusters[i] = new NumberList();
    nextMeans[i] = min + (i + 0.5) * dX;
  }

  for(n = 0; n < N; n++) {

    for(i = 0; i < k; i++) {
      nValuesInCluster[i] = 0;
      means[i] = nextMeans[i];
      nextMeans[i] = 0;
    }

    for(i = 0; i<length; i++) {
      x = numberList[i];
      dMin = initdMin;
      jK = 0;

      for(j = 0; j < k; j++) {
        d = Math.abs(x - means[j]);
        if(d < dMin) {
          dMin = d;
          jK = j;
        }
      }
      if(n == N - 1) {
        if(returnIndexes) {
          clusters[jK].push(i);
        } else {
          clusters[jK].push(x);
        }
      }

      nValuesInCluster[jK]++;

      nextMeans[jK] = ((nValuesInCluster[jK] - 1) * nextMeans[jK] + x) / nValuesInCluster[jK];
    }
  }

  return clusters;
};


/**
 * smooth a numberList by calculating averages with neighbors
 * @param  {NumberList} numberList
 *
 * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
 * @param  {Number} nIterations number of ieterations
 * @return {NumberList}
 * tags:statistics
 */
NumberListOperators.averageSmoother = function(numberList, intensity, nIterations) {
  if(numberList==null) return;

  nIterations = nIterations == null ? 1 : nIterations;
  intensity = intensity == null ? 0.1 : intensity;

  intensity = Math.max(Math.min(intensity, 0.5), 0);
  var anti = 1 - 2 * intensity;
  var n = numberList.length - 1;

  var newNumberList = numberList.clone();
  var i;

  var smoothFirst = function(val, i, list){
    list[i] = anti * val + (i > 0 ? (numberList[i - 1] * intensity) : 0) + (i < n ? (numberList[i + 1] * intensity) : 0);
  };

  var smooth = function(val, i, list){
    list[i] = anti * val + (i > 0 ? (list[i - 1] * intensity) : 0) + (i < n ? (list[i + 1] * intensity) : 0);
  };

  for(i = 0; i < nIterations; i++) {
    if(i === 0) {
      newNumberList.forEach(smoothFirst);
    } else {
      newNumberList.forEach(smooth);
    }
  }

  newNumberList.name = numberList.name;

  return newNumberList;
};

/**
 *@todo: finish
 */
NumberListOperators.filterNumberListByInterval = function(numberList, min, max, includeMin, includeMax, returnMode) {
  return null;
};

/**
 * accepted comparison operators: "<", "<=", ">", ">=", "==", "!="
 */
NumberListOperators.filterNumberListByNumber = function(numberList, value, comparisonOperator, returnIndexes) {
  returnIndexes = returnIndexes || false;
  var newNumberList = new NumberList();
  var i;

  if(returnIndexes) {
    switch(comparisonOperator) {
      case "<":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] < value) {
            newNumberList.push(i);
          }
        }
        break;
      case "<=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] <= value) {
            newNumberList.push(i);
          }
        }
        break;
      case ">":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] > value) {
            newNumberList.push(i);
          }
        }
        break;
      case ">=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] >= value) {
            newNumberList.push(i);
          }
        }
        break;
      case "==":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] == value) {
            newNumberList.push(i);
          }
        }
        break;
      case "!=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] != value) {
            newNumberList.push(i);
          }
        }
        break;
    }

  } else {
    switch(comparisonOperator) {
      case "<":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] < value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case "<=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] <= value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case ">":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] > value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case ">=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] >= value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case "==":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] == value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case "!=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] != value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
    }
  }

  return newNumberList;
};


/**
 * builds a rectangle that defines the boundaries of two numberLists interpreted as x and y coordinates
 * @param  {NumberList} numberListX
 * @param  {NumberList} numberListY
 * @return {Rectangle}
 */
NumberListOperators.frameFromTwoNumberLists = function(numberListX, numberListY){
  if(numberListX==null || numberListY==null) return;
  var intX = numberListX.getInterval();
  var intY = numberListY.getInterval();
  return new Rectangle(intX.x, intY.x, intX.getAmplitude(), intY.getAmplitude());
};

/**
 * builds a NumberList that gives histogram counts
 * @param  {NumberList} numberList
 * 
 * @param  {Number} nBins number of bins to use (default 100)
 * @param  {Interval} interval range of values (default use actual range of input numberList)
 * @param {Number} mode return mode<br>0:(default) return the number of numbers on each bin<br>1:return the bin index for each value
 * @return {NumberList}
 * tags:statistics
 */
NumberListOperators.rangeCounts = function(numberList, nBins, interval, mode){
  if(numberList==null) return;
  nBins = nBins == null ? 100 : nBins;
  interval = interval==null ? numberList.getInterval() : interval;
  mode = mode || 0;
  var nLCounts = ListGenerators.createListWithSameElement(nBins,0);
  var f,bin,len=numberList.length;
  var binIndexes = new NumberList();
  for(var i=0;i<len;i++){
    f = interval.getInverseInterpolatedValue(numberList[i]);
    bin = Math.min(Math.floor(f*nBins),nBins-1);
    binIndexes[i] = bin;
    nLCounts[bin]++;
  }
  if(mode==1) return binIndexes;
  return nLCounts;
};

/**
 * builds a NumberTable that gives 2D histogram counts for a pair of NumberLists
 * @param  {NumberList} nL1
 * @param  {NumberList} nL2
 * 
 * @param  {Number} nBins1 number of bins to use for nL1 (default 25)
 * @param  {Number} nBins2 number of bins to use for nL2 (default 25)
 * @param  {Interval} int1 range of values (default use actual range of input nL1)
 * @param  {Interval} int2 range of values (default use actual range of input nL2)
 * @return {NumberTable}
 * tags:statistics
 */
NumberListOperators.rangeCounts2D = function(nL1,nL2,nBins1,nBins2,int1,int2){
  if(nL1==null || nL2==null || nL1.length != nL2.length) return;
  nBins1 = nBins1 == null ? 25 : nBins1;
  nBins2 = nBins2 == null ? 25 : nBins2;
  int1 = int1==null ? nL1.getInterval() : int1;
  int2 = int2==null ? nL2.getInterval() : int2;
  var nT = TableGenerators.createTableWithSameElement(nBins1,nBins2,0);
  var f1,f2,bin1,bin2,len=nL1.length;
  for(var i=0;i<len;i++){
    f1 = int1.getInverseInterpolatedValue(nL1[i]);
    bin1 = Math.max(0,Math.min(Math.floor(f1*nBins1),nBins1-1));
    f2 = int2.getInverseInterpolatedValue(nL2[i]);
    bin2 = Math.max(0,Math.min(Math.floor(f2*nBins2),nBins2-1));
    nT[bin1][bin2]++;
  }
  return nT;
};

/**
 * in case the numberList is sorted, it generates a new one with lower values, by subtracting consecutive numbers
 * @param {NumberList} nl
 *
 * @param {Boolean} compress true (default) for compression, false for decompression
 * @return {NumberList}
 * tags:
 */
NumberListOperators.simpleCompression = function(nl, compress){
  if(nl==null) return null;

  compress = compress==null?true:compress;

  var i;
  var newNl = new NumberList();

  if(nl.length===0) return newNl;

  newNl[0] = nl[0];

  if(compress){
    for(i=1; i<nl.length; i++){
      newNl[i] = nl[i]-nl[i-1]-1;
    }
  } else {
    for(i=1; i<nl.length; i++){
      newNl[i] = newNl[i-1]+nl[i]+1;
    }
  }
  return newNl;
};

/**
 * Get any outliers in the numberList, based on Tukey's test (+- IQR * k)
 * @param {NumberList} nl
 *
 * @param {Number} retMode 0: return outlier values<br>1: return indicies of outliers<br>2: return NumberTable having values in column 0 and indicies in column 1
 * @param {Number} kValue IQR range multiple (default=1.5), larger value limits to more extreme outliers
 * @return {NumberList}
 * tags: statistics
 */
NumberListOperators.getOutliers = function(nl, retMode, kValue){
  if(nl==null) return null;
  if(kValue==null) kValue=1.5;
  if(retMode==null) retMode=0;

  // based on Tukey's test using IQR
  var nLQ=nl.getQuantiles(4);
  var IQR = nLQ[2]-nLQ[0];
  var lower=nLQ[0]-kValue*IQR;
  var upper=nLQ[2]+kValue*IQR;
  if(IQR == 0){
    // doesn't seem to work very well. Use a heuristic based on stDev instead
    var sd = nl.getStandardDeviation();
    lower = nLQ[0] - 2*kValue*sd;
    upper = nLQ[0] + 2*kValue*sd;
  }

  var nt = new NumberTable(2); // 0 are values, 1 are indices
  nt[0].name='Values';
  nt[1].name='Indicies';
  // use _min and _max set inside getQuantiles to shortcut when there are no outliers
  if(nLQ._min < lower || nLQ._max > upper)
    for(var i=0;i<nl.length;i++){
      if(nl[i] < lower || nl[i] > upper){
        nt[0].push(nl[i]);
        nt[1].push(i);
      }
    }
  // sort by size of outliers
  nt = nt.getListsSortedByList(nt[0],false);
  if(retMode == 0)
    return nt[0];
  else if(retMode == 1)
    return nt[1];

  return nt;
};

