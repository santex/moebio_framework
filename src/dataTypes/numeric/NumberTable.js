import Table from "src/dataTypes/lists/Table";
import NumberList from "src/dataTypes/numeric/NumberList";
import List from "src/dataTypes/lists/List";
import { typeOf } from "src/tools/utils/code/ClassUtils";

NumberTable.prototype = new Table();
NumberTable.prototype.constructor = NumberTable;

/**
 * @classdesc {@link Table} to store numbers.
 *
 * @param [Number|[Number]] args If a single Number, indicates number of
 * columns to make for the NumberTable. Each column is created as an empty
 * NumberList. If an Array, or a set of Arrays, it will make a new NumberList
 * for each array present, populating it with the contents of the array.
 *
 * Additional functions that work on NumberTable can be found in:
 * <ul>
 *  <li>Operators:   {@link NumberTableOperators}</li>
 *  <li>Conversions: {@link NumberTableConversions}</li>
 * </ul>
 *
 * @constructor
 * @description Creates a new NumberTable.
 * @category numbers
 */
function NumberTable() {
  var args = [];
  var newNumberList;
  var array = [];
  var i;

  if (arguments.length == 1 ) {
    var arg0 = arguments[0];
    // one argument as number(n). create a Table with n columns
    if ( typeof arg0 == 'number' ) {
        for (var i=0; i<arg0; i++) {
            array.push([]);
        }
    }
    // one argument as array.
    else if ( Array.isArray(arg0) ) {
        var _array = Array.prototype.slice.call(arg0);
        array = fetchArray(arg0,1);
    }
  }
  // more than one argument
  else if ( arguments.length > 1) {
    var arg = arguments;
    // arguments as numbers will be a NUmberTable with 1 NumberList
    if( typeof arg[0] == 'number' ) {
        var arr=[];
        for (var i=0; i<arg.length; i++) {
            arr.push(arg[i]);
        }
        array.push(arr);
    }
    // arguments other than numbers. the array is cloned and re-evaluated
    else {
        var _array = Array.prototype.slice.call(arguments);
        array = fetchArray( _array, 1);
    }
  }

 function fetchArray(arr, iteration) {
    var _array;

    // check if is a Lichen List or Table
    if ( arr.type !== undefined) {
        _array = arr.clone();
        if ( _array.type == 'NumberTable')
            return _array.toArray();
        else if ( _array.type == 'NumberList')
            return [_array.toArray()];
        else
            return [];
    }
    else { // is a simple array

        //clone the array
        _array = [];
        for ( var i=0; i<arr.length; i++){
            /* if is an array containing other array, fetch it and then pass to _array.
             * here the iteration number (>1) is important to not receive a Table (*1) */
            if( Array.isArray(arr[i]) && arr[i].type === undefined )
                arr[i] = fetchArray( arr[i], ++iteration);
            _array[i] = arr[i];
        }

        if ( _array.length == 0 )
            return []; //empty array
        else if ( _array.length == 1 ) {
            if ( typeof _array[0] == 'number' )
                return [_array]; // an array with just one number as a one element list
            else if ( Array.isArray(_array[0]) )
                return _array; // an array
            else // any other type return empty array
                return [];
        }
        else if ( _array.length > 1 ) {
            // if is the first iteration with an array of numbers, return it as a Table (*1)
            if ( typeof _array[0] == 'number' && iteration == 1 )// {
                return [_array];
            else // otherwise, it returns the array
                return _array;
        }
    }
 }

  array = NumberTable.fromArray(array);
  return array;
}
export default NumberTable;

NumberTable.fromArray = function(array) {
  var result = Table.fromArray(array);
  result.type = "NumberTable";

  result.getSums = NumberTable.prototype.getSums;
  result.getRowsSums = NumberTable.prototype.getRowsSums;
  result.getAverages = NumberTable.prototype.getAverages;
  result.getRowsAverages = NumberTable.prototype.getRowsAverages;
  result.getIntervals = NumberTable.prototype.getIntervals;
  result.factor = NumberTable.prototype.factor;
  result.add = NumberTable.prototype.add;
  result.getMax = NumberTable.prototype.getMax;
  result.getMin = NumberTable.prototype.getMin;
  result.getInterval = NumberTable.prototype.getInterval;
  result.getCovarianceMatrix = NumberTable.prototype.getCovarianceMatrix;

  return result;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getMax = function() {
  if(this.length === 0) return null;

  var max = this[0].getMax();
  var i;

  for(i = 1; this[i] != null; i++) {
    max = Math.max(this[i].getMax(), max);
  }
  return max;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getMin = function() {
  if(this.length === 0) return null;

  var min = this[0].getMin();
  var i;

  for(i = 1; this[i] != null; i++) {
    min = Math.min(this[i].getMin(), min);
  }
  return min;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getInterval = function() {
  if(this.length === 0) return null;
  var rangeInterval = (this[0]).getInterval();
  var n = this.length;
  for(var i = 1; i<n; i++) {
    var newRange = (this[i]).getInterval();
    rangeInterval.x = Math.min(rangeInterval.x, newRange.x);
    rangeInterval.y = Math.max(rangeInterval.y, newRange.y);
  }
  return rangeInterval;
};

/**
 * returns a numberList with values from numberlists added
 * @return {Numberlist}
 * tags:
 */
NumberTable.prototype.getSums = function() {
  var numberList = new NumberList();
  var l = this.length;
  for(var i = 0; i<l; i++) {
    numberList[i] = this[i].getSum();
  }
  return numberList;
};

/**
 * returns a numberList with all values fro rows added
 * @return {NumberList}
 * tags:
 */
NumberTable.prototype.getRowsSums = function() {
  var sums = this[0].clone();
  var numberList;
  for(var i = 1; this[i] != null; i++) {
    numberList = this[i];
    for(var j = 0; numberList[j] != null; j++) {
      sums[j] += numberList[j];
    }
  }
  return sums;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getAverages = function() {
  var numberList = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    numberList[i] = this[i].getAverage();
  }
  return numberList;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getRowsAverages = function() {
  var l = this.length;
  var averages = this[0].clone().factor(1 / l);
  var numberList;
  var i, j;
  var length;
  for(i = 1; i<l; i++) {
    numberList = this[i];
    length = numberList.length;
    for(j = 0; j<length; j++) {
      averages[j] += numberList[j] / l;
    }
  }
  return averages;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getIntervals = function() {
  var l = this.length;
  var numberList;
  var i;
  var intervalList = new List();//TODO: convert into IntervalList once available
  for(i = 0; i<l; i++) {
    numberList = this[i];
    intervalList.push(numberList.getInterval());
  }
  return intervalList;
};


/**
 * @todo write docs
 */
NumberTable.prototype.factor = function(value) {
  var newTable = new NumberTable();
  var i;
  var numberList;
  var l = this.length;

  switch(typeOf(value)) {
    case 'number':
      for(i = 0; i<l; i++) {
        numberList = this[i];
        newTable[i] = numberList.factor(value);
      }
      break;
    case 'NumberList':
      for(i = 0; i<l; i++) {
        numberList = this[i];
        newTable[i] = numberList.factor(value[i]);
      }
      break;

  }

  newTable.name = this.name;
  return newTable;
};

/**
 * @todo write docs
 */
NumberTable.prototype.add = function(value) {
  var newTable = new NumberTable();
  var numberList;
  var i;
  var l = this.length;

  for(i = 0; i<l; i++) {
    numberList = this[i];
    newTable[i] = numberList.add(value);
  }

  newTable.name = this.name;
  return newTable;
};
