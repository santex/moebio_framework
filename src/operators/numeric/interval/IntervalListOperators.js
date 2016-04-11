import List from "src/dataTypes/lists/List";
import Interval from "src/dataTypes/numeric/Interval";
import IntervalList from "src/dataTypes/numeric/IntervalList";

/**
 * @classdesc Provides a set of tools that work with Interval Lists.
 *
 * @namespace
 * @category numbers
 */
function IntervalListOperators() {}
export default IntervalListOperators;


/**
 * @todo write docs
 */
IntervalListOperators.scaleIntervals = function(intervalList, value) {
	if(intervalList==null) return;

	value = value==null?1:value;

  var newIntervalList = new List();
  var l = intervalList.length;
  var i;

  newIntervalList.name = intervalList.name;

  for(i = 0; i<l; i++) {
    newIntervalList[i] = intervalList[i].getScaled(value);
  }

  return newIntervalList;
};


/**
 * returns a IntervalList from two NumberLists
 * @param  {NumberList} numberList0 first numberList
 * @param  {NumberList} numberList1 second numberList
 * @return {IntervalList}
 * tags:
 */
IntervalListOperators.numberListsToIntervalList = function(numberList0, numberList1) {
  if(numberList0==null || numberList1==null) return;

  var l = Math.min(numberList0.length, numberList1.length);
  var i;
  var intervalList = new IntervalList();

  for(i=0; i<l; i++){
    intervalList.push(new Interval(numberList0[i], numberList1[i]));
  }

  return intervalList;
};
