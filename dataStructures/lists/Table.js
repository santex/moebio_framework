Table.prototype = new List();
Table.prototype.constructor = Table;

/**
 * Table 
 * @constructor
 */
function Table() {
  var args = [];
  var i;
  for(i = 0; i < arguments.length; i++) {
    args[i] = new List(arguments[i]);
  }

  var array = List.apply(this, args);
  array = Table.fromArray(array);

  return array;
}
Table.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "Table";
  //assign methods to array:
  result.applyFunction = Table.prototype.applyFunction;
  result.getRow = Table.prototype.getRow;
  result.getRows = Table.prototype.getRows;
  result.getLengths = Table.prototype.getLengths;
  result.getListLength = Table.prototype.getListLength;
  result.sliceRows = Table.prototype.sliceRows;
  result.getSubListsByIndexes = Table.prototype.getSubListsByIndexes;
  result.getWithoutRow = Table.prototype.getWithoutRow;
  result.getWithoutRows = Table.prototype.getWithoutRows;
  result.getTransposed = Table.prototype.getTransposed;
  result.getListsSortedByList = Table.prototype.getListsSortedByList;
  result.sortListsByList = Table.prototype.sortListsByList;
  result.getReport = Table.prototype.getReport;
  result.clone = Table.prototype.clone;
  result.print = Table.prototype.print;

  //transformative
  result.removeRow = Table.prototype.removeRow;

  //overiden
  result.destroy = Table.prototype.destroy;

  result.isTable = true;

  return result;
};

Table.prototype.applyFunction = function(func) { //TODO: to be tested!
  var i;
  var newTable = new Table();

  newTable.name = this.name;

  for(i = 0; this[i] != null; i++) {
    newTable[i] = this[i].applyFunction(func);
  }
  return newTable.getImproved();
};

/**
 * returns a lis with all the alements of a row
 * @param  {Number} index
 * @return {List}
 * tags:filter
 */
Table.prototype.getRow = function(index) {
  var list = new List();
  var i;
  for(i = 0; i < this.length; i++) {
    list[i] = this[i][index];
  }
  return list.getImproved();
};

/**
 * returns the length of the list at given index (default 0)
 * 
 * @param  {Number} index
 * @return {Number}
 * tags:
 */
Table.prototype.getListLength = function(index) {
  return this[index || 0].length;
};



/**
 * overrides List.prototype.getLengths (see comments there)
 */
Table.prototype.getLengths = function() {
  var lengths = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    lengths[i] = this[i].length;
  }
  return lengths;
};

/**
 * filter a table by selecting a section of rows, elements with last index included
 * @param  {Number} startIndex index of first element in all lists of the table
 * 
 * @param  {Number} endIndex index of last elements in all lists of the table
 * @return {Table}
 * tags:filter
 */
Table.prototype.sliceRows = function(startIndex, endIndex) {
  endIndex = endIndex == null ? (this[0].length - 1) : endIndex;

  var i;
  var newTable = new Table();
  var newList;

  newTable.name = this.name;
  for(i = 0; this[i] != null; i++) {
    newList = this[i].getSubList(startIndex, endIndex);
    newList.name = this[i].name;
    newTable.push(newList);
  }
  return newTable.getImproved();
};

/**
 * filters the lists of the table by indexes
 * @param  {NumberList} indexes
 * @return {Table}
 * tags:filter
 */
Table.prototype.getSubListsByIndexes = function(indexes) {
  var newTable = new Table();
  this.forEach(function(list) {
    newTable.push(list.getSubListByIndexes(indexes));
  });
  return newTable.getImproved();
};

//deprecated
Table.prototype.getRows = function(rowsIndexes) {
  return Table.prototype.getSubListsByIndexes(indexes);
};

Table.prototype.getWithoutRow = function(rowIndex) {
  var newTable = new Table();
  newTable.name = this.name;
  for(var i = 0; this[i] != null; i++) {
    newTable[i] = List.fromArray(this[i].slice(0, rowIndex).concat(this[i].slice(rowIndex + 1))).getImproved();
    newTable[i].name = this[i].name;
  }
  return newTable.getImproved();
};

Table.prototype.getWithoutRows = function(rowsIndexes) {
  var newTable = new Table();
  newTable.name = this.name;
  for(var i = 0; this[i] != null; i++) {
    newTable[i] = new List();
    for(j = 0; this[i][j] != null; j++) {
      if(rowsIndexes.indexOf(j) == -1) newTable[i].push(this[i][j]);
    }
    newTable[i].name = this[i].name;
  }
  return newTable.getImproved();
};


