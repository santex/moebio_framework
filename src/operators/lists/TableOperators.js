import NumberOperators from "src/operators/numeric/NumberOperators";
import { instantiateWithSameType, typeOf, instantiate } from "src/tools/utils/code/ClassUtils";
import List from "src/dataTypes/lists/List";
import Table from "src/dataTypes/lists/Table";
import NumberList from "src/dataTypes/numeric/NumberList";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import StringList from "src/dataTypes/strings/StringList";
import ListOperators from "src/operators/lists/ListOperators";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import ListGenerators from "src/operators/lists/ListGenerators";
import ColorScales from "src/operators/graphic/ColorScales";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import Tree from "src/dataTypes/structures/networks/Tree";
import Node from "src/dataTypes/structures/elements/Node";
import Relation from "src/dataTypes/structures/elements/Relation";
import Network from "src/dataTypes/structures/networks/Network";

import StringOperators from "src/operators/strings/StringOperators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import {
  TYPES_SHORT_NAMES_DICTIONARY,
  getColorFromDataModelType
} from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc Table Operators
 *
 * @namespace
 * @category basics
 */
function TableOperators() {}
export default TableOperators;


/**
 * @todo finish docs
 */
TableOperators.getElementFromTable = function(table, i, j) {//deprecated, replaced by getCell
  if(table[i] == null) return null;
  return table[i][j];
};

/**
 * @todo finish docs
 */
TableOperators.getSubTable = function(table, x, y, width, height) {
  if(table == null) return table;

  var nLists = table.length;
  if(nLists === 0) return null;
  var result = new Table();

  if(width <= 0) width = (nLists - x) + width;
  x = Math.min(x, nLists - 1);
  width = Math.min(width, nLists - x);

  var nRows = table[0].length;

  if(nRows === 0) return null;

  if(height <= 0) height = (nRows - y) + height;

  y = Math.min(y, nRows - 1);
  height = Math.min(height, nRows - y);

  var column;
  var newColumn;
  var i;
  var j;
  var element;
  for(i = x; i < x + width; i++) {
    column = table[i];
    newColumn = new List();
    newColumn.name = table[i].name;
    for(j = y; j < y + height; j++) {
      element = column[j];
      newColumn.push(element);
    }
    result.push(newColumn.getImproved());
  }
  return result.getImproved();
};

/**
 * filter the rows of a table by a criteria defined by an operator applied to all lists or a selected list
 * @param  {Table} table Table
 * @param  {String} operator "=c"(default, exact match for numbers, contains for strings), "==", "<", "<=", ">", ">=", "!=", "contains", "between", "init" Function that returns a boolean
 * @param  {Object} value to compare against
 *
 * @param  {Number|String|List} listToCheck it could be one of the following option:<br>null (default) means it checks every list, a row is kept if at least one its values verify the condition<br>a number, an index of the list to check<br>a string, the name of the list to check<br>a list (with same sizes as the lists in the table) that will be used to check conditions on elements and filter the table.
 * @param  {Object} value2 only used for "between" operator
 * @param  {Boolean} bIgnoreCase for string compares, defaults to true
 * @param  {Boolean} returnIndexes return indexes of rows instead of filtered table (default false)
 * @return {Table}
 * tags:filter
 */
TableOperators.filterTable = function(table, operator, value, listToCheck, value2, bIgnoreCase, returnIndexes){
  // input validation and defaults
  if(table==null || table.length === 0 || table[0]==null) return;
  if(operator === undefined && value === undefined) return table;
  if(operator==null) operator='=c';
  if(operator == '=') operator = '==';
  var nLKeep = new NumberList();
  var nRows = table.getLengths().getMax();
  var r,c,val,val0,bKeep;
  var cStart=0;
  var cEnd=table.length;
  var type = typeOf(value);
  var bExternalList = listToCheck != null && listToCheck.isList === true;

  if(bExternalList && listToCheck.length != nRows){
    throw new Error('selected List (in listToCheck position) must have same length as table');
  }

  if(listToCheck!=null){
    if(typeof listToCheck === 'string') listToCheck=table.getNames().indexOf(listToCheck);
    if(listToCheck==-1) throw new Error('do not find any list with such name');
  }

  if(value==null){
    type = 'Null';
    value = '';
  } else if(type == 'string' && !isNaN(value) && value.trim() !== ''){
    type='number';
    value=Number(value);
  }
  if(operator == '=c'){
    if(type == 'string')
      operator = 'contains';
    else
      operator = '==';
  }
  if(type == 'number' && operator == 'between'){
    if(isNaN(value2))
      operator='noop';
    else {
      value2 = Number(value2);
    }
  }
  if(operator == 'between' && value2 == null)
    operator='noop';
  if(listToCheck != null){
    cStart=listToCheck;
    cEnd=listToCheck+1;
  }
  if(bExternalList){
    cStart=0;
    cEnd=1;
  }

  if(bIgnoreCase == null || (bIgnoreCase !== true && bIgnoreCase !== false) )
    bIgnoreCase = true;
  if(type == 'string' && bIgnoreCase){
    value = value.toLowerCase();
    value2 = value2 ? String(value2).toLowerCase() : value2;
  }
  if(operator == '==' && bIgnoreCase)
    operator = '==i';
  if(operator == '!=' && bIgnoreCase)
    operator = '!=i';
  // row matching, not using RegExp because value can contain control characters

  //console.log("[fT] operator:", operator);
  //console.log("[fT] type:", type);

  switch(operator){
    case "==":
      for(r=0; r<nRows; r++){
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          if(val0 == null) val0 = '';
          if(val0 == value){
            nLKeep.push(r);
            break;
          }
        }
      }
      break;
    case "==i":
      for(r=0; r<nRows; r++){
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          val = val0 == null ? '' : String(val0).toLowerCase();
          if(val == value){
            nLKeep.push(r);
            break;
          }
        }
      }
      break;
    case "!=":
      for(r=0; r<nRows; r++){
        bKeep=true;
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          if(val0 == null) val0 = '';
          if(val0 == value){
            bKeep=false;
            break;
          }
        }
        if(bKeep)
          nLKeep.push(r);
      }
      break;
    case "!=i":
      for(r=0; r<nRows; r++){
        bKeep=true;
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          val = val0 == null ? '' : String(val0).toLowerCase();
          if(val == value){
            bKeep=false;
            break;
          }
        }
        if(bKeep)
          nLKeep.push(r);
      }
      break;
    case "contains":
      for(r=0; r<nRows; r++){
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          val = bIgnoreCase ? String(val0).toLowerCase() : String(val0);
          if(val.indexOf(String(value)) > -1){
            nLKeep.push(r);
            break;
          }
        }
      }
      break;
    case "init":
      for(r=0; r<nRows; r++){
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          val = bIgnoreCase ? String(val0).toLowerCase() : String(val0);
          if(val.indexOf(String(value)) === 0){
            nLKeep.push(r);
            break;
          }
        }
      }
      break;
    case "<":
    case "<=":
      for(r=0; r<nRows; r++){
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          if(type != typeOf(val0)) continue;
          //val = bIgnoreCase ? String(val0).toLowerCase() : String(val0);
          val =  (type == 'string')?( bIgnoreCase ? String(val0).toLowerCase() : String(val0) ):Number(val0);
          if(val < value){
            nLKeep.push(r);
            break;
          }
          else if(val == value && operator == '<='){
            nLKeep.push(r);
            break;
          }
        }
      }
      break;
    case ">":
    case ">=":
      for(r=0; r<nRows; r++){
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          if(type != typeOf(val0)) continue;
          val =  (type == 'string')?( bIgnoreCase ? String(val0).toLowerCase() : String(val0) ):Number(val0);
          if(val > value){
            nLKeep.push(r);
            break;
          }
          else if(val == value && operator == '>='){
            nLKeep.push(r);
            break;
          }
        }
      }
      break;
    case "between":
      for(r=0; r<nRows; r++){
        for(c=cStart; c<cEnd; c++){
          val0 = bExternalList ? listToCheck[r] : table[c][r];
          //if(type != typeOf(val0)) continue;

          //val = bIgnoreCase ? String(val0).toLowerCase() : String(val0);
          val =  (type == 'string')?( bIgnoreCase ? String(val0).toLowerCase() : String(val0) ):Number(val0);

          if(type == 'number')
            val = Number(val);

          if(value <= val && val <= value2){
            nLKeep.push(r);
            break;
          }
        }
      }
      break;
    default:
      if(typeof(operator) == 'function'){
        for(r=0; r<nRows; r++){
          for(c=cStart; c<cEnd; c++){
            if(operator.call(this,table[c][r], value, value2, listToCheck, table, c, r, bIgnoreCase) ){
              nLKeep.push(r);
              break;
            }
          }
        }
      }
  }
  var newTable = new Table();
  newTable.name = table.name;
  var len = table.length;

  if(returnIndexes) return nLKeep;

  for(c=0; c<len; c++){
    newTable.push(table[c].getElements(nLKeep,true)); // need second parm to handle null elements properly
  }
  return newTable.getImproved();
};


/**
 * filters lists on a table, keeping elements that are in the same of row of a certain element of a given list from the table
 * @param  {Table} table Table.
 * @param  {Number} nList index of list containing the element
 * @param  {Object} element used to filter the lists on the table
 * @return {Table}
 * tags:filter
 */
TableOperators.getSubTableByElementOnList = function(table, nList, element){
  if(nList==null || element==null) return;

  var i, j;
  var nLists = table.length;

  if(nList<0) nList = nLists+nList;
  nList = nList%nLists;

  var newTable = instantiateWithSameType(table);
  newTable.name = table.name;

  for(i=0; i<nLists; i++){
    var newList = new List();
    newList.name = table[i].name;
    newTable.push(newList);
  }
  // table.forEach(function(list){
  //   var newList = new List();
  //   newList.name = list.name;
  //   newTable.push(newList);
  // });

  var supervised = table[nList];
  var nSupervised = supervised.length;
  var nElements;

  for(i=0; i<nSupervised; i++){
    if(element==supervised[i]){
      nElements = newTable.length;
       for(j=0; j<nElements; j++){
          newTable[j].push(table[j][i]);
       }
    }
  }

  nLists = newTable.length;

  for(i=0; i<nLists; i++){
    newTable[i] = newTable[i].getImproved();
  }
  // newTable.forEach(function(list, i){
  //   newTable[i] = list.getImproved();
  // });

  return newTable.getImproved();
};

/**
 * filters lists on a table, keeping elements that are in the same of row of certain elements of a given list from the table
 * @param  {Table} table Table.
 * @param  {Number} nList index of list containing the element
 * @param  {List} elements used to filter the lists on the table
 * @return {Table}
 * tags:filter
 */
TableOperators.getSubTableByElementsOnList = function(table, nList, list){
  if(nList==null || list==null) return;

  var i, j;

  if(nList<0) nList = table.length+nList;
  nList = nList%table.length;

  var newTable = instantiateWithSameType(table);
  newTable.name = table.name;

  table.forEach(function(list){
    var newList = new List();
    newList.name = list.name;
    newTable.push(newList);
  });

  var supervised = table[nList];

  var listDictionary = ListOperators.getBooleanDictionaryForList(list);

  for(i=0; supervised[i]!=null; i++){
    if(listDictionary[supervised[i]]){
       for(j=0; newTable[j]!=null; j++){
          newTable[j].push(table[j][i]);
       }
    }
  }

  newTable.forEach(function(list, i){
    newTable[i] = list.getImproved();
  });

  return newTable.getImproved();
};

