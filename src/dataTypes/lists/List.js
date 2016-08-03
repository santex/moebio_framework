import DataModel from "src/dataTypes/DataModel";
import NumberList from "src/dataTypes/numeric/NumberList";
import ColorList from "src/dataTypes/graphic/ColorList";
import StringList from "src/dataTypes/strings/StringList";
import DateList from "src/dataTypes/dates/DateList";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import RelationList from "src/dataTypes/structures/lists/RelationList";
import Polygon from "src/dataTypes/geometry/Polygon";
import PolygonList from "src/dataTypes/geometry/PolygonList";
import Table from "src/dataTypes/lists/Table";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import Interval from "src/dataTypes/numeric/Interval";
import ListOperators from "src/operators/lists/ListOperators";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import NumberOperators from "src/operators/numeric/NumberOperators";
import { instantiateWithSameType, typeOf, instantiate } from "src/tools/utils/code/ClassUtils";

List.prototype = new DataModel();
List.prototype.constructor = List;


 /**
  * @classdesc List is an Array with a type property.
  * Lists have a number of methods to assist with working with
  * them. There are also a number of helper functions in associated namespaces.
  *
  * Additional functions that work on List can be found in:
  * <ul>
  *  <li>Operators:   {@link ListOperators}</li>
  *  <li>Conversions: {@link ListConversions}</li>
  *  <li>Generators: {@link ListGenerators}</li>
  * </ul>
  *
  * @description Creates a new List.
  * @param {Number|String|Object} arguments Comma separated values to add to List
  * @constructor
  * @category basics
  */
function List() {
  DataModel.apply(this);
  var array = [];
  var i;
  var nArguments = arguments.length;
  for(i = 0; i < nArguments; i++) {
    array.push(arguments[i]);
  }
  array = List.fromArray(array);
  //
  return array;
}
export default List;

/**
 * Creates a new List from a raw array of values
 *
 * @param {Number[]|String[]|Object[]} array Array of values.
 * @return {List} New List.
 */
List.fromArray = function(array) {
  if (array == null) return;
  
  //TODO: clear some of these method declarations
  array.type = "List";
  array.name = array.name || "";

  array.setType = List.prototype.setType;
  array.setArray = List.prototype.setArray;
  array.toArray = List.prototype.toArray;
  array._constructor = List;

  array.getImproved = List.prototype.getImproved;
  array.getElement = List.prototype.getElement;
  array.getElements = List.prototype.getElements;
  array.isEquivalent = List.prototype.isEquivalent;
  //array.getLength = List.prototype.getLength;
  array.getTypeOfElements = List.prototype.getTypeOfElements; //TODO: redundant?
  array.getTypes = List.prototype.getTypes;
  array.getType = List.prototype.getType;
  array.getLengths = List.prototype.getLengths;
  array.getWithoutRepetitions = List.prototype.getWithoutRepetitions;
  array.getSimplified = List.prototype.getSimplified;
  array.getFrequenciesTable = List.prototype.getFrequenciesTable;
  array.allElementsEqual = List.prototype.allElementsEqual;
  array.countElement = List.prototype.countElement;
  array.countOccurrences = List.prototype.countOccurrences;
  array.getMostRepeatedElement = List.prototype.getMostRepeatedElement;
  array.getMin = List.prototype.getMin;
  array.getMax = List.prototype.getMax;
  array.indexOfElement = List.prototype.indexOfElement;
  array.indexesOf = List.prototype.indexesOf;
  array.indexOfElements = List.prototype.indexOfElements;
  array.indexesOfElements = List.prototype.indexesOfElements;
  array.indexOfByPropertyValue = List.prototype.indexOfByPropertyValue;
  array.getFirstElementByName = List.prototype.getFirstElementByName;
  array.getElementByName = List.prototype.getElementByName;
  array.getElementsByNames = List.prototype.getElementsByNames;
  array.getFirstElementByPropertyValue = List.prototype.getFirstElementByPropertyValue;
  array.add = List.prototype.add;
  array.multiply = List.prototype.multiply;
  array.getElementNumberOfOccurrences = List.prototype.getElementNumberOfOccurrences;
  array.getPropertyValues = List.prototype.getPropertyValues;
  array.getRandomElement = List.prototype.getRandomElement;
  array.getRandomElements = List.prototype.getRandomElements;
  array.containsElement = List.prototype.containsElement;
  //sorting:
  array.isSorted = List.prototype.isSorted;
  array.sortIndexed = List.prototype.sortIndexed;
  //array.sortNumericIndexed = List.prototype.sortNumericIndexed;
  //array.sortNumeric = List.prototype.sortNumeric;
  //array.sortNumericIndexedDescending = List.prototype.sortNumericIndexedDescending;
  //array.sortNumericDescending = List.prototype.sortNumericDescending;
  array.getSortedByIndexes = List.prototype.getSortedByIndexes;
  array.getReversed = List.prototype.getReversed;
  array.getSortedByProperty = List.prototype.getSortedByProperty;
  array.getSorted = List.prototype.getSorted;
  array.getSortedByList = List.prototype.getSortedByList;
  array.getSortedRandom = List.prototype.getSortedRandom;
  //filter:
  array.getSubList = List.prototype.getSubList;
  array.getSubListByIndexes = List.prototype.getSubListByIndexes;//deprecated
  array.getSubListByType = List.prototype.getSubListByType;
  array.getFilteredByPropertyValue = List.prototype.getFilteredByPropertyValue;
  array.getFilteredByBooleanList = List.prototype.getFilteredByBooleanList;

  array.toStringList = List.prototype.toStringList;
  array.toNumberList = List.prototype.toNumberList;

  array.clone = List.prototype.clone;
  array.toString = List.prototype.toString;
  array.getNames = List.prototype.getNames;
  array.applyFunction = List.prototype.applyFunction;
  array.getWithoutElementAtIndex = List.prototype.getWithoutElementAtIndex;
  array.getWithoutElement = List.prototype.getWithoutElement;
  array.getWithoutElements = List.prototype.getWithoutElements;
  array.getWithoutElementsAtIndexes = List.prototype.getWithoutElementsAtIndexes;
  array.getFilteredByFunction = List.prototype.getFilteredByFunction;
  array.addElements = List.prototype.addElements;

  array._concat = Array.prototype.concat;
  array.concat = List.prototype.concat;

  //transformations
  array.pushIfUnique = List.prototype.pushIfUnique;
  array.removeElement = List.prototype.removeElement;
  array.removeElementAtIndex = List.prototype.removeElementAtIndex;
  array.removeElementsAtIndexes = List.prototype.removeElementsAtIndexes;
  array.removeElements = List.prototype.removeElements;
  array.removeRepetitions = List.prototype.removeRepetitions;
  array.replace = List.prototype.replace;
  array.assignNames = List.prototype.assignNames;
  array.assignPropertyValues = List.prototype.assignPropertyValues;
  array._splice = Array.prototype.splice;
  array.splice = List.prototype.splice;

  array.isList = true;

  array.destroy = List.prototype.destroy;

  return array;
};