/**
 * sort table's lists by a list
 * @param  {Object} listOrIndex kist used to sort, or index of list in the table
 * 
 * @param  {Boolean} ascending (true by default)
 * @return {Table} table (of the same type)
 * tags:sort
 */
Table.prototype.getListsSortedByList = function(listOrIndex, ascending) { //depracated: use sortListsByList
  if(listOrIndex == null) return;
  var newTable = instantiateWithSameType(this);
  var sortinglist = listOrIndex.isList ? listOrIndex.clone() : this[listOrIndex];

  this.forEach(function(list) {
    newTable.push(list.getSortedByList(sortinglist, ascending));
  });

  return newTable;
};


Table.prototype.getTransposed = function(firstListAsHeaders) {

  var tableToTranspose = firstListAsHeaders ? this.getSubList(1) : this;

  var table = instantiate(typeOf(tableToTranspose));
  if(tableToTranspose.length == 0) return table;
  var i;
  var j;
  var list;
  var rows = tableToTranspose[0].length;
  for(i = 0; tableToTranspose[i] != null; i++) {
    list = tableToTranspose[i];
    for(j = 0; list[j] != null; j++) {
      if(i == 0) table[j] = new List();
      table[j][i] = tableToTranspose[i][j];
    }
  }
  for(j = 0; tableToTranspose[0][j] != null; j++) {
    table[j] = table[j].getImproved();
  }

  if(firstListAsHeaders) {
    this[0].forEach(function(name, i) {
      table[i].name = String(name);
    });
  }

  return table;
};


Table.prototype.getReport = function(level) {
  var ident = "\n" + (level > 0 ? StringOperators.repeat("  ", level) : "");
  var lengths = this.getLengths();
  var minLength = lengths.getMin();
  var maxLength = lengths.getMax();
  var averageLength = (minLength + maxLength) * 0.5;
  var sameLengths = minLength == maxLength;


  var text = level > 0 ? (ident + "////report of instance of Table////") : "///////////report of instance of Table//////////";

  if(this.length == 0) {
    text += ident + "this table has no lists";
    return text;
  }

  text += ident + "name: " + this.name;
  text += ident + "type: " + this.type;
  text += ident + "number of lists: " + this.length;

  text += ident + "all lists have same length: " + (sameLengths ? "true" : "false");

  if(sameLengths) {
    text += ident + "lists length: " + this[0].length;
  } else {
    text += ident + "min length: " + minLength;
    text += ident + "max length: " + maxLength;
    text += ident + "average length: " + averageLength;
    text += ident + "all lengths: " + lengths.join(", ");
  }

  var names = this.getNames();
  var types = this.getTypes();
  var sameTypes = types.allElementsEqual();
  if(sameTypes) {
    text += ident + "types of all lists: " + types[0];
  } else {
    text += ident + "types: " + types.join(", ");
  }
  text += ident + "names: " + names.join(", ");

  if(this.length < 101) {
    text += ident + ident + "--------lists reports---------";

    var i;
    for(i = 0; this[i] != null; i++) {
      text += "\n" + ident + ("(" + (i) + "/0-" + (this.length - 1) + ")") + this[i].getReport(1);
    }
  }

  ///add ideas to: analyze, visualize

  return text;

};

Table.prototype.getReportObject = function() {}; //TODO
Table.prototype.getReportHtml = function() {}; //TODO



////transformative
Table.prototype.removeRow = function(index) {
  for(var i = 0; this[i] != null; i++) {
    this[i].splice(index, 1);
  }
};


////

Table.prototype.clone = function() {
  var clonedTable = instantiateWithSameType(this);
  clonedTable.name = this.name;
  for(var i = 0; this[i] != null; i++) {
    clonedTable.push(this[i].clone());
  }
  return clonedTable;
};

Table.prototype.destroy = function() {
  for(var i = 0; this[i] != null; i++) {
    this[i].destroy();
    delete this[i];
  }
};

Table.prototype.print = function() {
  c.log("///////////// <" + this.name + "////////////////////////////////////////////////////");
  c.log(TableEncodings.TableToCSV(this, null, true));
  c.log("/////////////" + this.name + "> ////////////////////////////////////////////////////");
};