/**
 * creates a Table by randomly sampling rows from the input table.
 * @param  {Table} input table
 *
 * @param  {Number} f fraction of rows to randomly select [0,1] (Default is .5)
 * @param  {Boolean} avoidRepetitions (Default is true)
 * @return {Table}
 * tags:filter,sampling
 */
TableOperators.getRandomRows = function(table, f, avoidRepetitions) {
  if(table==null) return null;
  avoidRepetitions = avoidRepetitions == null ? true : avoidRepetitions;
  if(table == null || table[0] == null) return null;
  if(f == null) f=0.5;
  if(f < 0 || f > 1) return null;
  var nRows = table[0].length;
  var n=Math.round(f*nRows);
  var listIndexes = NumberListGenerators.createSortedNumberList(nRows, 0, 1);
  listIndexes = listIndexes.getRandomElements(n, avoidRepetitions);
  listIndexes = listIndexes.getSorted();
  return table.getSubListsByIndexes(listIndexes);
};

/**
 * transposes a table
 * @param  {Table} table to be transposed
 *
 * @param {Boolean} firstListAsHeaders removes first list of the table and uses it as names for the lists on the transposed table (default=false)
 * @param {Boolean} headersAsFirstList adds a new first list made from the headers of original table (default=false)
 * @return {Table}
 * tags:
 */
TableOperators.transpose = function(table, firstListAsHeaders, headersAsFirstList) {
  if(table == null) return null;
  return table.getTransposed(firstListAsHeaders, headersAsFirstList);
};


/**
 * replaces null values present in any of the lists of the table, and using different criteria for lists with nulls and numbers, and lists with nulls and other objects (typically strings)
 * @param {Table} table to be transformed
 * @param {Object} elementToBeRemoved
 * @param {Object} elementToBePlaced
 * @return {Table}
 * tags:
 */
TableOperators.replaceElementInTable = function(table, elementToBeRemoved, elementToBePlaced){
  if(table==null || elementToBeRemoved==null ||elementToBePlaced==null) return;

  var nLists = table.length;
  var l;
  var i, j;
  var list, newList;

  var newTable = new Table();

  for(i=0; i<nLists; i++){
    list = table[i];
    l = list.length;
    newList = new List();
    newTable[i] = newList;
    for(j=0; j<l; j++){
      newList[j] = list[j]==elementToBeRemoved?elementToBePlaced:list[j];
    }
    newList = newList.getImproved();
    newList.name = list.name;
  }

  return newTable.getImproved();

};



/**
 * replaces null values present in any of the lists of the table, and using different criteria for lists with nulls and numbers, and lists with nulls and other objects (typically strings)
 * @param {Table} table to be transformed
 * @param {Number} modeForNumbers when finding a null, or a sequence of nulls, between two numbers<br>0:replace by provided number<br>1:by previous non-null element<br>2:by next non-null element<br>3:average (if all non-null elements are numbers)<br>4:local average, average of previous and next non-null values (if numbers)<br>5:interpolate numbers (if all non-null elements are numbers)
 * @param {Number} modeForNotnumbers when finding a null, or a sequence of nulls, between two strings<br>0:replace by provided element<br>1:by previous non-null element<br>2:by next non-null element
 *
 * @param {Object} number to be used to replace nulls in lists with nulls and numbers
 * @param {Object} element to be used to replace nulls in list with nulls and other non-numerical elements
 * @return {Table}
 * tags:
 */
TableOperators.replaceNullsInTable = function(table, modeForNumbers, modeForNotnumbers, number, element){
  if(table==null || modeForNumbers==null || modeForNotnumbers==null) return;

  var nLists = table.length;
  var l;
  var i, j;
  var list, newList;
  var notNumeric;
  var containsNull;

  var newTable = new Table();

  for(i=0; i<nLists; i++){
    list = table[i];
    l = list.length;
    notNumeric = false;
    containsNull = false;
    for(j=0; j<l; j++){
      if(list[j]==null){
        containsNull=true;
      } else if(typeof list[j] != "number"){
        notNumeric = true;
        if(containsNull) break;
      }
    }

    if(containsNull){
      if(notNumeric){
        newList = ListOperators.replaceNullsInList(list, modeForNotnumbers, element);
      } else {
        newList = ListOperators.replaceNullsInList(list, modeForNumbers, number);
      }
      newTable[i] = newList;
    } else {
      newTable[i] = list;
    }

  }

  return newTable.getImproved();

};


/**
 * divides the instances of a table in two tables: the training table and the test table
 * @param  {Table} table
 * @param  {Number} proportion proportion of training instances/test instances, between 0 and 1
 *
 * @param  {Number} mode  0:random<br>1:random with seed<br>2:shuffle
 * @param {Number} seed seed for random numbers (mode 1)
 * @return {List} list containing the two tables
 * tags:ds
 */
TableOperators.trainingTestPartition = function(table, proportion, mode, seed) {
  if(table == null || proportion == null) return;

  mode = mode || 0;
  seed = seed || 0;

  var n_mod = 0;

  var indexesTr = new NumberList();
  var indexesTe = new NumberList();

  var random = mode == 1 ? new NumberOperators._Alea("my", seed, "seeds") : Math.random;

  if(mode == 2) {
    n_mod = Math.floor(proportion / (1 - proportion) * 10);
  }

  table[0].forEach(function(id, i) {
    if(mode === 0 ||  mode === 1) {
      if(random() < proportion) {
        indexesTr.push(i);
      } else {
        indexesTe.push(i);
      }
    } else {
      if(i % n_mod !== 0) {
        indexesTr.push(i);
      } else {
        indexesTe.push(i);
      }
    }
  });

  return new List(table.getSubListsByIndexes(indexesTr), table.getSubListsByIndexes(indexesTe));
};

/**
 * tests a model
 * @param  {NumberTable} numberTable coordinates of points
 * @param  {List} classes list of values of classes
 * @param  {Function} model function that receives two numbers and returns a guessed class
 *
 * @param  {Number} metric 0:error
 * @return {Number} metric value
 * tags:ds
 */
TableOperators.testClassificationModel = function(numberTable, classes, model, metric) {
  if(numberTable == null || classes == null || model == null) return null;

  metric = metric || 0;

  var nErrors = 0;

  classes.forEach(function(clss, i) {
    if(model(numberTable[0][i], numberTable[1][i]) != clss) {
      nErrors++;
    }
  });

  return nErrors / classes.length;
};



/**
 * @todo finish docs
 */
TableOperators.getSubListsByIndexes = function(table, indexes) {
  var newTable = new Table();
  newTable.name = table.name;
  var list;
  var newList;
  for(var i = 0; table[i] != null; i++) {
    list = table[i];
    newList = instantiateWithSameType(list);
    newList.name = list.name;
    for(var j = 0; indexes[j] != null; j++) {
      newList[j] = list[indexes[j]];
    }
    newTable[i] = newList.getImproved();
  }
  return newTable;
};

// old version replaced by above version Dec 1st, 2014
// - fixed bug where descending with 'false' value gets changed to 'true'
// - performance improvements for tables with lots of lists
// TableOperators.sortListsByNumberList=function(table, numberList, descending){
//  descending = descending || true;
/**
 * @todo finish docs
 */
TableOperators.sortListsByNumberList = function(table, numberList, descending) {
  if(descending == null) descending = true;

  var newTable = instantiate(typeOf(table));
  newTable.name = table.name;
  var nElements = table.length;
  var i;
  // only need to do the sort once, not for each column
  var indexList = numberList.clone();
  // save original index
  for(i = 0; i < indexList.length; i++) {
    indexList[i] = i;
  }
  indexList = ListOperators.sortListByNumberList(indexList, numberList, descending);
  // now clone and then move from original based on index
  for(i = 0; i < nElements; i++) {
    newTable[i] = table[i].clone();
    for(var j = 0; j < indexList.length; j++) {
      newTable[i][j] = table[i][indexList[j]];
    }
  }
  return newTable;
};


/**
 * aggregates lists from a table, using one or several of the lists of the table as the aggregation lists, and based on different aggregation modes for each list to aggregate
 * @param  {Table} table containing the aggregation list and lists to be aggregated
 * @param  {Number|NumberList} indexAggregationList index (Number) or indexes (NumberList) of the aggregation lists on the table
 * @param  {NumberList} indexesListsToAggregate indexes of the lists to be aggregated; typically it also contains the index of the aggregation list at the beginning (or indexes of several lists), to be aggregated using mode 0 (first element) thus resulting as the list of non repeated elements
 * @param  {NumberList} modes list of modes of aggregation, these are the options:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes<br>12:count non repeated elements<br>13:enlist non repeated elements<br>14:concat elements (for strings, uses ', ' as separator)<br>15:concat non-repeated elements<br>16:frequencies tables<br>17:concat (for strings, no separator)
 *
 * @param {StringList} newListsNames optional names for generated lists
 * @return {Table} aggregated table
 * tags:
 */
TableOperators.aggregateTable = function(table, indexAggregationList, indexesListsToAggregate, modes, newListsNames){

  indexAggregationList = indexAggregationList||0;

  if(table==null || !table.length ||  table.length<indexAggregationList || indexesListsToAggregate==null || !indexesListsToAggregate.length || modes==null) return;


  if(indexAggregationList["length"]!=null){

    if(indexAggregationList.length==0){
      indexAggregationList = indexAggregationList[0];
    } else {//multiple aggregation
      var toAggregate = table.getElements(indexAggregationList);
      var typesToAggregate = toAggregate.getTypes();
      console.log('typesToAggregate', typesToAggregate);
      var text;
      var j;
      var textsList = new StringList();
      var JOIN_CHARS = "*__*";
      l = toAggregate[0].length;
      for(i=0; i<l; i++){
        text = toAggregate[0][i];
        for(j=1; j<toAggregate.length; j++){
          text+=JOIN_CHARS+toAggregate[j][i];
        }
        textsList[i] = text;
      }

      //---> fix this
      newTable = new Table.fromArray( [textsList].concat(table.getElements(indexesListsToAggregate.getWithoutElements(indexAggregationList))) );

      var newIndexesListsToAggregate = new NumberList();
      var newModes = new NumberList();
      newIndexesListsToAggregate[0] = 0;
      newModes[0] = 0;
      for(i=indexAggregationList.length; i<indexesListsToAggregate.length; i++){
        newIndexesListsToAggregate.push(i-indexAggregationList.length+1);
        newModes.push(modes[i]);
      }

      newTable = TableOperators.aggregateTable(newTable, 0, newIndexesListsToAggregate, newModes, newListsNames);

      var aggregationTable = new Table();
      var parts;

      for(j=0; j<indexAggregationList.length; j++){
          aggregationTable[j] = instantiate(typesToAggregate[j]);
      }

      l = newTable[0].length;
      
      for(i=0; i<l; i++){
        text = newTable[0][i];
        parts = text.split(JOIN_CHARS);
        for(j=0; j<indexAggregationList.length; j++){

          aggregationTable[j][i] = typesToAggregate[j]=="NumberList"?Number(parts[j]):parts[j];
          
        }
      }
      
      return Table.fromArray(aggregationTable.concat(newTable.getSubList(1))).getImproved();
    }
  }



  var aggregatorList = table[indexAggregationList];
  var indexesTable = ListOperators.getIndexesTable(aggregatorList);
  var newTable = new Table();
  var newList;
  var toAggregateList;
  var i, index;
  var l = indexesListsToAggregate.length;

  //indexesListsToAggregate.forEach(function(index, i){
  for(i=0; i<l; i++){
    index = indexesListsToAggregate[i];
    toAggregateList = table[index];
    newList = ListOperators.aggregateList(aggregatorList, toAggregateList, i<modes.length?modes[i]:1, indexesTable)[1];
    if(newListsNames && i<newListsNames.length){
      newList.name = newListsNames[i];
    } else {
      newList.name = toAggregateList.name;
    }
    newTable.push(newList);
  }
  //});

  return newTable.getImproved();
};