/**
 * improves a list by its refining type (if the List contains numbers it will return a NumberList)
 * @return {List} Specific sub-class of List, based on the contents of the List.
 * tags:
 */
List.prototype.getImproved = function() {
  if(this.length === 0) {
    return this;
  }

  var typeOfElements = this.getTypeOfElements();
  var newList;
  switch(typeOfElements) {
    case "number":
      newList = NumberList.fromArray(this, false);
      break;
    case "string":
      newList = StringList.fromArray(this, false);
      break;
    case "Rectangle":
      return this;
    case "date":
      newList = DateList.fromArray(this, false);
      break;
    case "List":
    case "DateList":
    case "IntervalList":
    case "StringList":
    case "Table":
      newList = Table.fromArray(this, false);
      break;
    case "NumberList":
      newList = NumberTable.fromArray(this, false);
      break;
    case "Point":
      newList = Polygon.fromArray(this, false);
      break;
    case "Polygon":
      newList = PolygonList.fromArray(this, false);
      break;
    case "Node":
      newList = NodeList.fromArray(this, false);
      break;
    case "Relation":
      newList = RelationList.fromArray(this, false);
      break;
  }

  var l = this.length;
  var containsNulls = false;
  var allLists = true;
  var i;

  if(newList == null ||  newList == "") {//do not change newList == null

    for(i = 0; i<l; i++) {
      if(this[i]==null) containsNulls = true;
      if(this[i]==null || !(this[i].isList)) {
        allLists = false;
        break;
      }
    }
    if(allLists){
      newList = Table.fromArray(this, false);
    }
  }


  if(newList != null) {
    newList.name = this.name;
    //return newList;
  } else {
    newList = this;
  }

  if(allLists){
    for(i = 0; i<l; i++) {
      if(newList[i]==null || newList[i].containsNulls){
        containsNulls = true;
        break;
      }
    }
  } else if(!containsNulls){
    for(i = 0; i<l; i++) {
      if(newList[i]==null){
        containsNulls = true;
        break;
      }
    }
  }

  newList.containsNulls = containsNulls;

  return newList;
};

/**
 * extracts an element from the list
 *
 * @param {Number|String} index (Number) or name (String) of the element
 * @return {Object}
 * tags:
 */
List.prototype.getElement = function(indexOrName) {//@todo: make this efficient
  if(typeof indexOrName =='string'){
    indexOrName = indexOrName.trim();
    var found = false;
    for(var i=0; i<this.length; i++){
      if(this[i]["name"]==indexOrName){
        found = true;
        indexOrName = i;
        break;
      }
    }
    if(!found) throw new Error("didn't find a list with name "+indexOrName);
  } else {
    indexOrName = indexOrName == null ? 0 : indexOrName;
    if(indexOrName<0) indexOrName += this.length;
  }

  return this[indexOrName];
};

/**
 * returns a list with elements in indexes. or found by names.
 * @param {NumberList|StringList} indexesOrNames list of indexes (NumberList) or names (StringList) of lists
 *
 * @param {Boolean} nullIfNotFound true:adds a null if not found<br>false: doesn't add any element and the resulting List could have less elements than indexes or names provided
 * @return {List}
 * tags:filter
 */
List.prototype.getElements = function(indexesOrNames, nullIfNotFound) {
  if(indexesOrNames==null) return;

  var newList = new List();
  newList.name = this.name;
  var l = indexesOrNames.length;
  var i;
  var list;

  var name = typeOf(indexesOrNames)=='StringList';

  for(i=0; i<l; i++){
    list = name?this.getElementByName(indexesOrNames[i]):this[indexesOrNames[i]];

    if(list==null){
      if(nullIfNotFound) newList.push(null);
    } else {
      newList.push(list);
    }
  }

  return newList.getImproved();
};

/**
 * Creates a simple Array from the list, preserves name and type properties
 * @return {Array}
 * tags:
 */
List.prototype.toArray = function() {//@todo: make this efficient
  var array = this.slice(0);
  array.name = this.name;
  array.type = this.type;
  return array;
};

/**
 * Compares elements with another list, if all elements are identical, the lists are equivalent and return true. A List is always equivalente to itslef, and two different lists could be equivalent.
 * @param  {List} list to compare.
 * @return {Boolean} true if all elements are identical
 * tags:
 */
List.prototype.isEquivalent = function(list) {
  if(this.length != list.length) return false;

  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    if(this[i] != list[i]) return false;
  }

  return true;
};

