import Table from "src/dataTypes/lists/Table";
import IntervalListOperators from "src/operators/numeric/interval/IntervalListOperators";

/**
 * @classdesc Provides a set of tools that work with {@link Table|Tables} of
 * Intervals.
 *
 * @namespace
 * @category numbers
 */
function IntervalTableOperators() {}
export default IntervalTableOperators;

/**
 * @todo write docs
 */
IntervalTableOperators.scaleIntervals = function(intervalTable, value) {
	if(intervalTable==null) return null;

  var newIntervalTable = new Table();

  newIntervalTable.name = intervalTable.name;

  var l = intervalTable.length;
  var i;

  for(i = 0; i<l; i++) {
    newIntervalTable[i] = IntervalListOperators.scaleIntervals(intervalTable[i], value);
  }

  return newIntervalTable;
};