/**
 * builds a pivot table
 * @param  {table} table
 * @param  {Number} indexFirstAggregationList index of first list
 * @param  {Number} indexSecondAggregationList index of second list
 * @param  {Number} indexListToAggregate index of list to be aggregated
 * @param  {Number} aggregationMode aggregation mode:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>------not yet deployed:<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes
 * @param {Object} nullValue value for null cases in non-numerical aggregation
 *
 * @param  {Number} resultMode result mode:<br>0:classic pivot, a table of aggregations with first aggregation list elements without repetitions in the first list, and second aggregation elements as headers of the aggregation lists<br>1:two lists for combinations of first aggregated list and second aggregated list, and a third list for aggregated values(default)
 * @return {Table}
 * tags:
 */
TableOperators.pivotTable = function(table, indexFirstAggregationList, indexSecondAggregationList, indexListToAggregate, aggregationMode, nullValue, resultMode){
  if(table==null || !table.length || indexFirstAggregationList==null || indexSecondAggregationList==null || indexListToAggregate==null || aggregationMode==null) return;

  resultMode = resultMode||0;
  nullValue = nullValue==null?"":nullValue;

  var element1;
  var coordinate, indexes;
  var listToAggregate = table[indexListToAggregate];

  var newTable = new Table();
  var sum;
  var i;

  if(resultMode==1){//two lists of elements and a list of aggregation value
    var indexesDictionary = {};
    var elementsDictionary = {};

    table[indexFirstAggregationList].forEach(function(element0, i){//@todo: imporve this
      element1 = table[indexSecondAggregationList][i];
      coordinate = String(element0)+"∞"+String(element1);
      if(indexesDictionary[coordinate]==null){
        indexesDictionary[coordinate]=new NumberList();
        elementsDictionary[coordinate]=new List();
      }
      indexesDictionary[coordinate].push(i);
      elementsDictionary[coordinate].push(listToAggregate[i]);
    });

    newTable[0] = new List();
    newTable[1] = new List();
    switch(aggregationMode){
      case 0://first element
        newTable[2] = new List();
        break;
      case 1://count
      case 2://sum
      case 3://average
        newTable[2] = new NumberList();
        break;
    }


    for(coordinate in indexesDictionary) {
      indexes = indexesDictionary[coordinate];
      newTable[0].push(table[indexFirstAggregationList][indexes[0]]);
      newTable[1].push(table[indexSecondAggregationList][indexes[0]]);

      switch(aggregationMode){
        case 0://first element
          newTable[2].push(listToAggregate[indexes[0]]);
          break;
        case 1://count
          newTable[2].push(indexes.length);
          break;
        case 2://sum
        case 3://average
          sum = 0;
          indexes.forEach(function(index){
            sum+=listToAggregate[index];
          });
          if(aggregationMode==3) sum/=indexes.length;
          newTable[2].push(sum);
          break;
      }
    }

    newTable[0] = newTable[0].getImproved();
    newTable[1] = newTable[1].getImproved();

    switch(aggregationMode){
      case 0://first element
        newTable[2] = newTable[2].getImproved();
        break;
    }

    return newTable;
  }


  ////////////////////////resultMode==0, a table whose first list is the first aggregation list, and each i+i list is the aggregations with elements for the second aggregation list

  newTable[0] = new List();

  var elementsPositions0 = {};
  var elementsPositions1 = {};

  var x, y;
  var element;
  var newList;

  table[indexFirstAggregationList].forEach(function(element0, i){
    element1 = table[indexSecondAggregationList][i];
    element = listToAggregate[i];

    y = elementsPositions0[String(element0)];
    if(y==null){
      newTable[0].push(element0);
      y = newTable[0].length-1;
      elementsPositions0[String(element0)] = y;
    }

    x = elementsPositions1[String(element1)];
    if(x==null){
      switch(aggregationMode){
        case 0:
          newList = new List();
          break;
        case 1:
        case 2:
        case 3:
          newList = new NumberList();
          break;
      }
      newTable.push(newList);
      newList.name = String(element1);
      x = newTable.length-1;
      elementsPositions1[String(element1)] = x;
    }

    switch(aggregationMode){
      case 0://first element
        if(newTable[x][y]==null) newTable[x][y]=element;
        break;
      case 1://count
        if(newTable[x][y]==null) newTable[x][y]=0;
        newTable[x][y]++;
        break;
      case 2://sum
        if(newTable[x][y]==null) newTable[x][y]=0;
        newTable[x][y]+=element;
        break;
      case 3://average
        if(newTable[x][y]==null) newTable[x][y]=[0,0];
        newTable[x][y][0]+=element;
        newTable[x][y][1]++;
        break;
    }

  });

  switch(aggregationMode){
    case 0://first element
      for(i=1; i<newTable.length; i++){
        if(newTable[i]==null) newTable[i]=new List();

        newTable[0].forEach(function(val, j){
          if(newTable[i][j]==null) newTable[i][j]=nullValue;
        });

        newTable[i] = newTable[i].getImproved();
      }
      break;
    case 1://count
    case 2://sum
      for(i=1; i<newTable.length; i++){
        if(newTable[i]==null) newTable[i]=new NumberList();
        newTable[0].forEach(function(val, j){
          if(newTable[i][j]==null) newTable[i][j]=0;
        });
      }
      break;
    case 3://average
      for(i=1; i<newTable.length; i++){
        if(newTable[i]==null) newTable[i]=new NumberList();
        newTable[0].forEach(function(val, j){
          if(newTable[i][j]==null){
            newTable[i][j]=0;
          } else {
            newTable[i][j]=newTable[i][j][0]/newTable[i][j][1];
          }
        });
      }
      break;
  }

  return newTable;
};

/**
 * counts pairs of elements in same positions in two lists (the result is the adjacent matrix of the network defined by pairs)
 * @param  {Table} table with at least two lists
 * @return {NumberTable}
 * tags:
 */
TableOperators.getCountPairsMatrix = function(table) {
  if(table == null || table.length < 2 || table[0] == null || table[0][0] == null) return null;

  var list0 = table[0].getWithoutRepetitions();
  var list1 = table[1].getWithoutRepetitions();

  var matrix = new NumberTable(list1.length);

  list1.forEach(function(element1, i) {
    matrix[i].name = String(element1);
    list0.forEach(function(element0, j) {
      matrix[i][j] = 0;
    });
  });

  table[0].forEach(function(element0, i) {
    var element1 = table[1][i];
    matrix[list1.indexOf(element1)][list0.indexOf(element0)]++;
  });

  return matrix;
};


/**
 * filter a table selecting rows that have an element on one of its lists
 * @param  {Table} table
 * @param  {Number} nList list that could contain the element in several positions
 * @param  {Object} element
 *
 * @param {Boolean} keepRowIfElementIsPresent if true (default value) the row is selected if the list contains the given element, if false the row is discarded
 * @return {Table}
 * tags:filter
 */
TableOperators.filterTableByElementInList = function(table, nList, element, keepRowIfElementIsPresent) {
  if(table == null ||  table.length <= 0 || nList == null) return;
  if(element == null) return table;

  keepRowIfElementIsPresent = keepRowIfElementIsPresent==null?true:keepRowIfElementIsPresent;


  var newTable = new Table();
  var i, j;
  var l = table.length;
  var l0 = table[0].length;

  newTable.name = table.name;

  for(j = 0; j<l; j++) {
    newTable[j] = new List();
    newTable[j].name = table[j].name;
  }

  if(keepRowIfElementIsPresent){
    for(i = 0; i<l0; i++) {
      if(table[nList][i] == element) {
        for(j = 0; j<l; j++) {
          newTable[j].push(table[j][i]);
        }
      }
    }
  } else {
    for(i = 0; i<l0; i++) {
      if(table[nList][i] != element) {
        for(j = 0; j<l; j++) {
          newTable[j].push(table[j][i]);
        }
      }
    }
  }

  for(j = 0; j<l; j++) {
    newTable[j] = newTable[j].getImproved();
  }

  return newTable;
};

/**
 * filter a table selecting rows that have one of the elements provided on one of its lists
 * @param  {Table} table
 * @param  {Number} nList list that could contain some of the elements in several positions
 * @param  {List} elements
 *
 * @param {Boolean} keepRowIfElementIsPresent if true (default value) the row is selected if the list contains the given element, if false the row is discarded
 * @return {Table}
 * tags:filter
 */
TableOperators.filterTableByElementsInList = function(table, nList, elements, keepRowIfElementIsPresent) {
  if(table == null ||  table.length <= 0 || nList == null) return;
  if(elements == null || elements.length===0) return table;

  keepRowIfElementIsPresent = keepRowIfElementIsPresent==null?true:keepRowIfElementIsPresent;

  var elementsDictionary = ListOperators.getBooleanDictionaryForList(elements);

  var newTable = new Table();
  var i, j;
  var l = table.length;
  var l0 = table[0].length;

  newTable.name = table.name;

  for(j = 0; j<l; j++) {
    newTable[j] = new List();
    newTable[j].name = table[j].name;
  }

  if(keepRowIfElementIsPresent){
    for(i = 0; i<l0; i++) {
      if(elementsDictionary[ table[nList][i] ]) {
        for(j = 0; j<l; j++) {
          newTable[j].push(table[j][i]);
        }
      }
    }
  } else {
    for(i = 0; i<l0; i++) {
      if(!elementsDictionary[ table[nList][i] ]) {
        for(j = 0; j<l; j++) {
          newTable[j].push(table[j][i]);
        }
      }
    }
  }

  for(j = 0; j<l; j++) {
    newTable[j] = newTable[j].getImproved();
  }

  return newTable;
};

/**
 * filter a table selecting rows that have particular values in specific lists, all values must match
 * @param  {Table} table
 * @param  {NumberList} lists is the set of list indexes to test for matching values
 * @param  {List} values are the set of values to test for. If only 1 list is tested and there are multiple values then any of those values are accepted.
 *
 * @param {Boolean} keepMatchingRows if true (default value) the rows are kept if all the lists match the given values, if false matching rows are discarded
 * @return {Table}
 * tags:filter
 */