/**
 * returns a NumberList of lengths of elements on list (string lengths for StringList, lists lengths for Table)
 * @return {null}
 * tags:
 */
List.prototype.getLengths = function() {
  throw new Error('requires a list with elements that have a length property');
  return null;
};

/**
 * returns the type of values contained in the List.
 * Uses typeOf to determine type. If multiple types,
 * returns an empty string.
 * @return {String} Type of element stored in the List.
 * tags:
 */
List.prototype.getTypeOfElements = function() {
  var typeOfElements = typeOf(this[0]);
  var l = this.length;
  for(var i = 1; i<l; i++) {
    if(typeOf(this[i]) != typeOfElements) return "";
  }
  return typeOfElements;
};

/**
 * returns a {@link StringList} with elemnts types
 * for all elements in the List.
 * @return {StringList} List of types for each element.
 * tags:
 */
List.prototype.getTypes = function() {
  var types = new StringList();
  var l = this.length;
  for(var i = 0; i<l; i++) {
    types[i] = typeOf(this[i]);
  }
  return types;
};


/**
 * converts the List into a string.
 * @return {String} String representation of the List.
 */
List.prototype.toString = function() {
  var str = "[";
  for(var i = 0; i < this.length - 1; i++) {
    str += this[i] + ", ";
  }
  str += this[this.length - 1] + "]";
  return str;
};

/**
 * returns a list of names (if any) of elements of the list
 * @return {StringList}
 * tags:
 */
List.prototype.getNames = function() {
  var stringList = new StringList();
  var l = this.length;
  for(var i = 0; i<l; i++) {
    stringList[i] = this[i].name;
  }
  return stringList;
};

/**
 * reverses the list
 * @return {List} New List reveresed from original.
 * tags:sort
 */
List.prototype.getReversed = function() {
  var newList = instantiateWithSameType(this);
  var l = this.length;
  for(var i = 0; i<l; i++) {
    newList.unshift(this[i]);
  }
  return newList;
};

/**
 * returns a sub-list, params could be: tw numbers, an interval or a NumberList.
 * @param {Number} argument0 number, interval (in this it will include elements with initial and end indexes) or numberList
 *
 * @param {Number} argument1 second index
 * @return {List}
 * tags:filter
 */
List.prototype.getSubList = function() {
  var interval;
  var i;
  if(arguments[0]==null) return;

  if(arguments[0].isList) {
    return this.getElements(arguments[0]);
  } else if(arguments.length > 2) {
    return this.getElements(arguments);
  } else if(typeOf(arguments[0]) == 'number') {
    if(typeOf(arguments[1]) != null && typeOf(arguments[1]) == 'number') {
      interval = new Interval(arguments[0], arguments[1]);
    } else {
      interval = new Interval(arguments[0], this.length - 1);
    }
  } else {
    interval = arguments[0];
  }


  var newInterval = new Interval(Math.max(Math.min(Math.floor(interval.x), this.length), 0), Math.max(Math.min(Math.floor(interval.y), this.length - 1), 0));
  var newList;

  if(this.type == "NumberList") {
    newList = NumberList.fromArray(this.slice(interval.x, interval.y + 1), false);
    newList.name = this.name;
    return newList;
  } else if(this.type == "StringList") {
    newList = StringList.fromArray(this.slice(interval.x, interval.y + 1), false);
    newList.name = this.name;
    return newList;
  }

  var type = this.type;

  if(type == 'List' || type == 'Table') {
    newList = new List();
  } else {
    newList = instantiate(type);
  }

  if(type=='NodeList'){
    for(i = newInterval.x; i <= newInterval.y; i++) {
      newList.addNode(this[i]);
    }
  } else {
    for(i = newInterval.x; i <= newInterval.y; i++) {
      newList.push(this[i]);
    }
  }

  newList.name = this.name;
  if(type == 'List' || type == 'Table') return newList.getImproved();
  return newList;
};

/**
 * filters a list by picking elements of certain type.
 * @param  {String} type The type to include in the new List.
 * @return {List} A List only containing values from the original
 * List of the input type.
 * tags:filter
 */
List.prototype.getSubListByType = function(type) {
  var newList = new List();
  newList.name = this.name;
  this.forEach(function(element) {
    if(typeOf(element) == type) newList.push(element);
  });
  return newList.getImproved();
};



/**
 * returns all elements in indexes.
 * @param {NumberList} indexes
 * @return {List}
 * tags:deprecated
 * replaceBy:getElements
 */
List.prototype.getSubListByIndexes = function() {
  return this.getElements.apply(this, arguments);
};


/**
 * getElementNumberOfOccurrences
 * @param {Object} element
 * @return {Number}
 */
List.prototype.getElementNumberOfOccurrences = function(element) {
  var nOccurrences = 0;
  var from = 0;
  var index = this.indexOf(element, from);
  while(index > -1) {
    nOccurrences++;
    from = index + 1;
    index = this.indexOf(element, from);
  }
  return nOccurrences;
};


/**
 * creates a copy of the List
 * @return {List}
 */
List.prototype.clone = function() {
  //TODO:check this! fromArray should suffice
  var clonedList = instantiateWithSameType(this);
  var i;
  var l = this.length;

  for(i = 0; i<l; i++) {
    clonedList.push(this[i]);
  }
  clonedList.name = this.name;

  return clonedList;
};

/**
 * creates a new List without repeating elements.
 * @return {List}
 * tags:filter
 */
List.prototype.getWithoutRepetitions = function() {
  var i;
  var dictionary;

  var newList = instantiateWithSameType(this);
  var l = this.length;

  newList.name = this.name;

  //if(this.type == 'NumberList' || this.type == 'StringList') {//TODO:check other cases
  dictionary = {};
  for(i = 0; i<l; i++) {
    if(!dictionary[this[i]]) {
      newList.push(this[i]);
      dictionary[this[i]] = true;
    }
  }

  return newList;
};


