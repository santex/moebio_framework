import List from "src/dataTypes/lists/List";

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