TableOperators.selectRows = function(table, lists, values, keepMatchingRows) {
  if(table == null ||  table.length <= 0) return;
  keepMatchingRows = keepMatchingRows==null?true:keepMatchingRows;
  if(lists == null || values == null || lists.length == undefined) return keepMatchingRows ? table : null;
  if(lists.length != values.length && lists.length != 1) return;

  var nLMatch = new NumberList();
  var nRows = table[0].length;
  var bOrValues = lists.length == 1 && values.length > 1;

  for(var r=0; r < nRows; r++){
    var bMatch = true;
    for(var c=0; c < lists.length && bMatch; c++){
      if(isNaN(lists[c]) || lists[c] < 0 || lists[c] >= table.length)
        return; // invalid input
      if(table[lists[c]][r] != values[c]){
        bMatch = false;
        if(bOrValues){
          for(var cv=1; cv < values.length; cv++){
            if(table[lists[c]][r] == values[cv]){
              bMatch = true;
              break;
            }
          }
        }
      }
    }
    if(bMatch)
      nLMatch.push(r);
  }

  var newTable;
  if(keepMatchingRows)
    newTable = table.getRows(nLMatch);
  else
    newTable = table.getWithoutRows(nLMatch);

  return newTable;
};

/**
 * builds the vector of values from a data table and the complete list of categories
 * @param {Table} dataTable with categories and values
 * @param {List} allCategories complete list of categories
 *
 * @param {Object} allCategoriesIndexesDictionary optional dictionary of indexes if pre-calculated
 * @return {NumberList} values for each category from complete categorical list
 * tags:
 */
TableOperators.numberListFromDataTable = function(dataTable, allCategories, allCategoriesIndexesDictionary){
  if(dataTable==null || allCategories==null) return;

  var i;
  var l = dataTable[0].length;

  allCategoriesIndexesDictionary = allCategoriesIndexesDictionary==null?ListOperators.getSingleIndexDictionaryForList(allCategories):allCategoriesIndexesDictionary; 

  var nL = ListGenerators.createListWithSameElement(allCategories.length, 0); 
  var index;

  for(i=0; i<l; i++){
    index = allCategoriesIndexesDictionary[dataTable[0][i]];
    if(index!=null) nL[index] = dataTable[1][i];
  }

  return nL;
};

/**
 * creates a new table that combines rows from two tables that have a variable in common (equivalent to SQL join)
 * @param {Table} table0 first table to be joined (aka left table in SQL naming)
 * @param {Table} table1 second table to be joined (aka right table in SQL naming)
 *
 * @param {Number|String} keyIndex0 index (Number) or name (String) of list in table0 (called first key list) that is also represented by another list (same variable) in table1 (default:0)
 * @param {Number|String} keyIndex1 index (Number) or name (String) of list in table1 (called second key list) that is also represented by another list (same variable) in table0 (default:0)
 * @param {Number} mode mode of join <br>0:inner (default), will keep the values that are common to key lists, and complete the table<br>1:left, will keep all the values first key list, add values from second key list that are also in first key list, and then complete the table
 * @return {Table}
 * tags:
 */
TableOperators.joinTwoTables = function(table0, table1, keyIndex0, keyIndex1, mode){
  if(table0==null || table1==null) return;

  var joinTabe = new Table();
  var list0, list1;

  keyIndex0 = keyIndex0==null?0:keyIndex0;
  keyIndex1 = keyIndex1==null?0:keyIndex1;
  mode = mode==null?0:mode;

  //receives indexes or lists names
  if(typeof keyIndex0 == "string"){
    list0 = table0.getElement(keyIndex0);
    if(list0==null) throw Error("the table doesn't contain a list with name "+keyIndex0);
    keyIndex0 = table0.indexOf(list0);
  } else {
    if(keyIndex0<0) keyIndex0+=table0.length;
    keyIndex0 = keyIndex0%table0.length;
    list0 = table0[keyIndex0];
  }
  if(typeof keyIndex1 == "string"){
    list1 = table1.getElement(keyIndex1);
    if(list1==null) throw Error("the table doesn't contain a list with name "+keyIndex1);
    keyIndex1 = table1.indexOf(list1);
  } else {
    if(keyIndex1<0) keyIndex1+=table1.length;
    keyIndex1 = keyIndex1%table1.length;
    list1 = table1[keyIndex1];
  }

  var dictionary1 = ListOperators.getIndexesDictionary(list1);

  var n0 = table0.length;
  var n1 = table1.length;

  var l0 = list0.length;

  var val0;
  var indexes1;

  var i, j, k;
  var list;

  //prepares de table
  var joinList = new List();
  joinList.name = list0.name;
  joinTabe[0] = joinList;

  for(k=0; k<n0; k++){
    if(k!=keyIndex0){
      list = new List();
      list.name = table0[k].name;
      list._list0=true;
      list._listOnTable = table0[k];
      joinTabe.push(list);
    }
  }
  for(k=0; k<n1; k++){
    if(k!=keyIndex1){
      list = new List();
      list.name = table1[k].name;
      list._list0=false;
      list._listOnTable = table1[k];
      joinTabe.push(list);
    }
  }

  //this is where the actual join happens
  for(i=0; i<l0; i++){
    val0 = list0[i];
    indexes1 = dictionary1[val0];
    if(indexes1!=null){
      for(j=0; j<indexes1.length; j++){
        joinList.push(val0);
        for(k=1; k<joinTabe.length; k++){
           joinTabe[k].push(  joinTabe[k]._list0?joinTabe[k]._listOnTable[i]:joinTabe[k]._listOnTable[indexes1[j]] );
        }
      }
    } else if(mode==1){//left join
      joinList.push(val0);
      for(k=1; k<joinTabe.length; k++){
         joinTabe[k].push(  joinTabe[k]._list0?joinTabe[k]._listOnTable[i]:null );
      }
    }
  }

  return joinTabe.getImproved();
};


/**
 * creates a new table that combines rows from multiple tables that have a variable in common, this operator performs a sequence of joinTwoTables
 * @param {List} listOfTables list of tables to be joined
 * @param {NumberList|StringList} listOfIndexes indexes (NumberList) or names (StringList) of variables that are present in all tables
 *
 * @param {Number} mode mode of join <br>0:inner (default )<br>1:left
 * @return {Table}
 * tags:
 */
TableOperators.joinMultipleTables = function(listOfTables, listOfIndexes, mode){
  if(listOfTables==null || listOfIndexes==null) return;

  if(listOfTables.length<2) throw new Error("listOfTables must have at least two tables");
  if(listOfIndexes.length!=listOfTables.length) throw new Error("listOfIndexes must have same length as listOfTables");
  if(listOfTables[0]==null) throw new Error("listOfTables[0] is null");
  if(listOfTables[1]==null) throw new Error("listOfTables[1] is null");

  var joinTable = TableOperators.joinTwoTables(listOfTables[0], listOfTables[1], listOfIndexes[0], listOfIndexes[1], mode);
  var i;
  var l = listOfTables.length;

  for(i=2; i<l; i++){
    joinTable = TableOperators.joinTwoTables(joinTable, listOfTables[i], 0, listOfIndexes[i], mode);
  }

  return joinTable;
};




/**
 * creates a new table with an updated first categorical List of elements and  added new numberLists with the new values
 * @param {Table} table0 table with a list of elements and a numberList of numbers associated to elements
 * @param {Table} table1 wit a list of elements and a numberList of numbers associated to elements
 * @return {Table}
 * tags:
 */
TableOperators.mergeDataTables = function(table0, table1) {
  if(table0==null || table1==null || table0.length<2 || table1.length<2) return;
  
  if(table1[0].length === 0) {
    var merged = table0.clone();
    merged.push(ListGenerators.createListWithSameElement(table0[0].length, 0));
    return merged;
  }

  var categories0 = table0[0];
  var categories1 = table1[0];

  var dictionaryIndexesCategories0 = ListOperators.getSingleIndexDictionaryForList(categories0);
  var dictionaryIndexesCategories1 = ListOperators.getSingleIndexDictionaryForList(categories1);

  var table = new Table();
  var list = ListOperators.concatWithoutRepetitions(categories0, categories1);

  var nElements = list.length;

  var nNumbers0 = table0.length - 1;
  var nNumbers1 = table1.length - 1;

  var numberTable0 = new NumberTable();
  var numberTable1 = new NumberTable();

  var index;

  var i, j;

  for(i = 0; i < nElements; i++) {
    //index = categories0.indexOf(list[i]);//@todo: imporve efficiency by creating dictionary
    index = dictionaryIndexesCategories0[list[i]];
    if(index > -1) {
      for(j = 0; j < nNumbers0; j++) {
        if(i === 0) {
          numberTable0[j] = new NumberList();
          numberTable0[j].name = table0[j + 1].name;
        }
        numberTable0[j][i] = table0[j + 1][index];
      }
    } else {
      for(j = 0; j < nNumbers0; j++) {
        if(i === 0) {
          numberTable0[j] = new NumberList();
          numberTable0[j].name = table0[j + 1].name;
        }
        numberTable0[j][i] = 0;
      }
    }

    //index = categories1.indexOf(list[i]);
    index = dictionaryIndexesCategories1[list[i]];
    if(index > -1) {
      for(j = 0; j < nNumbers1; j++) {
        if(i === 0) {
          numberTable1[j] = new NumberList();
          numberTable1[j].name = table1[j + 1].name;
        }
        numberTable1[j][i] = table1[j + 1][index];
      }
    } else {
      for(j = 0; j < nNumbers1; j++) {
        if(i === 0) {
          numberTable1[j] = new NumberList();
          numberTable1[j].name = table1[j + 1].name;
        }
        numberTable1[j][i] = 0;
      }
    }
  }

  table[0] = list;

  var l = numberTable0.length;

  for(i = 0; i<l; i++) {
    table.push(numberTable0[i]);
  }

  l = numberTable1.length;

  for(i = 0; i<l; i++) {
    table.push(numberTable1[i]);
  }
  return table;
};

/**
 * creates a new table with an updated first categorical List of elements and  added new numberLists with the new values from all data tables
 * @param {List} tableList list of data tables to merge
 *
 * @param {Boolean} categoriesAsColumns if true (default) returns a numberTable with a NumberList per category, if false return a data table with firt list containing all categories
 * @return {Table} numberTable fo categories weights, or data table with categories on first list, and merged values in n numberLists
 * tags:
 */
TableOperators.mergeDataTablesList = function(tableList, categoriesAsColumns) {//@todo: improve performance
  if(tableList==null || tableList.length < 2) return tableList;

  categoriesAsColumns = categoriesAsColumns==null?true:categoriesAsColumns;

  //var categories = new List();
  var categoriesIndexes = {};
  var numberTable = new NumberTable();
  var i, j, index;
  var i0, k, nCategories;
  var table;
  var n = tableList.length;
  var l;

  if(categoriesAsColumns){

    for(i = 0; i<n; i++) {
      table = tableList[i];
      l = table[0].length;
      for(j=0; j<l; j++){
        index = categoriesIndexes[ table[0][j] ];
        if(index==null){
          index = numberTable.length;
          //categories[index] = table[0][j];
          if(categoriesAsColumns) numberTable[index] = ListGenerators.createListWithSameElement(n, 0, table[0][j]);
          numberTable[index].name = table[0][j];
          categoriesIndexes[ nCategories ] = index;
        }
        numberTable[index][i] += table[1][j];
      }
    }

  } else {
    nCategories = 0;

    for(i = 0; i<n; i++) {
      table = tableList[i];

      l = table[0].length;
      numberTable[i] = new NumberList();
      numberTable.name = table.name;

      for(j=0; j<l; j++){
        index = categoriesIndexes[ table[0][j] ];
        if(index==null){
          index = nCategories;
          //categories[index] = table[0][j];
          if(categoriesAsColumns) numberTable[index] = ListGenerators.createListWithSameElement(n, 0, table[0][j]);

          categoriesIndexes[ table[0][j] ] = index;

          nCategories++;
        }

        
        
        if(numberTable[i][index]==null){
          i0 = numberTable[i].length;
          for(k=i0; k<index; k++){
            numberTable[i][k]=0;
          }
          numberTable[i][index] = table[1][j];
        } else {
          numberTable[i][index] += table[1][j];
        }
      }
    }

    for(i = 0; i<n; i++) {
      i0=numberTable[i].length;
      for(j=i0; j<=nCategories; j++){
        numberTable[i][j] = 0;
      }
    }


  }

  return numberTable;
};