/**
 * simplifies a categorical list, by keeping the nCategories-1 most common values, and replacing the others with an "other" element
 * @param  {Number} nCategories number of diferent elemenets in the resulting list
 *
 * @param  {Object} othersElement to be placed instead of the less common elements ("other" by default)
 * @param  {NumberList} nLWeights to use for weighting importance of each element. If not specified then simple frequency is used.
 * @return {List} simplified list
 * tags:
 */
List.prototype.getSimplified = function(nCategories, othersElement, nLWeights) {
  if(!nCategories) return;

  var freqTable = this.getFrequenciesTable(true,false,false,nLWeights);
  var frequencyIndexesDictionary = ListOperators.getSingleIndexDictionaryForList(freqTable[0]);
  var i;
  var l = this.length;

  if(othersElement==null) othersElement = "other";

  var newList = this.type=="StringList"?new StringList():new List();
  newList.name = this.name;

  for(i=0; i<l; i++){
    newList.push(frequencyIndexesDictionary[this[i]]<nCategories-1?this[i]:othersElement);
  }

  return newList;
};


/**
 * returns the number of occurrences of an element in a list.
 * @param  {Object} element The element to count
 * @return {Number}
 * tags:countt
 */
List.prototype.countElement = function(element) {
  var n = 0;
  //this.forEach(function(elementInList) {
  var l = this.length;

  for(var i = 0; i<l; i++) {
    if(element == this[i]) n++;
  }

  return n;
};

/**
 * returns a NumberList of same size as list with number of occurrences for each element.
 * @return {NumberList}
 * tags:count
 */
List.prototype.countOccurrences = function() { //TODO: more efficient
  var occurrences = new NumberList();
  var dictionary = {};
  var l = this.length;
  
  for(var i = 0; i<l; i++) {
    if(dictionary[this[i]]==null) dictionary[this[i]] = 0;
    dictionary[this[i]]++;
  }

  for(i = 0; i<l; i++) {
    occurrences[i] = dictionary[this[i]];
  }

  return occurrences;
};


/**
 * returns a table with a list of non repeated elements and a list with the numbers of occurrences for each one.
 *
 * @param {Boolean} sortListsByOccurrences if true both lists in the table will be sorted by number of occurences (most frequent on top), true by default
 * @param {Boolean} addWeightsNormalizedToSum adds a 3rd list with weights normalized to sum (convenient to proportion visualizations)
 * @param {Boolean} addCategoricalColors adds a list of categorical colors
 * @param {NumberList} nLWeights to use for weighting importance of each element. If not specified then simple frequency is used.
 * @return {Table} Table containing a List of non-repeated elements and a NumberList of the frequency of each element.
 * tags:count
 * previous_name:getElementsRepetitionCount
 */
List.prototype.getFrequenciesTable = function(sortListsByOccurrences, addWeightsNormalizedToSum, addCategoricalColors, nLWeights) {
  sortListsByOccurrences = sortListsByOccurrences == null?true:sortListsByOccurrences;

  var table = new Table();
  var elementList =  instantiateWithSameType(this); //new List();
  var numberList = new NumberList();
  var i;
  var index;

  table[0] = elementList;
  table[1] = numberList;

  table._indexesDictionary = {};

  var l = this.length;

  for(i=0; i<l; i++){
    index = table._indexesDictionary[this[i]];
    if(index==null){
      index = elementList.length;
      elementList[index] = this[i];
      numberList[index] = 0;
      table._indexesDictionary[this[i]]= index;
    }
    if(nLWeights && i < nLWeights.length)
      numberList[index]+= nLWeights[i];
    else
      numberList[index]++;
  }

  numberList.name = "occurences";

  if(sortListsByOccurrences){
    table[0] = elementList.getSortedByList(numberList, false);
    table[1] = numberList.getSorted(false);
    table._indexesDictionary = null;
  }

  if(addWeightsNormalizedToSum){
    table[2] = NumberListOperators.normalizeToSum(table[1]);
    table[2].name = "occurences normalized to sum";
  }

  if(addCategoricalColors){
    //var colors = new ColorList();
    //l = table[0].length;
    //for(i = 0; i<l; i++) {
    //  colors[i] = ColorListGenerators._HARDCODED_CATEGORICAL_COLORS[i%ColorListGenerators._HARDCODED_CATEGORICAL_COLORS.length];
    //}
    var colors = ColorListGenerators.stringsToColors(table[0]);
    colors.name = "categorical colors";
    table.push(colors);
  }

  return table;
};

/**
 * checks if all values in the list are equal to one another
 * @return {Boolean} Returns true if all values in the list are equal.
 */
List.prototype.allElementsEqual = function() {
  var i;
  if(this.length < 2) return true;

  var first = this[0];
  var l = this.length;

  for(i = 1; i<l; i++) {
    if(this[i] != first) return false;
  }

  return true;
};


/**
 * Returns the value in the list that is repeated the most times.
 *
 * @return {Object} Most repeated value.
 */
List.prototype.getMostRepeatedElement = function() {
  //TODO: this method should be more efficient
  return this.getFrequenciesTable(true)[0][0];// ListOperators.countElementsRepetitionOnList(this, true)[0][0];
};

/**
 * returns the minimum value
 * @return {Number} minimum value in the list
 * tags:
 */
List.prototype.getMin = function() {
  if(this.length === 0) return null;
  var min = this[0];
  var i;
  var l = this.length;
  for(i = 1; i < l; i++) {
    min = Math.min(min, this[i]);
  }
  return min;
};

/**
 * returns the maximum value
 * @return {Number} maximum value in the list
 * tags:
 */
