import ListGenerators from "src/operators/lists/ListGenerators";
import Table from "src/dataTypes/lists/Table";

/**
 * @classdesc Table Generators
 *
 * @namespace
 * @category basics
 */
function TableGenerators() {}
export default TableGenerators;

/**
 * filter a table selecting rows that have particular values in specific lists, all values must match
 * @param  {Number} nLists is the number of lists to create in the table
 * @param  {Number} nRows is the number of rows to insert
 * @param  {Object} element object to be placed in all positions
 *
 * @param {StringList} sLNames optionally gives the names of the lists in the new table
 * @return {Table}
 * tags:generator
 */
TableGenerators.createTableWithSameElement = function(nLists, nRows, element, sLNames) {
  var table = new Table();
  for(var i = 0; i < nLists; i++) {
    table[i] = ListGenerators.createListWithSameElement(nRows, element);
    if(sLNames && sLNames[i])
    	table[i].name = sLNames[i];
  }
  return table.getImproved();
};