/**
 * From two DataTables creates a new DataTable with combined elements in the first List, and added values in the second
 * @param {Object} table0
 * @param {Object} table1
 * @return {Table}
 */
TableOperators.sumDataTables = function(table0, table1) {//
  var table = table0.clone();
  var index;
  var element;
  for(var i = 0; table1[0][i] != null; i++) {
    element = table1[0][i];
    index = table[0].indexOf(element);//@todo make more efficient with dictionary
    if(index == -1) {
      table[0].push(element);
      table[1].push(table1[1][i]);
    } else {
      table[1][index] += table1[1][i];
    }
  }
  return table;
};

/**
 * calcualtes the sum of products of numbers associated with same elements
 * @param  {Table} table0 dataTable with categories and numbers
 * @param  {Table} table1 dataTable with categories and numbers
 * @return {Number}
 * tags:statistics
 */
TableOperators.dotProductDataTables = function(table0, table1) {
  if(table0==null || table1==null || table0.length<2 || table1.length<2) return null;

  var i, j;
  var l0 = table0[0].length;
  var l1 = table1[0].length;
  var product = 0;
  var element, element1;
  for(i=0; i<l0; i++){
    element = table0[0][i];
    for(j=0; j<l1; j++){
      element1 = table1[0][j];
      if(element==element1) product+=table0[1][i]*table1[1][j];
    }
  }
  
  return product;
};


/**
 * calcualtes the cosine similarity based on TableOperators.dotProductDataTables
 * @param  {Table} table0 dataTable with categories and numbers
 * @param  {Table} table1 dataTable with categories and numbers
 *
 * @param {Number} norm0 optionally pre-calculated norm of table0[1]
 * @param {Number} norm1 optionally pre-calculated norm of table1[1]
 * @return {Number}
 * tags:statistics
 */
TableOperators.cosineSimilarityDataTables = function(table0, table1, norm0, norm1) {
  if(table0==null || table1==null || table0.length<2 || table1.length<2) return null;

  if(table0[0].length===0 || table1[0].length===0) return 0;

  norm0 = norm0==null?table0[1].getNorm():norm0;
  norm1 = norm1==null?table1[1].getNorm():norm1;

  var norms = norm0*norm1;
  if(norms === 0) return 0;
  return TableOperators.dotProductDataTables(table0, table1)/norms;
};

/**
 * @todo finish docs
 */
TableOperators.completeTable = function(table, nRows, value) {
  value = value === undefined ? 0 : value;

  var newTable = new Table();
  newTable.name = table.name;

  var list;
  var newList;
  var j;

  for(var i = 0; i < table.length; i++) {
    list = table[i];
    newList = list == null ? ListOperators.getNewListForObjectType(value) : instantiateWithSameType(list);
    newList.name = list == null ? '' : list.name;
    for(j = 0; j < nRows; j++) {
      newList[j] = (list == null || list[j] == null) ? value : list[j];
    }
    newTable[i] = newList;
  }
  return newTable;
};

/**
 * filters a Table keeping the NumberLists
 * @param  {Table} table to filter<
 * @return {NumberTable}
 * tags:filter
 */
TableOperators.getNumberTableFromTable = function(table) {
  if(table == null ||  table.length <= 0) {
    return null;
  }

  var i;
  var newTable = new NumberTable();
  newTable.name = table.name;
  for(i = 0; table[i] != null; i++) {
    if(table[i].type == "NumberList") newTable.push(table[i]);
  }
  return newTable;
};

/**
 * calculates de information gain of all variables in a table and a supervised variable
 * @param  {Table} variablesTable
 * @param  {List} supervised
 * @return {NumberList}
 * tags:ds
 */
TableOperators.getVariablesInformationGain = function(variablesTable, supervised) {
  if(variablesTable == null) return null;

  var igs = new NumberList();
  variablesTable.forEach(function(feature) {
    igs.push(ListOperators.getInformationGain(feature, supervised));
  });
  return igs;
};

/**
 * @todo finish docs
 */
TableOperators.splitTableByCategoricList = function(table, list) {
  if(table == null || list == null) return null;

  var childrenTable;
  var tablesList = new List();
  var childrenObject = {};

  list.forEach(function(element, i) {
    childrenTable = childrenObject[element];
    if(childrenTable == null) {
      childrenTable = new Table();
      childrenObject[element] = childrenTable;
      tablesList.push(childrenTable);
      table.forEach(function(list, j) {
        childrenTable[j] = instantiateWithSameType(list);
        childrenTable[j].name = list.name;
      });
      childrenTable._element = element;
    }
    table.forEach(function(list, j) {
      childrenTable[j].push(table[j][i]);
    });
  });

  return tablesList;
};



/**
 * builds a network from columns or rows, taking into account similarity in numbers (correlation) and other elements (Jaccard) (adds i property to nodes, position of list or row)
 * @param  {Table} table
 *
 * @param  {Boolean} nodesAreRows if true (default value) each node corresponds to a row in the table, and rows are compared, if false lists are compared ([!] working only for NumberTable, using pearson correlation)
 * @param  {StringList|Number} names optionally add names to nodes with a list that could be part of the table or not; receives a StringList for names, or an index (Number) for a list in the providade table
 * @param {List|Number} colorsByList optionally add color to nodes from a NumberList (for scale), any List (for categorical colors) that could be part of the table or not; receives a List or an index if the list is in the providade table
 * @param {Number} correlationThreshold 0.3 by default, above that level a relation is created
 * @param  {Boolean} negativeCorrelation takes into account negative correlations for building relations
 * @param {Number} numericMode numeric correlation mode<br>0:Pearson correlation (default)<br>1:cosine similarity
 * @return {Network}
 * tags:
 */
TableOperators.buildCorrelationsNetwork = function(table, nodesAreRows, names, colorsByList, correlationThreshold, negativeCorrelation, numericMode){
  if(table==null) return null;

  nodesAreRows = nodesAreRows==null?true:Boolean(nodesAreRows);
  correlationThreshold = correlationThreshold==null?0.3:correlationThreshold;
  negativeCorrelation = Boolean(negativeCorrelation);
  numericMode = numericMode==null?0:numericMode;

  //var types = table.getTypes();
  var i, j;
  var l = table.length;
  var nRows = table[0].length;
  var node, node1, relation;
  var id, name;
  var pearson, jaccard, weight;
  var colorsList, colors;

  var someCategorical = false;
  var someText = false;
  var someNumeric = false;

  var network = new Network();


  var pseudoKinds = new StringList(); //numbers, categories and texts; similar to kind
  var type;

  for(i=0; i<l;i++){
    type = table[i].type;
    if(type == "NumberList"){
      pseudoKinds[i] = 'numbers';
    } else if(type == 'StringList'){
      if(table[i].getWithoutRepetitions().length/table[i].length>0.8){
        pseudoKinds[i] = 'texts';
      } else {
        pseudoKinds[i] = 'categories';
      }
    } else {
      pseudoKinds[i] = 'categories';
    }
  }


  if(colorsByList!=null){

    if(typeOf(colorsByList)=="number"){
      if(colorsByList<=l){
        colorsList = table[colorsByList];
      }
    } else if(colorsByList["isList"]){
      if(colorsByList.length>=l) colorsList = colorsByList;
    }

    if(colorsList!=null){
      if(colorsList.type === "NumberList"){
        colors = ColorListGenerators.createColorListFromNumberList(colorsList, ColorScales.blueToRed, 0);// ColorListOperators.colorListFromColorScaleFunctionAndNumberList(ColorScales.blueToRed, colorsList, true);
      } else {
        colors = ColorListGenerators.createCategoricalColorListForList(colorsList)[0].value; //@todo [!] this method will soon change
      }
    }
  }
  

  if(names!=null && typeOf(names)=="number" && names<l) names = table[names];

  if(!nodesAreRows){ //why not just take transposed table?????
    
    if(table.type=="NumberTable"){//correlations network, for the time being
      

      for(i=0; i<l; i++){
        node = new Node("list_"+i, (table[i].name==null || table[i].name=="")?"list_"+i:table[i].name);
        network.addNode(node);
        node.i = i;
        node.numbers = table[i];

        if(colors) node.color = colors[i];
      }

      for(i=0; i<l; i++){
        node = network.nodeList[i];
        for(j=i+1; j<l; j++){
          node1 = network.nodeList[j];
          pearson = NumberListOperators.pearsonProductMomentCorrelation(node.numbers, node1.numbers);
          weight = pearson;
          if( (negativeCorrelation && Math.abs(weight)>correlationThreshold) || (!negativeCorrelation && weight>correlationThreshold) ){
            id = i+"_"+j;
            name = node.name+"_"+node1.name;
            relation = new Relation(id, name, node, node1, Math.abs(weight)-correlationThreshold*0.9);
            relation.color = weight>0?'blue':'red';
            relation.pearson = pearson;
            network.addRelation(relation);
          }
        }
      }
    } else {
      //any table
    }

  } else {
    for(i=0; i<nRows; i++){
      id = "_"+i;
      name = names==null?id:names[i];
      node = new Node(id, name);
      node.i = i;
      
      node.row = table.getRow(i);
      node.numbers = new NumberList();
      node.categories = new List();
      node.texts = new StringList();

      if(colors) node.color = colors[i];

      for(j=0; j<l; j++){
        //types[j]==="NumberList"?node.numbers.push(node.row[j]):node.categories.push(node.row[j]);
        switch(pseudoKinds[j]){
          case 'numbers':
            node.numbers.push(node.row[j]);
            someNumeric = true;
            break;
          case 'categories':
            node.categories.push(node.row[j]);
            someCategorical = true;
            break;
          case 'texts':
            node.texts.push(node.row[j]);
            someText = true;
            break;
        }
      }

      if(numericMode===0){
        node.numbers.sd = node.numbers.getStandardDeviation();
      } else {
        node.numbers.norm = node.numbers.getNorm();
      }

      network.addNode(node);
    }

    for(i=0; i<nRows-1; i++){
      node = network.nodeList[i];
      for(j=i+1; j<nRows; j++){
        node1 = network.nodeList[j];

        pearson = someNumeric?
          (numericMode===0?
            NumberListOperators.pearsonProductMomentCorrelation(node.numbers, node1.numbers, node.numbers.sd, node1.numbers.sd)
            :
            NumberListOperators.cosineSimilarity(node.numbers, node1.numbers, node.numbers.norm, node1.numbers.norm)
          )
          :
          0;

        //jaccard is normalized to -1, 1 so it can be negative 
        jaccard = someCategorical?Math.pow( ListOperators.jaccardIndex(node.categories, node1.categories), 0.2 )*2 - 1 : 0;


        //console.log("•••••••", pearson, jaccard);

        //texts

        //textDistance =  someText?… cosine simlairty based on pre-calculated words tables


        //dates, geo coordinates…


        weight = (pearson + jaccard)*0.5;

        if( (negativeCorrelation && Math.abs(weight)>correlationThreshold) || (!negativeCorrelation && weight>correlationThreshold) ){
          id = i+"_"+j;
          name = names==null?id:node.name+"_"+node1.name;
          relation = new Relation(id, name, node, node1, Math.abs(weight)-correlationThreshold*0.9);
          relation.color = weight>0?'blue':'red';
          relation.pearson = pearson;
          relation.jaccard = jaccard;
          network.addRelation(relation);
        }

      }

    }
  }

  return network;
};