List.prototype.getMax = function() {
  if(this.length === 0) return null;
  var max = this[0];
  var i;
  var l = this.length;
  for(i = 1; i < l; i++) {
    max = Math.max(max, this[i]);
  }
  return max;
};

/**
 * Creates a new List with the given value added
 * to each element in the current List.
 *
 * @param {Number} value Number to be added to each
 * element in the List.
 * @return {List} New List with each element the result
 * of adding the given value to the original elements
 * in the List.
 */
List.prototype.add = function(value) {
  if(value.constructor == Number) {
    var i;
    var l = this.length;
    var array = instantiateWithSameType(this);
    for(i = 0; i < l; i++) {
      array.push(this[i] + value);
    }
    return array;
  }
};

/**
 * Selects a random element from list.
 *
 * @return {Object}
 * tags:
 */
List.prototype.getRandomElement = function() {
  return this[Math.floor(this.length * Math.random())];
};

/**
 * creates a List with randomly selected elements.
 * @param  {Number} n number of elements
 *
 * @param  {Boolean} avoidRepetitions (true by default)
 * @param {Number} randomSeed (to expect stable results)
 * @param {Boolean} keepOrder extracts elements respecting original order [!] number of elements will ba approximatevely n
 * @return {List}
 * tags:filter
 */
List.prototype.getRandomElements = function(n, avoidRepetitions, randomSeed, keepOrder) {
  if(n==null) return;

  var random = randomSeed!=null ? new NumberOperators._Alea("my", randomSeed, "seeds") : Math.random;
  avoidRepetitions = avoidRepetitions == null ? true : avoidRepetitions;
  n = Math.min(n, this.length);
  var newList = instantiateWithSameType(this);
  var element;

  if(keepOrder){
    var prob = n/this.length;
    for(var i=0; i<this.length; i++){
      if(Math.random()<prob) newList.push(this[i]);
    }
  } else {
    while(newList.length < n) {
      element = this[Math.floor(this.length * random())];
      if(!avoidRepetitions || newList.indexOf(element) == -1) newList.push(element);
    }
  }
  newList.name = this.name;
  return newList;
};


/**
 * returns true if the given element is in the List.
 * @param {Object} element Element to look for in the List.
 * @return {Boolean} True if given element is in the List.
 */
List.prototype.containsElement = function(element) { //TODO: test if this is faster than indexOf
  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    if(this[i] == element) return true;
  }
  return false;
};

/**
 * Returns a List of values of a property of all elements.
 *
 * @param  {String} propertyName
 *
 * @param  {Object} valueIfNull in case the property doesn't exist in the element
 * @return {List}
 * tags:
 */
List.prototype.getPropertyValues = function(propertyName, valueIfNull) {
  var newList = new List();
  newList.name = propertyName;
  var val;
  var l = this.length;
  for(var i = 0; i<l; i++) {
    val = this[i][propertyName];
    newList[i] = (val == null ? valueIfNull : val);
  }
  return newList.getImproved();
};


List.prototype.isSorted = function(ascending){
  ascending = ascending==null?true:Boolean(ascending);

  var l = this.length;
  var i;
  if(ascending){
    for(i=1;i<l;i++){
      if(this[i]<this[i-1]){
        console.log('~ non sorted elements i, i-1, (ascending):',i,this[i],this[i-1]);
      }
      if(this[i]<this[i-1]) return false;
    }
  } else {
    for(i=1;i<l;i++){
      if(this[i]>this[i-1]) return false;
    }
  }
  return true;
};

List.prototype.sortIndexed = function() {
  var index = [];
  var i;
  var l = this.length;
  for(i = 0; i < l; i++) {
    index.push({
      index: i,
      value: this[i]
    });
  }
  var comparator = function(a, b) {
    var array_a = a.value;
    var array_b = b.value;

    //return array_a < array_b ? -1 : array_a > array_b ? 1 : 0;
    return array_a - array_b;// ? -1 : array_a > array_b ? 1 : 0;
  };
  index = index.sort(comparator);
  var result = new NumberList();
  for(i = 0; i < index.length; i++) {
    result.push(index[i].index);
  }
  return result;
};

/**
 * Sorts the list by indexes
 * @param {List} list of indexes used to sort
 * @return {List} sorted list
 * tags:sort
 */
List.prototype.getSortedByIndexes = function(indexes) {
  if(indexes==null) return;

  var result = instantiateWithSameType(this);
  result.name = this.name;
  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    if(indexes[i] != -1) result.push(this[indexes[i]]);
  }
  return result;
};

List.prototype.getSortedByProperty = function(propertyName, ascending) {
  ascending = ascending == null ? true : ascending;

  var comparator;
  if(ascending) {
    // comparator = function(a, b) {
    //   return a[propertyName] > b[propertyName] ? 1 : -1;
    // };
    comparator = function(a, b) {
       return a[propertyName] - b[propertyName];
    };
  } else {
    // comparator = function(a, b) {
    //   return b[propertyName] > a[propertyName] ? 1 : -1;
    // };
    comparator = function(a, b) {
      return b[propertyName] - a[propertyName];
    };
  }
  return this.clone().sort(comparator);
};

/**
 * Returns a sorted version of the List.
 *
 * @param  {Boolean} ascending sort (true by default)
 * @return {List}
 * tags:sort
 */
List.prototype.getSorted = function(ascending) {
  return this.getSortedByList(this, ascending);
};

/**
 * Sorts the list by another list
 * @param {List} list List used to sort (numberList, stringList, dateList…)
 *
 * @param {Boolean} ascending (true by default)
 * @param {Boolean} smallPerturbation (false by default) adds a very small random number to list (providing is a numberList) to randomly sort equal elements
 * @param {Boolean} stable sort, equal values retain order (false by default)
 * @return {List} sorted list (of the same type)
 * tags:sort
 */