/**
 * builds a decision tree based on a table made of categorical lists, a list (the values of a supervised variable), and a value from the supervised variable. The result is a tree that contains on its leaves different populations obtained by iterative filterings by category values, and that contain extremes probabilities for having or not the valu ein the supervised variable.
 * [!] this method only works with categorical lists (in case you have lists with numbers, find a way to simplify by ranges or powers)
 * @param  {Table} variablesTable predictors table
 * @param  {Object} supervised variable: list, or index (number) in the table (in which case the list will be removed from the predictors table)
 * @param {Object} supervisedValue main value in supervised list (associated with blue)
 *
 * @param {Number} min_entropy minimum value of entropy on nodes (0.2 default)
 * @param {Number} min_size_node minimum population size associated with node (10 default)
 * @param {Number} min_info_gain minimum information gain by splitting by best feature (0.002 default)
 * @param {Boolean} generatePattern generates a pattern of points picturing proprtion of followed class in node
 * @param {ColorScale} colorScale to assign color associated to probability (default: blueToRed)
 * @return {Tree} tree with aditional information on its nodes, including: probablity, color, entropy, weight, lift
 * tags:ds
 */
TableOperators.buildDecisionTree = function(variablesTable, supervised, supervisedValue, min_entropy, min_size_node, min_info_gain, generatePattern, colorScale){
  if(variablesTable == null ||  supervised == null || supervisedValue == null) return;

  if(colorScale==null) colorScale = ColorScales.blueWhiteRed;

  if(typeOf(supervised)=='number'){
    var newTable = variablesTable.getWithoutElementAtIndex(supervised);
    supervised = variablesTable.getElement(supervised);
    variablesTable = newTable;
  }

  min_entropy = min_entropy == null ? 0.2 : min_entropy;
  min_size_node = min_size_node || 10;
  min_info_gain = min_info_gain || 0.002;

  var indexes = NumberListGenerators.createSortedNumberList(supervised.length);
  var tree = new Tree();

  TableOperators._buildDecisionTreeNode(tree, variablesTable, supervised, 0, min_entropy, min_size_node, min_info_gain, null, null, supervisedValue, indexes, generatePattern, colorScale);

  return tree;
};


/**
 * @ignore
 */
TableOperators._buildDecisionTreeNode = function(tree, variablesTable, supervised, level, min_entropy, min_size_node, min_info_gain, parent, value, supervisedValue, indexes, generatePattern, colorScale) {
  if(level < 4) console.log('\n_buildDecisionTreeNode | supervised.name, supervisedValue', supervised.name, supervisedValue);

  var entropy = ListOperators.getListEntropy(supervised, supervisedValue);

  if(level < 4) console.log('entropy, min_entropy', entropy, min_entropy);
  
  var maxIg = 0;
  var iBestFeature = 0;
  var informationGains = 0;

  if(entropy >= min_entropy) {
    informationGains = TableOperators.getVariablesInformationGain(variablesTable, supervised);
    informationGains.forEach(function(ig, i){
      if(ig > maxIg) {
        maxIg = ig;
        iBestFeature = i;
      }
    });
  }

  if(level < 4) console.log('informationGains:', informationGains);
  if(level < 4) console.log('maxIg, min_info_gain:', maxIg, min_info_gain);
  if(level < 4) console.log('supervised.length, min_size_node:', supervised.length, min_size_node);
  if(level < 4) console.log('iBestFeature:', iBestFeature);
  if(level < 4) console.log('best feature:', variablesTable[iBestFeature].name);


  var subDivide = entropy >= min_entropy && maxIg > min_info_gain && supervised.length >= min_size_node;

  if(level < 4) console.log('subDivide:', subDivide);

  var id = tree.nodeList.getNewId();
  var name = (value == null ? '' : value + ':') + (subDivide ? variablesTable[iBestFeature].name : 'P=' + supervised._biggestProbability + '(' + supervised._mostRepresentedValue + ')');
  var node = new Node(id, name);

  tree.addNodeToTree(node, parent);

  if(parent == null) {
    tree.informationGainTable = new Table();
    tree.informationGainTable[0] = variablesTable.getNames();
    if(informationGains) {
      tree.informationGainTable[1] = informationGains.clone();
      tree.informationGainTable = tree.informationGainTable.getListsSortedByList(informationGains, false);
    }
  }

  node.entropy = entropy;
  node.weight = supervised.length;
  node.supervised = supervised;
  node.indexes = indexes;
  node.value = value;
  node.mostRepresentedValue = supervised._mostRepresentedValue;
  node.biggestProbability = supervised._biggestProbability;
  node.valueFollowingProbability = supervised._P_valueFollowing;
  node.lift = node.valueFollowingProbability / tree.nodeList[0].valueFollowingProbability; //Math.log(node.valueFollowingProbability/tree.nodeList[0].valueFollowingProbability)/Math.log(2);

  // if(level < 4) {
  //   console.log('supervisedValue', supervisedValue);
  //   console.log('supervised.countElement(supervisedValue)', supervised.countElement(supervisedValue));
  //   console.log('value', value);
  //   console.log('name', name);
  //   console.log('supervised.name', supervised.name);
  //   console.log('supervised.length', supervised.length);
  //   console.log('supervised._biggestProbability, supervised._P_valueFollowing', supervised._biggestProbability, supervised._P_valueFollowing);
  //   console.log('node.valueFollowingProbability (=supervised._P_valueFollowing):', node.valueFollowingProbability);
  //   console.log('tree.nodeList[0].valueFollowingProbability', tree.nodeList[0].valueFollowingProbability);
  //   console.log('node.biggestProbability (=_biggestProbability):', node.biggestProbability);
  //   console.log('node.mostRepresentedValue:', node.mostRepresentedValue);
  //   console.log('node.mostRepresentedValue==supervisedValue', node.mostRepresentedValue == supervisedValue);
  // }

  node._color = colorScale(1-node.valueFollowingProbability); //TableOperators._decisionTreeColorScale(1 - node.valueFollowingProbability, colorScale);

  if(generatePattern) {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = 150;
    newCanvas.height = 100;
    var newContext = newCanvas.getContext("2d");
    newContext.clearRect(0, 0, 150, 100);

    TableOperators._decisionTreeGenerateColorsMixture(newContext, 150, 100, ['blue', 'red'],
			node.mostRepresentedValue==supervisedValue?
				[Math.floor(node.biggestProbability*node.weight), Math.floor((1-node.biggestProbability)*node.weight)]
				:
				[Math.floor((1-node.biggestProbability)*node.weight), Math.floor(node.biggestProbability*node.weight)]
    );

    var img = new Image();
    img.src = newCanvas.toDataURL();
    node.pattern = newContext.createPattern(img, "repeat");
  }


  if(!subDivide){
    return node;
  }

  node.bestFeatureName = variablesTable[iBestFeature].name;
  node.bestFeatureName = node.bestFeatureName === "" ? "list "+ iBestFeature:node.bestFeatureName;
  node.iBestFeature = iBestFeature;
  node.informationGain = maxIg;

  var expanded = variablesTable.concat([supervised, indexes]);

  var tables = TableOperators.splitTableByCategoricList(expanded, variablesTable[iBestFeature]);
  var childTable;
  var childSupervised;
  var childIndexes;

  tables.forEach(function(expandedChild) {
    childTable = expandedChild.getSubList(0, expandedChild.length - 3);
    childSupervised = expandedChild[expandedChild.length - 2];
    childIndexes = expandedChild[expandedChild.length - 1];
    TableOperators._buildDecisionTreeNode(tree, childTable, childSupervised, level + 1, min_entropy, min_size_node, min_info_gain, node, expandedChild._element, supervisedValue, childIndexes, generatePattern, colorScale);
  });

  node.toNodeList = node.toNodeList.getSortedByProperty('valueFollowingProbability', false);

  return node;
};


/**
 * @ignore
 */
TableOperators._decisionTreeGenerateColorsMixture = function(ctxt, width, height, colors, weights){
  var x, y, i; //, rgb;
  var allColors = ListGenerators.createListWithSameElement(weights[0], colors[0]);

  for(i = 1; colors[i] != null; i++) {
    allColors = allColors.concat(ListGenerators.createListWithSameElement(weights[i], colors[i]));
  }

  for(x = 0; x < width; x++) {
    for(y = 0; y < height; y++) {
      i = (x + y * width) * 4;
      ctxt.fillStyle = allColors.getRandomElement();
      ctxt.fillRect(x, y, 1, 1);
    }
  }
};

/**
 * return true if all lists from table have same length, false otherwise
 * @param  {Table} table
 * @return {Boolean}
 */
TableOperators.allListsSameLength = function(table){
  if(table==null) return null;

  var l = table.length;
  var length = table[0].length;
  var i;
  for(i=1; i<l; i++){
    if(table[i].length!=length) return false;
  }

  return true;
};

/**
 * returns a Table with lists without repeated elements
 * @param  {Table} table
 * @return {NumberList}
 * tags:
 */
TableOperators.getListsWithoutRepetition = function(table){
  if(table==null) return;

  var l = table.length;
  var i;
  var newTable = new Table();

  for(i=0; i<l; i++){
    newTable[i] = table[i].getWithoutRepetitions();
  }

  return newTable.getImproved();
};

/**
 * returns a numberList with the number of different elements in each list
 * @param  {Table} table
 * @return {NumberList}
 * tags:
 */
TableOperators.getNumberOfDifferentElementsOfLists = function(table){
  if(table==null) return;

  var l = table.length;
  var i;
  var nList = new NumberList();

  for(i=0; i<l; i++){
    nList[i] = table[i].getWithoutRepetitions().length;
  }

  return nList;
};

/**
 * builds an object with statistical information about the table  (infoObject property will be added to table and to lists)
 * @param  {Table} table
 * @return {Object}
 */
TableOperators.buildInformationObject = function(table){
  if(table==null) return;

  var n = table.length;
  var i, listInfoObject;
  var min = 999999999999;
  var max = -999999999999;
  var average = 0;
  var intsAndCats = true;

  var infoObject = {
    type:table.type,
    name:table.name,
    length:n,
    kind:'mixed', //mixed, numbers, integer numbers, texts, categories, integers and categories
    allListsSameLength:true,
    allListsSameSize:true,
    allListsSameType:true,
    allListsSameKind:true,
    listsInfoObjects:new List(),
    names:new StringList(),
    lengths:new NumberList(),
    types:new StringList(),
    kinds:new StringList()
  };


  for(i=0; i<n; i++){
    listInfoObject = ListOperators.buildInformationObject(table[i]);
    infoObject.listsInfoObjects[i] = listInfoObject;

    infoObject.names[i] = listInfoObject.name;
    infoObject.types[i] = listInfoObject.type;
    infoObject.kinds[i] = listInfoObject.kind;
    infoObject.lengths[i] = listInfoObject.length;

    if(listInfoObject.kind!='categories' && listInfoObject.kind!='integer numbers') intsAndCats = false;

    if(i>0){
      if(infoObject.lengths[i]!=infoObject.lengths[i-1]) infoObject.allListsSameLength = false;
      if(infoObject.types[i]!=infoObject.types[i-1]) infoObject.allListsSameType = false;
      if(infoObject.kinds[i]!=infoObject.kinds[i-1]) infoObject.allListsSameKind = false;
      if(infoObject.lengths[i]!=infoObject.lengths[i-1]) infoObject.allListsSameType = false;
    }

    if(listInfoObject.type == "NumberList"){
      min = Math.min(min, listInfoObject.min);
      max = Math.min(max, listInfoObject.max);
      average+=listInfoObject.average;
    }
  }

  if(average!==0) average/=infoObject.length;

  if(infoObject.allListsSameLength){
    infoObject.minLength = infoObject.lengths[0];
    infoObject.maxLength = infoObject.lengths[0];
    infoObject.averageLength = infoObject.lengths[0];
  } else {
    var interval = infoObject.lengths.getInterval();
    infoObject.minLength = interval.x;
    infoObject.maxLength = interval.y;
    infoObject.averageLength = (interval.x + interval.y)*0.5;
  }

  if(infoObject.allListsSameKind){
    switch(infoObject.kinds[0]){
      case 'numbers':
        infoObject.kind = 'numbers';
        break;
      case 'integer numbers':
        infoObject.kind = 'integer numbers';
        break;
      case 'texts':
        infoObject.kind = 'texts';
        break;
      case 'categories':
        infoObject.kind = 'categories';
        break;
    }
  } else {
    if(intsAndCats){
      infoObject.kind = 'integers and categories';
    } else if(infoObject.allListsSameType && infoObject.types[0]=='NumberList'){
      infoObject.kind = 'numbers';
    }
  }

  table.infoObject = infoObject;

  console.log('infoObject:', infoObject);
  console.log('infoObject.type:', infoObject.type);

  return infoObject;

};


/**
 * Generates a string containing details about the current state
 * of the Table. Useful for outputing to the console for debugging.
 * @param {Table} table Table to generate report on.
 * @param {Number} level If greater then zero, will indent to that number of spaces.
 * @return {String} Description String.
 */