List.prototype.getSortedByList = function(list, ascending, smallPerturbation, stable) {
  if(list==null) return null;

  ascending = ascending == null ? true : ascending;
  stable = stable == null ? false : stable;

  var pairsArray = [];
  var i;
  var l = this.length;

  if(smallPerturbation && list.type=="NumberList"){
    for(i = 0; i<l; i++) {
      pairsArray[i] = [this[i], list[i]+Math.random()*10000*Number.MIN_VALUE, i];
    }
  }
  else if(list.type=="DateList"){
    for(i = 0; i<l; i++) {
      pairsArray[i] = [this[i], list[i].getTime(),i];
    }
  }
  else{
    for(i = 0; i<l; i++) {
      pairsArray[i] = [this[i], list[i],i];
    }
  }
  var bSimpleComparator = (list.type=="NumberList" || list.type=="DateList") && !stable;

  var comparator;
  if(ascending) {
    if(bSimpleComparator){
      comparator = function(a, b) {
        return a[1] - b[1];
      };
    }
    else{
      if(stable)
        comparator = function(a, b) {
          return a[1] < b[1] ? -1 : a[1] > b[1] ?  1 : a[2] - b[2];
        };
      else
        comparator = function(a, b) {
          return a[1] < b[1] ? -1 : a[1] > b[1] ?  1 : 0;
        };
    }
  } else {
    if(bSimpleComparator){
      comparator = function(a, b) {
        return b[1] - a[1];
      };
    }
    else{
      if(stable)
        comparator = function(a, b) {
          return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : a[2] - b[2];
        };
      else
        comparator = function(a, b) {
          return a[1] < b[1] ? 1 : a[1] > b[1] ?  -1 : 0;
        };
    }
  }

  pairsArray = pairsArray.sort(comparator);

  var newList = instantiateWithSameType(this);
  newList.name = this.name;

  for(i = 0; i<l; i++) {
    newList[i] = pairsArray[i][0];
  }

  return newList;
};


/**
 * Returns a copy of the list with random sorting.
 *
 * @return {List}
 * tags:sort
 */
List.prototype.getSortedRandom = function() {
  var newList = this.clone();
  newList.name = this.name;
  newList.sort(function() {
    //return Math.random() < 0.5 ? 1 : -1;
    return Math.random() - 0.5;
  });
  return newList;
};



/**
 * returns the index position of the given element in the List.
 * @param {Object} element Value to search for in the List.
 * @return {Number} Index of the given element in the List.
 * If element is not found, -1 is returned.
 */
List.prototype.indexOfElement = function(element) { //TODO: test if this is faster than indexOf
  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    if(this[i] == element) return i;
  }
  return -1;
};

/**
 * Returns a NumberList with the indexes (positions) of an element.
 *
 * @param  {Object} element
 * @return {NumberList}
 * tags:
 */
List.prototype.indexesOf = function(element) {//@todo: probably better to just traverse de list
  if(element==null) return;

  var index = this.indexOf(element);
  var numberList = new NumberList();

  while(index != -1) {
    numberList.push(index);
    index = this.indexOf(element, index + 1);
  }
  return numberList;
};

/**
 * Returns a NumberList with indexes (first position) of elements in a list.
 *
 * @param  {List} elements
 * @return {NumberList}
 * tags:
 */
List.prototype.indexOfElements = function(elements) {//@todo: probably better to just traverse de list
  if(elements==null) return;

  var numberList = new NumberList();
  var l = elements.length;
  for(var i = 0; i<l; i++) {
    numberList[i] = this.indexOf(elements[i]);
  }
  return numberList;
};

/**
 * Returns a numberList with all the positions of elements in a list.
 *
 * @param  {List} elements
 * @return {NumberList}
 * tags:
 */
List.prototype.indexesOfElements = function(elements) {
  if(elements==null) return;

  var dictionary = ListOperators.getBooleanDictionaryForList(elements);

  var numberList = new NumberList();
  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    if(dictionary[this[i]]) numberList.push(i);
  }
  return numberList;
};

/**
 * [!] deprectated, use getElementByName.
 * @param  {String} name of element
 * @param  {Boolean} returnIndex if true returns the index of element (false by default)
 * @return {Object}
 * tags: deprecated
 */
List.prototype.getFirstElementByName = function(name, returnIndex) {
  return this.getElementByName(name, returnIndex);
};

/**
 * Returns the first element (or index) in the list with the given name
 * @param  {String} name of element
 * @param  {Boolean} returnIndex if true returns the index of element (false by default)
 * @return {Object}
 * tags: filter
 */
List.prototype.getElementByName = function(name, returnIndex) {
  if(name==null) return null;

  var l = this.length;
  for(var i = 0; i<l; i++) {
    if(this[i].name == name) return returnIndex ? i : this[i];
  }
  return returnIndex ? -1 : null;
};

/**
 * Returns the first element from each name
 * @param {StringList} names of elements to be filtered
 *
 * @param {Boolean} returnIndexes if true returns the indexes of elements (false by default)
 * @param {Boolean} includeElementIfNameNotFound if name is not found, includes an element (hat could be null) in returned list (or a -1 in case of indexes), guaranting the list has same length as list of names
 * @param {Object} elementToIncludeIfNameNotFound element to include in case there's no elemnt with found name
 * @return {List}
 * tags:filter
 */