TableOperators.getReport = function(table, level) {
  if(table==null) return null;

  var n = table.length;
  var i;
  var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
  var lengths = table.getLengths();
  var minLength = lengths.getMin();
  var maxLength = lengths.getMax();
  var averageLength = (minLength + maxLength) * 0.5;
  var sameLengths = minLength == maxLength;

  var text = level > 0 ? (ident + "////report of instance of Table////") : "///////////report of instance of Table//////////";

  if(table.length === 0) {
    text += ident + "this table has no lists";
    return text;
  }

  text += ident + "name: " + table.name;
  text += ident + "type: " + table.type;
  text += ident + "number of lists: " + table.length;

  text += ident + "all lists have same length: " + (sameLengths ? "true" : "false");

  if(sameLengths) {
    text += ident + "lists length: " + table[0].length;
  } else {
    text += ident + "min length: " + minLength;
    text += ident + "max length: " + maxLength;
    text += ident + "average length: " + averageLength;
    text += ident + "all lengths: " + lengths.join(", ");
  }

  var names = table.getNames();
  var types = table.getTypes();

  text += ident + "--";
  //names.forEach(function(name, i){
  for(i=0; i<n; i++){
    text += ident + i + ": " + names[i] + " ["+TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"]";
  }

  text += ident + "--";

  var sameTypes = types.allElementsEqual();
  if(sameTypes) {
    text += ident + "types of all lists: " + types[0];
  } else {
    text += ident + "types: " + types.join(", ");
  }
  text += ident + "names: " + names.join(", ");

  if(table.length < 101) {
    text += ident + ident + "--------lists reports---------";

    for(i = 0; i<n; i++) {
      text += "\n" + ident + ("(" + (i) + "/0-" + (table.length - 1) + ")");
      try{
         text += ListOperators.getReport(table[i], 1);
      } catch(err){
        text += ident + "[!] something wrong with list " + err;
      }
    }
  }

  if(table.length == 2) {
    text += ident + ident + "--------lists comparisons---------";
    if(table[0].type=="NumberList" && table[1].type=="NumberList"){
      text += ident + "covariance:" + NumberListOperators.covariance(table[0], table[1]);
      text += ident + "Pearson product moment correlation: " + NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]);
    } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
      var nUnion = ListOperators.union(table[0], table[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(table[0], table[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(table[0]._freqTable[0].length == nUnion && table[1]._freqTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(table[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(table[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

    switch(subCategoryCase){
      case 0:
        text += ident + "no categorical relation found between lists";
        break;
      case 1:
        text += ident + "[!] both lists are categorical identical";
        break;
      case 2:
        text += ident + "[!] first list is subcategorical to second list";
        break;
      case 3:
        text += ident + "[!] second list is subcategorical to first list";
        break;
    }

    if(subCategoryCase!=1){
      text += ident + "information gain when segmenting first list by the second: "+ListOperators.getInformationGain(table[0], table[1]);
      text += ident + "information gain when segmenting second list by the first: "+ListOperators.getInformationGain(table[1], table[0]);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};

/**
 * Generates a string containing details about the current state
 * of the Table. Useful for outputing to the console for debugging.
 * @param {Table} table Table to generate report on.
 * @param {Number} level If greater then zero, will indent to that number of spaces.
 * @return {String} Description String.
 */
TableOperators.getReportHtml = function(table,level) {
  if(table==null) return;

  var infoObject = TableOperators.buildInformationObject(table);

  var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
  //var lengths = infoObject.lengths();
  //var minLength = lengths.getMin();
  //var maxLength = lengths.getMax();
  //var averageLength = (infoObject.minLength + infoObject.maxLength) * 0.5;
  //var sameLengths = infoObject.;

  var text = "<b>" +( level > 0 ? (ident + "<font style=\"font-size:16px\">table report</f>") : "<font style=\"font-size:18px\">table report</f>" ) + "</b>";

  if(table.length === 0) {
    text += ident + "this table has no lists";
    return text;
  }

  if(table.name){
    text += ident + "name: <b>" + table.name + "</b>";
  } else {
    text += ident + "<i>no name</i>";
  }
  text += ident + "type: <b>" + table.type + "</b>";
  text += ident + "kind: <b>" + infoObject.kind + "</b>";
  text += ident + "number of lists: <b>" + table.length + "</b>";

  //text += ident + "all lists have same length: <b>" + (infoObject.sameLengths ? "true" : "false") + "</b>";

  if(infoObject.allListsSameLength) {
    text += ident + "all lists have length: <b>" + table[0].length + "</b>";
  } else {
    text += ident + "min length: <b>" + infoObject.minLength + "</b>";
    text += ident + "max length: <b>" + infoObject.maxLength + "</b>";
    text += ident + "average length: <b>" + infoObject.averageLength + "</b>";
    text += ident + "all lengths: <b>" + infoObject.lengths.join(", ") + "</b>";
  }

  text += "<hr>";
  infoObject.names.forEach(function(name, i){
    text += ident + "<font style=\"font-size:10px\">" +i + ":</f><b>" + name + "</b> <font color=\""+getColorFromDataModelType(infoObject.types[i])+ "\">" + TYPES_SHORT_NAMES_DICTIONARY[infoObject.types[i]]+"</f>";
  });
  text += "<hr>";

  if(infoObject.allListsSameType) {
    text += ident + "types of all lists: " + "<b>" + infoObject.types[0] + "</b>";
  } else {
    text += ident + "types: ";
    infoObject.types.forEach(function(type, i){
      text += "<b><font color=\""+getColorFromDataModelType(type)+ "\">" + type+"</f></b>";
      if(i<infoObject.types.length-1) text += ", ";
    });
  }

  if(infoObject.allListsSameKind) {
    text += ident + "<br>kinds of all lists: " + "<b>" + infoObject.kinds[0] + "</b>";
  } else {
    text += ident + "<br>kinds: ";
    infoObject.kinds.forEach(function(kind, i){
      text += "<b>"+kind+"</b>";
      if(i<infoObject.kinds.length-1) text += ", ";
    });
  }


  text += "<br>" + ident + "names: <b>" + infoObject.names.join("</b>, <b>") + "</b>";


  //list by list

  if(table.length < 501) {
    text += "<hr>";
    text +=  ident + "<font style=\"font-size:16px\"><b>lists reports</b></f>";

    var i;
    for(i = 0; table[i] != null; i++) {
      text += "<br>" + ident + i + ": " + (table[i].name?"<b>"+table[i].name+"</b>":"<i>no name</i>");
      try{
         text += ListOperators.getReportHtml(table[i], 1, infoObject.listsInfoObjects[i]);
      } catch(err){
        text += ident + "[!] something wrong with list <font style=\"font-size:10px\">:" + err + "</f>";
        console.log('getReportHtml err', err);
      }
    }
  }

  if(table.length == 2) {//TODO:finish
    text += "<hr>";
    text += ident + "<b>lists comparisons</b>";
    if(table[0].type=="NumberList" && table[1].type=="NumberList"){
      text += ident + "covariance:" + NumberOperators.numberToString(NumberListOperators.covariance(table[0], table[1]), 4);
      text += ident + "Pearson product moment correlation: " + NumberOperators.numberToString(NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]), 4);
    } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
      var nUnion = ListOperators.union(table[0], table[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(table[0], table[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(infoObject.listsInfoObjects[0].frequenciesTable[0].length == nUnion && infoObject.listsInfoObjects[1].frequenciesTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(infoObject.listsInfoObjects[0].frequenciesTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(infoObject.listsInfoObjects[1].frequenciesTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

    switch(subCategoryCase){
      case 0:
        text += ident + "no categorical relation found between lists";
        break;
      case 1:
        text += ident + "[!] both lists are categorical identical";
        break;
      case 2:
        text += ident + "[!] first list is subcategorical to second list";
        break;
      case 3:
        text += ident + "[!] second list is subcategorical to first list";
        break;
    }

    if(subCategoryCase!=1){
      text += ident + "information gain when segmenting first list by the second: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[0], table[1]), 4);
      text += ident + "information gain when segmenting second list by the first: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[1], table[0]), 4);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};

TableOperators.getReportObject = function() {}; //TODO

/**
 * Generates a Table containing details about the lists in the input table.
 * @param {Table} tab Table to generate report on.
 *
 * @param {Boolean} bMeasuresAcrossTop in output, defaults to true
 * @return {Table} Descriptive Table.
 * tags:analysis
 */
TableOperators.getReportTable = function(tab, bMeasuresAcrossTop){
  var i,list,infoObject;
  var t = new Table();
  if(tab == null || tab.length == 0)
    return t;
  bMeasuresAcrossTop = bMeasuresAcrossTop == null ? true : bMeasuresAcrossTop;
  if(tab.name == '')
    t.name='Table Details';
  else
    t.name='Details for Table ' + tab.name;
  t.push(new StringList());
  t[0].name = 'Characteristic';
  var aListInfo = [];
  for(i=0;i<tab.length;i++){
    list = new List();
    list.name = tab[i].name;
    aListInfo[i] = ListOperators.buildInformationObject(tab[i]);
    if(aListInfo[i].numberDifferentElements == undefined){
      infoObject=aListInfo[i];
      infoObject.frequenciesTable = tab[i].getFrequenciesTable(true, true, true);
      infoObject.numberDifferentElements = infoObject.frequenciesTable[0].length;
      infoObject.categoricalColors = infoObject.frequenciesTable[3];
    }
    if(aListInfo[i].entropy == undefined){
      aListInfo[i].entropy = ListOperators.getListEntropy(tab[i], null, aListInfo[i].frequenciesTable);
    }
    t.push(list);
  }
  t[0].push('Column');
  t[0].push('Type');
  t[0].push('Kind');
  t[0].push('Length');
  t[0].push('NumberDifferentElements');
  t[0].push('Average');
  t[0].push('Min');
  t[0].push('Max');
  t[0].push('Entropy');
  t[0].push('Standard Deviation');
  t[0].push('Coefficient of Variation');
  
  t[0].push('1st Common Element');
  t[0].push('2nd Common Element');
  t[0].push('3rd Common Element');
  t[0].push('1st Common Frequency');
  t[0].push('2nd Common Frequency');
  t[0].push('3rd Common Frequency');
  
  t[0].push('Row 1');
  t[0].push('Row 2');
  t[0].push('Row 3');
  t[0].push('Row n-2');
  t[0].push('Row n-1');
  t[0].push('Row n');

  var valOrEmpty = function(val){
    if(val == undefined) return '';
    return val;
  };

  var maxDecimals = function(val,nDec){
    if(val == undefined) return '';
    return Number(NumberOperators.numberToString(val,nDec));
  };

  for(i=0;i<tab.length;i++){
    t[i+1].push(i);
    t[i+1].push(tab[i].type);
    t[i+1].push(aListInfo[i].kind);
    t[i+1].push(aListInfo[i].length);
    t[i+1].push(aListInfo[i].numberDifferentElements);
    t[i+1].push(maxDecimals(aListInfo[i].average,2));
    t[i+1].push(valOrEmpty(aListInfo[i].min));
    t[i+1].push(valOrEmpty(aListInfo[i].max));
    t[i+1].push(maxDecimals(aListInfo[i].entropy,4));
    if(tab[i].type == 'NumberList'){
      var stdev = tab[i].getStandardDeviation();
      t[i+1].push(maxDecimals(stdev,4));
      t[i+1].push(maxDecimals(stdev/aListInfo[i].average,4));
    }
    else{
      t[i+1].push('');
      t[i+1].push('');
    }
    
    t[i+1].push(valOrEmpty(aListInfo[i].frequenciesTable[0][0]));
    t[i+1].push(valOrEmpty(aListInfo[i].frequenciesTable[0][1]));
    t[i+1].push(valOrEmpty(aListInfo[i].frequenciesTable[0][2]));
    t[i+1].push(valOrEmpty(aListInfo[i].frequenciesTable[1][0]));
    t[i+1].push(valOrEmpty(aListInfo[i].frequenciesTable[1][1]));
    t[i+1].push(valOrEmpty(aListInfo[i].frequenciesTable[1][2]));

    t[i+1].push(valOrEmpty(tab[i][0]));
    t[i+1].push(valOrEmpty(tab[i][1]));
    t[i+1].push(valOrEmpty(tab[i][2]));
    t[i+1].push(valOrEmpty(tab[i][aListInfo[i].length-3]));
    t[i+1].push(valOrEmpty(tab[i][aListInfo[i].length-2]));
    t[i+1].push(valOrEmpty(tab[i][aListInfo[i].length-1]));
  }
  if(bMeasuresAcrossTop){
    t = TableOperators.transpose(t,true,true);
    t[0].name = 'List';
  }
  return t;
};


/**
* takes a table and simplifies its lists, numberLists will be simplified using quantiles values (using getNumbersSimplified) and other lists reducing the number of different elements (using getSimplified)
* the number of different values per List is reduced (maximum nCategorires) and by all efects they can be used as categorical
* specially useful to build simpe decision trees using TableOperators.buildDecisionTree
* @param {Table} table to be simplified
* 
* @param  {Number} nCategories number of different elements on each list (20 by default)
* @param {Object} othersElement to be placed instead of the less common elements ("other" by default)
* @return {Table}
* tags:
*/
TableOperators.getTableSimplified = function(table, nCategories, othersElement) {
  if(table==null || !(table.length>0)) return null;
 nCategories = nCategories||20;

 var i;
 var l = table.length;
 var newTable = new Table();
 newTable.name = table.name;

 for(i=0; i<l; i++){
  console.log(i, 'table[i].type:', table[i].type);
   newTable.push(
     table[i].type==='NumberList'?
     table[i].getNumbersSimplified(2, nCategories)
     :
     table[i].getSimplified(nCategories, othersElement)
   );
 }

 return newTable;
};

/**
* Concatenate all the rows of each table into one final table.
* If necessary all the columns within each table are padded to the same length with ''
* @param {Table} table0
* @param {Table} table1
* 
* @param {Table} table2
* @param {Table} table3
* @param {Table} table4
* @param {Table} table5
* @return {Table}
* tags: data
*/
TableOperators.concatRows = function() {
  if(arguments == null || arguments.length === 0 ||  arguments[0] == null) return null;
  if(arguments.length == 1) return arguments[0];

  var i,j,tab1,tabResult,namePrev;
  // find maximum number of cols
  var maxCols=0;
  for(i = 0; i<arguments.length; i++) {
    if(arguments[i] == null) continue;
    maxCols = Math.max(maxCols,arguments[i].length);
    if(!arguments[i].isTable){
      console.log('TableOperators.concatRows arguments must be tables.');
      return null;
    }
  }

  for(i = 0; i<arguments.length; i++) {
    if(arguments[i] == null) continue;
    tab1 = arguments[i];
    var nLLengths = tab1.getLengths();
    var maxLen = nLLengths.getMax();
    var minLen = nLLengths.getMin();
    if(maxLen != minLen){
      // complete the table so all cols have same length
      tab1 = TableOperators.completeTable(tab1,maxLen,null);
    }
    while(tab1.length < maxCols){
      tab1.push(ListGenerators.createListWithSameElement(maxLen,null,''));
    }
    if(i == 0)
      tabResult = tab1.clone();
    else{
      // concat each list
      for(j = 0; j<tabResult.length; j++){
        namePrev = tabResult[j].name; // concat loses name
        tabResult[j] = tabResult[j].concat(tab1[j]);
        tabResult[j].name = namePrev != '' ? namePrev : tab1[j].name;
      }
    }
  }

  return tabResult;
};

/**
 * unions all the lists from a Table
 * @param  {table} Table
 * @return {List} list without repeated elements
 * tags:
 */
TableOperators.unionListsFromTables = function(table){
  if(table==null) return;

  var list = table[0].getWithoutRepetitions();
  var i, j;
  var l = table.length;
  var n;

  for(i=1; i<l; i++){
    n = table[i].length;
    for(j=0; j<n; j++){
      if(!list.includes(table[i][j])) list.push(table[i][j]);
    }
  }

  return list;
};


/**
 * intersects all the lists from a Table
 * @param  {table} Table
 * @return {List} list with elements persent in all lists
 * tags:
 */
TableOperators.intersectListsFromTables = function(table){
  if(table==null) return;

  var list = table[0].getWithoutRepetitions();
  var i;
  var l = table.length;

  for(i=1; i<l; i++){
    list = ListOperators.intersection(list, table[i]);
  }

  return list;
};


/**
 * Calculate the Uncertainty Coefficient (also called Theil's U), a measure of categorical association with value in [0,1]
 * @param  {List} list0
 * @param  {List} list1
 *
 * @param  {Number} direction 0:Symmetric (default)<br>1:list1 to list2<br>2:list2 to list1<br>3:NumberList of results [symmetric,list1 to list2,list2 to list1]
 * @return {Number} coefficient in range [0,1] where 0 represents not associated at all and 1 represents perfectly associated
 * tags: statistics
 */
TableOperators.uncertaintyCoefficient = function(list0, list1, iDirection){
  // this really belongs in ListOperators but putting it there and adding import statements causes everything to break
  // algorithm based on https://github.com/danielmarcelino/SciencesPo/blob/master/R/TESTS.R
  if(list0==null || list1==null || list0.length != list1.length) return;
  if(list0.length == 0) return 0;
  iDirection = iDirection == null ? 0 : iDirection;
  var i,j;
  var len=list0.length;
  // pivotTable was used at first but far too slow for lots of combinations.
  var v0,v1,v01,val,valinner;
  var o0 = {};
  var o1 = {};
  for(i=0;i<len;i++){
    v0 = o0[list0[i]];
    if(v0 == null){
      v0 = o0[list0[i]] = {count:0, vals:{}};
    }
    v0.count++;
    v01 = v0.vals[list1[i]];
    if(v01 == null){
      v01 = v0.vals[list1[i]] = {count:0};
    }
    v01.count++;

    v1 = o1[list1[i]];
    if(v1 == null){
      v1 = o1[list1[i]] = {count:0, vals:{}};
    }
    v1.count++;
    v01 = v1.vals[list0[i]];
    if(v01 == null){
      v01 = v1.vals[list0[i]] = {count:0};
    }
    v01.count++;
  }
  var total = list0.length;
  var nLColSumsByTotal = new NumberList();
  var nLColSumsLog = new NumberList();
  var hxySum = 0;
  for(var key in o0){
    if(!o0.hasOwnProperty(key)) continue;
    val = o0[key].count/total;
    nLColSumsByTotal.push(val);
    nLColSumsLog.push(Math.log(val));
    for(var keyinner in o0[key].vals){
      if(!o0[key].vals.hasOwnProperty(keyinner)) continue;
      valinner = o0[key].vals[keyinner].count/total;
      hxySum += valinner*Math.log(valinner);
    };
  };
  var nLRowSumsByTotal = new NumberList();
  var nLRowSumsLog = new NumberList();
  for(var key in o1){
    if(!o1.hasOwnProperty(key)) continue;
    val = o1[key].count/total;
    nLRowSumsByTotal.push(val);
    nLRowSumsLog.push(Math.log(val));
  };

  var HY = -(nLColSumsByTotal.factor(nLColSumsLog).getSum());
  var HX = -(nLRowSumsByTotal.factor(nLRowSumsLog).getSum());
  
  var HXY = -(hxySum);
  var UCs = 2*(HX+HY-HXY)/(HX+HY);
  var UCrow = (HX+HY-HXY)/HX;
  var UCcol = (HX+HY-HXY)/HY;
  // Use a reasonable precision
  UCs  =Number(NumberOperators.numberToString(UCs,4));
  UCrow=Number(NumberOperators.numberToString(UCrow,4));
  UCcol=Number(NumberOperators.numberToString(UCcol,4));
  switch(iDirection){
    case 0:
      return UCs;
    case 1:
      return UCrow;
    case 2:
      return UCcol;
    case 3:{
      var nLret = new NumberList();
      nLret.push(UCs);
      nLret.push(UCrow);
      nLret.push(UCcol);
      return nLret;
    }
    default:
      throw new Error("TableOperators.uncertaintyCoefficient - invalid value for iDirection: "+iDirection);
  }
};