List.prototype.getElementsByNames = function(names, returnIndex, includeElementIfNameNotFound, elementToIncludeIfNameNotFound) {
  if(names==null) return;

  var list = returnIndex ? new NumberList() : new List();
  var j, i;
  var name;
  var l = this.length;
  var found;

  //names.forEach(function(name) {
  for(j=0; j<names.length; j++){
    name = names[j];
    found = false;
    for(i = 0; i<l; i++) {
      if(this[i].name == name) {
        list.push(returnIndex ? i : this[i]);
        found = true;
        break;
      }
    }

    if(includeElementIfNameNotFound && !found) list.push(returnIndex ? -1 : elementToIncludeIfNameNotFound);

    //list.push(returnIndex ? -1 : null);
  }
  //});

  return returnIndex ? list : list.getImproved();
};


/**
 * Gets the first elemenet that has some property with a given value.
 *
 * @param  {String} propertyName name of property
 * @param  {Object} value value of property
 * @return {Object}
 * tags:
 */
List.prototype.getFirstElementByPropertyValue = function(propertyName, value) {
  var l = this.length;
  for(var i = 0; i<l; i++) {
    if(this[i][propertyName] == value) return this[i];
  }
  return null;
};

List.prototype.indexOfByPropertyValue = function(propertyName, value) {
  var l = this.length;
  for(var i = 0; i<l; i++) {
    if(this[i][propertyName] == value) return i;
  }
  return -1;
};



/**
 * Filters the list by booleans (also accepts numberList with 0s as false a any other number as true).
 *
 * @param  {List} booleanList booleanList or numberList
 * @return {List}
 * tags:filter
 */
List.prototype.getFilteredByBooleanList = function(booleanList) {
  var newList = new List();
  newList.name = this.name;
  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    if(booleanList[i]) newList.push(this[i]);
  }
  return newList.getImproved();
};


/**
 * Filters a list by the values of a property on its elements, and a type of comparison (equal by default).
 *
 * @param  {String} propertyName name of property
 * @param  {Object} propertyValue object (for equal or different comparison) or number or date (for equal, different, greater, lesser)
 * @param  {String} comparison equal (default), different, greater, lesser
 * @return {List} filtered list
 * tags:filter
 */
List.prototype.getFilteredByPropertyValue = function(propertyName, propertyValue, comparison) {
  comparison = comparison == null ? "equal" : comparison;

  var newList = new List();
  newList.name = "filtered_" + this.name;
  var i;
  var l = this.length;
  switch(comparison) {
    case "equal":
      for(i = 0; i<l; i++) {
      if(this[i][propertyName] == propertyValue) newList.push(this[i]);
    }
    break;
    case "different":
      for(i = 0; i<l; i++) {
      if(this[i][propertyName] != propertyValue) newList.push(this[i]);
    }
    break;
    case "greater":
      for(i = 0; i<l; i++) {
      if(this[i][propertyName] > propertyValue) newList.push(this[i]);
    }
    break;
    case "lower":
      for(i = 0; i<l; i++) {
      if(this[i][propertyName] < propertyValue) newList.push(this[i]);
    }
    break;
  }

  return newList.getImproved();
};

List.prototype.applyFunction = function(func) {
  //TODO: to be tested!
  var newList = new List();
  newList.name = this.name;
  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    newList[i] = func(this[i]);
  }
  return newList.getImproved();
};


/**
 * Removes an element and returns a new list.
 * @param  {NumberList} indexes of elements to remove
 * @return {List}
 * tags:filter
 */
List.prototype.getWithoutElementsAtIndexes = function(indexes) {
  var i;
  var newList;
  var l = this.length;
  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiate(typeOf(this));
  }
  for(i = 0; i < l; i++) {
    if(!indexes.includes(i)) {
      newList.push(this[i]);
    }
  }
  if(this.type == 'List') return newList.getImproved();
  newList.name = this.name;
  return newList;
};

/**
 * Removes an element and returns a new list.
 * @param  {Number} index of element to remove
 * @return {List}
 * tags:filter
 */
List.prototype.getWithoutElementAtIndex = function(index) {
  var newList;
  var l = this.length;

  if(index<0) index+=l;

  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiateWithSameType(this);
  }
  for(var i = 0; i<l; i++) {
    if(i != index) {
      newList.push(this[i]);
    }
  }
  newList.name = this.name;
  if(this.type == 'List') return newList.getImproved();
  return newList;
};

/**
 * Creates a new List without the given element present.
 * If multiple copies of the element exist, only exlcudes first copy.
 *
 * @param {Object} element Element to exclude in the new List.
 * @return {List} new List missing the given element
 * tags:
 */
List.prototype.getWithoutElement = function(element) {
  var index = this.indexOf(element);
  if(index == -1) return this;

  var newList;

  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiateWithSameType(this);
  }

  newList.name = this.name;

  var i;
  var l = this.length;
  for(i = 0; i<l; i++) {
    if(i != index) newList.push(this[i]);
  }

  if(this.type == 'List') return newList.getImproved();
  return newList;
};

/**
 * removes elements from a list
 * @param {List} list with elements to be removed
 * @return {List} new List missing the given elements
 * tags:
*/
List.prototype.getWithoutElements = function(list) {//TODO: more efficiency with dictionary
  var newList;
  var i;
  var l = this.length;
  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiateWithSameType(this);
  }

  var booleanDictionary = ListOperators.getBooleanDictionaryForList(list);

  for(i = 0; i<l; i++) {
    //if(list.indexOf(this[i]) == -1) {
    if(!booleanDictionary[this[i]]) {
      newList.push(this[i]);//@todo: solve NodeList case
    }
  }
  newList.name = this.name;
  if(this.type == 'List') return newList.getImproved();
  return newList;
};


/**
 * Returns subset of List where true is returned from given function that is executed on each element in the List.
 * @param {Function} func Function to run on each element. If the function returns true, the element is maintained in thereturned List.
 * @return {List} filtered list
 * tags:
 */
List.prototype.getFilteredByFunction = function(func) {
  var newList = instantiateWithSameType(this);
  var l = this.length;
  for(var i = 0; i<l; i++) {
    if(func(this[i])) {
      newList.push(this[i]);
    }
  }
  newList.name = this.name;
  if(this.type == 'List') return newList.getImproved();
  return newList;
};



/**
 * returns a list with new added elements
 *
 * @param {Object} element0
 * @param {Object} element1
 * @param {Object} element2
 * @param {Object} element3
 * @param {Object} element4
 * @param {Object} element5
 * @param {Object} element6
 * @param {Object} element7
 * @param {Object} element8
 * @param {Object} element9
 * @return {List}
 * tags:
 */
List.prototype.addElements = function(element0, element1, element2, element3, element4, element5, element6, element7, element8, element9) {
  var array = [];

  if(element0!=null) array.push(element0);
  if(element1!=null) array.push(element1);
  if(element2!=null) array.push(element2);
  if(element3!=null) array.push(element3);
  if(element4!=null) array.push(element4);
  if(element5!=null) array.push(element5);
  if(element6!=null) array.push(element6);
  if(element7!=null) array.push(element7);
  if(element8!=null) array.push(element8);
  if(element9!=null) array.push(element9);

  var newList = List.fromArray(this.concat(array)).getImproved();
  newList.name = this.name;

  return newList;
};


List.prototype.concat = function() {//fix this
  if(arguments[0] == null) return this;

  if(arguments[0].type == this.type) {//var type = … / switch/case
    if(this.type == "Table") {
      return Table.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "NumberList") {
      return NumberList.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "StringList") {
      return StringList.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "DateList") {
      return DateList.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "Table") {
      return Table.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "NumberTable") {
      return NumberTable.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "NodeList"){
      var newList = this.clone();
      var args = arguments[0];
      var i;
      var l = args.length;
      for(i=0; i<l; i++){
        newList.addNode(args[i]);
      }
      return newList;
    }
  }
  return List.fromArray(this._concat.apply(this, arguments)).getImproved();
};


/**
 * Converts the List into a NumberList
 * @return {NumberList}
 * tags:conversion
 */
List.prototype.toNumberList = function() {


  var numberList = new NumberList();
  var l = this.length;
  var i;

  numberList.name = this.name;

  for(i = 0; i<l; i++) {
    numberList[i] = Number(this[i]);
  }
  return numberList;
};

/**
 * Converts the List into a StringList
 * @return {StringList}
 * tags:conversion
 */
List.prototype.toStringList = function() {
  var l = this.length;
  var i;
  var stringList = new StringList();

  stringList.name = this.name;
  for(i = 0; i<l; i++) {
    stringList[i] = String(this[i]);
    // if(typeof this[i] == 'number') {
    //   stringList[i] = String(this[i]);
    // } else {
    //   stringList[i] = this[i].toString();
    // }
  }
  return stringList;
};



////transformations

List.prototype.pushIfUnique = function(element) {
  if(this.includes(element)) return;
  this.push(element);
};

List.prototype.removeElements = function(elements) { //TODO: make it more efficient (avoiding the splice method)
  var i;
  var dictionary = {};
  var l = this.length;
  var nElements = elements.length;

  for(i=0; i<nElements; i++){
    dictionary[elements[i]] = true;
  }

  for(i = 0; i<l; i++) {
    if(dictionary[this[i]]) {
      this.splice(i, 1);
      i--;
    }
  }
};

List.prototype.removeElement = function(element) {
  var index = this.indexOf(element);
  if(index != -1) this.splice(index, 1);
};

List.prototype.removeElementAtIndex = function(index) { //deprecated
  this.splice(index, 1);
};

List.prototype.removeElementsAtIndexes = function(indexes) {
  indexes = indexes.sort(function(a, b) {
    return a - b;
  });

  for(var i = 0; indexes[i] != null; i++) {
    this.splice(indexes[i] - i, 1);
  }
};

List.prototype.removeRepetitions = function() {
  var l = this.length;
  for(var i = 0; i<l; i++) {
    if(this.indexOf(this[i], i + 1) != -1) {
      this.splice(i, 1);
    }
  }
};

List.prototype.replace = function(elementToFind, elementToInsert) {
  var l = this.length;
  for(var i = 0; i < l; i++) {
    if(this[i] == elementToFind) this[i] = elementToInsert;
  }
};

/**
 * assign value to property name on all elements [!] transformative
 * @param  {StringList} names
 * @return {List} same list transformed
 * tags:transform
 */
List.prototype.assignNames = function(names) {
  if(names == null) return this;
  var n = names.length;
  var l = this.length;
  var i;

  for(i=0; i<l; i++){
    this[i].name = names[i % n];
  }

  return this;
};

/**
 * assign values to a given property [!] transformative
 * @param {String} propertyName property name
 * @param {List} values
 * @return {List} same list transformed
 * tags:transform
 */
List.prototype.assignPropertyValues = function(propertyName, values) {
  if(propertyName == null || values==null) return this;

  var n = values.length;
  var l = this.length;
  var i;

  for(i=0; i<l; i++){
    this[i][propertyName] = values[i % n];
  }

  return this;
};


List.prototype.splice = function() { //TODO: replace
  switch(this.type) {
    case 'NumberList':
      return NumberList.fromArray(this._splice.apply(this, arguments));
    case 'StringList':
      return StringList.fromArray(this._splice.apply(this, arguments));
    case 'NodeList':
      return NodeList.fromArray(this._splice.apply(this, arguments));
    case 'DateList':
      return DateList.fromArray(this._splice.apply(this, arguments));
  }
  return List.fromArray(this._splice.apply(this, arguments)).getImproved();
};

List.prototype.destroy = function() {
  var l = this.length;
  for(var i = 0; i<l; i++) {
    delete this[i];
  }
};
