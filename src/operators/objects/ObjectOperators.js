import StringList from "src/dataTypes/strings/StringList";
import List from "src/dataTypes/lists/List";
import Table from "src/dataTypes/lists/Table";
import { typeOf } from "src/tools/utils/code/ClassUtils";
import Point from "src/dataTypes/geometry/Point";
import Point3D from "src/dataTypes/geometry/Point3D";
import Polygon from "src/dataTypes/geometry/Polygon";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import Interval from "src/dataTypes/numeric/Interval";
import DateInterval from "src/dataTypes/dates/DateInterval";
import DateOperators from "src/operators/dates/DateOperators";
import NumberList from "src/dataTypes/numeric/NumberList";
import ObjectConversions from "src/operators/objects/ObjectConversions";
import ListOperators from "src/operators/lists/ListOperators";
import TableOperators from "src/operators/lists/TableOperators";
import PointOperators from "src/operators/geometry/PointOperators";
import NumberTableOperators from "src/operators/numeric/numberTable/NumberTableOperators";

/**
 * @classdesc  Object Operators
 *
 * @namespace
 * @category basics
 */
function ObjectOperators() {}
export default ObjectOperators;

/**
 * identity function
 * @param  {Object} object
 * @return {Object}
 * tags:special
 */
ObjectOperators.identity = function(object) {
  return object;
};

/**
 * clones the object removing functions, so it could be passed on postMessage (sending data to external modules) or received by webWorkers (optionally used in JSBox)
 * @param  {Object} object
 * @return {Object}
 */
ObjectOperators.serliazeObject = function(object){
  if(object==null) return null;
  // console.log('                     ObjectOperators.serliazeObject | object:',object);
  // console.log('                     ObjectOperators.serliazeObject | object[isTable]:',object["isTable"]);
  // console.log('                     ObjectOperators.serliazeObject | object[isList]:',object["isList"]);

  var newObject;
  var l;
  var i;

  if(object["isTable"]) {
    // console.log('\n-------------------------------serializaing table:', object);
    newObject = object.toArray();
    l = object.length;
    for(i=0; i<l; i++){
      newObject[i] = ObjectOperators.serliazeObject(object[i]);
      // console.log('     ------newObject[i]', newObject[i]);
    }
    // console.log('------ serialized table:', newObject);
    return newObject;
  }

  if(object["isList"]) return object.toArray();

  return object;
};

ObjectOperators.serliazeObjectsInArray = function(array){
  if(array==null) return null;

  var newArray = [];
  var l = array.length;
  var i;
  for(i=0; i<l; i++){
    newArray[i] = ObjectOperators.serliazeObject(array[i]);
  }
  return newArray;
};


/**
 * returns an Interval with min and max values from object
 * @param  {Object} object
 * @return {Interval}
 * tags:
 */
ObjectOperators.getInterval = function(object){
  if(object==null) return;

  if(object.getInterval!=null) return object.getInterval();
};


/**
 * return rich information about abject (currently working with List and Table)
 * @param  {Object} object
 * @return {Object}
 * tags:
 */
ObjectOperators.buildInformationObject = function(object) {
  if(object==null) return null;
  
  var infoObject;
  if(object.isTable){
    infoObject = TableOperators.buildInformationObject(object);
  } else if(object.isList){
    infoObject = ListOperators.buildInformationObject(object);
  } else if(object["buildInformationObject"]) {
    infoObject = object.buildInformationObject;
  }

  if(infoObject==null) return null;

  infoObject.objectType = infoObject.type;
  infoObject.type = null;
  return infoObject;
};

/**
 * builds a string report of the object, with detailed information about its structure and contents
 * @param  {Object} object
 * @return {String}
 * tags:special
 */
ObjectOperators.getReport = function(object) {
  if(object == null) return null;

  if(object.getReport) return object.getReport();

  var type = typeOf(object);

  switch(type){
    case 'Table':
      return TableOperators.getReport(object);
    case 'List':
      return ListOperators.getReport(object);
  }

  if(object.isTable) return TableOperators.getReport(object);
  if(object.isList) return ListOperators.getReport(object);


  var text = "///////////report of instance of Object//////////";
  if(object.name) text += "name: "+object.name;

  var string = ObjectConversions.objectToString(object);

  if(string.length < 2000) {
    text += "\n" + string;
    return text;
  }

  var propertyNames = new StringList();
  for(var propName in object) {
    propertyNames.push(propName);
  }

  if(propertyNames.length < 100) {
    text += "\nproperties: " + propertyNames.join(", ");
  } else {
    text += "\nfirst 100 properties: " + propertyNames.slice(0, 100).join(", ");
  }

  return text;
};




/**
 * builds an html report of the object, with detailed information about its structure and contents
 * @param  {Object} object
 * @return {String}
 * tags:special
 */
ObjectOperators.getReportHtml = function(object) {
  if(object == null) return null;

  if(object.getReportHtml) return object.getReportHtml();

  var type = typeOf(object);

  switch(type){
    case 'Table':
      return TableOperators.getReportHtml(object);
    case 'List':
      return ListOperators.getReportHtml(object);
  }

  if(object.isTable) return TableOperators.getReportHtml(object);
  if(object.isList) return ListOperators.getReportHtml(object);

  var text = "<fs18>report of instance of Object</f>";

  text += ObjectOperators.getReportHtml(object);
  //if(object.name) text += "name: "+object.name;

  return text;
};

/**
 * return a string characterizing the object by the properties inside it
 * @param {Object} object
 * @return {String} string representing properties of the object
 * tags:
 */
ObjectOperators.getObjectStructure = function(object){
  var objSkeleton = ObjectOperators.replaceValuesByNull(object);
  return ObjectConversions.objectToString(objSkeleton);
};

/**
 * return an instance of the object with values replaced by null (recursive)
 * @param {Object} object
 * @return {Object} object with properties set to null
 * tags:
 */
ObjectOperators.replaceValuesByNull = function(object){
  var oNew = {};
  for (var i in object) {
    if (object.hasOwnProperty(i)) {
      if(typeof object[i] == "object" && object[i]!= null){
        oNew[i] = ObjectOperators.replaceValuesByNull(object[i]);
        continue;
      }
      // replace all values with null
      oNew[i] = null;
    }
  }
  return oNew;
};

/**
 * return length of list, string or Object with length property
 * @param {Object} object with length property
 * @return {Number} length of number
 * tags:
 */
ObjectOperators.getLength = function(object){
  if(object==null || object["length"]==null) return;
  return object.length;
};


/**
 * uses a boolean to decide which of two objects it returns
 * @param  {Boolean} boolean
 * @param  {Object} object0 returned if boolean is true
 * @param  {Object} object1 returned if boolean is false
 * @return {Object}
 * tags:
 */
ObjectOperators.booleanGate = function(boolean, object0, object1) {
  return boolean ? object0 : object1;
};

/**
 * return a property value from its name
 * @param  {Object} object
 * @param  {String} property_value
 * @return {Object}
 * tags:
 */
ObjectOperators.getPropertyValue = function(object, property_name) {
  if(object == null) return;

  return object == null ? null : object[property_name];
};

/**
 * return true if property value exists in object
 * @param  {Object} object
 * @param  {String} property_value
 * @return {Boolean}
 * tags:
 */
ObjectOperators.isPropertyValue = function(object, property_value) {
  if(object == null) return false;
  for (var property in object) {
    if(object[property] === property_value)
      return true;
  }
  return false;
};

/**
 * return a a stringList of property names
 * @param  {Object} object
 * @return {StringList}
 * tags:
 */
ObjectOperators.getPropertiesNames = function(object) {
  if(object == null) return;

  return StringList.fromArray(Object.getOwnPropertyNames(object));
};

/**
 * return a table with a stringList of property names and a list of respective values
 * @param  {Object} object
 * @return {Table}
 * tags:
 */
ObjectOperators.getPropertiesNamesAndValues = function(object) {
  if(object == null) return;

  var table = new Table();

  table[0] = ObjectOperators.getPropertiesNames(object);
  table[1] = new List();

  table[0].forEach(function(value, i) {
    table[1][i] = object[value];
  });

  table[1] = table[1].getImproved();

  return table;
};

/**
 * assigns a value to a property in the object ([!] this method is transformative)
 * @param  {Object} object
 * @param  {String} property_name
 * @param  {String} property_value
 * @return {Object}
 * tags:transformative
 */
ObjectOperators.setPropertyValue = function(object, property_name, property_value) {
  if(object == null) return;

  object[property_name] = property_value;

  return object;
};


/**
 * interpolates two different objects of the same type<br>currently working with numbers, intervals, numberLists, and polygons
 * @param  {Object} object0
 * @param  {Object} object1
 *
 * @param  {Number} value typically in range [0,1], defaults to 0.5
 * @param {Number} minDistance if objects are close enough, it delivers the orginal object
 * @return {Object}
 * tags:
 */
ObjectOperators.interpolateObjects = function(object0, object1, value, minDistance) {
  var type = typeOf(object0);
  var i;
  if(type != typeOf(object1)) return object0;

  value = value == null ? 0.5 : value;
  var antivalue = 1 - value;

  switch(type) {
    case 'number':
      if(minDistance && Math.abs(object0 - object1) <= minDistance) return object0;
      return antivalue * object0 + value * object1;
    case 'Interval':
      if(minDistance && (Math.abs(object0.x - object1.x) + Math.abs(object0.y - object1.y)) <= minDistance) return object0;
      return new Interval(antivalue * object0.x + value * object1.x, antivalue * object0.y + value * object1.y);
    case 'NumberList':
      if(minDistance && Math.abs(object0.subtract(object1).getSum()) <= minDistance) return object0;
      var minL = Math.min(object0.length, object1.length);
      var newNumberList = new NumberList();
      for(i = 0; i < minL; i++) {
        newNumberList[i] = antivalue * object0[i] + value * object1[i];
      }
      return newNumberList;
    case 'Polygon':
      var minL = Math.min(object0.length, object1.length);
      var newPolygon = new Polygon();
      for(i = 0; i < minL; i++) {
        newPolygon[i] = PointOperators.twoPointsInterpolation(object0[i],object1[i],value);
      }
      return newPolygon;
  }
  return null;
};


// ObjectOperators.fusionObjects = function(object, objectToFusion){

// }

/**
 * replaces an object by another if it matches the obectToReplace
 * @param  {Object} object to be replaced if equals to obectToReplace
 * @param  {Object} obectToReplace object to check
 * @param  {Object} objectToPlace to be delivered instead of given object (in case the object matches obectToReplace)
 * @return {Object} original object or replaced object
 * tags:
 */
ObjectOperators.replaceObject = function(object, obectToReplace, objectToPlace) {
  return object == obectToReplace ? objectToPlace : object;
};


/**
 * create an improved list from an Array
 * @param  {Array} array
 * @return {List}
 * tags:conversion
 */
ObjectOperators.toList = function(array) {
  return List.fromArray(array).getImproved();
};


/**
 * applies Math.floor operator to any numeric object
 * @param  {Object} number, numberList…
 * @return {Object}
 * tags:
 */
ObjectOperators.floor = function(object){
  if(typeof object == 'number') return Math.floor(object);
  if(object.floor) return object.floor();
  return null;
};


/////universal operators



//////unibersal algebra


/**
 * adds two or more objects, addition is performed according to the different types
 * @param {Object} object0
 *
 * @param {Object} object1
 * @param {Object} object2
 * @param {Object} object3
 * @param {Object} object4
 * @param {Object} object5
 * @return {Object}
 * tags:math
 */
ObjectOperators.addition = function() {
  //console.log("addition__________________________________arguments:", arguments);
  var result;
  var i;
  if(arguments.length < 2) {
    if(arguments.length == 1 && arguments[0] != null && arguments[0].isList) {
      result = arguments[0][0];
      for(i = 1; arguments[0][i] != null; i++) {
        result = ObjectOperators.addition(result, arguments[0][i]);
      }
      return result;
    }
    return null;
  }

  if(arguments.length == 2) {
    if(arguments[0] != null && arguments[0].isList && arguments[1] != null && arguments[1].isList) {
      return ObjectOperators._applyBinaryOperatorOnLists(arguments[0], arguments[1], ObjectOperators.addition);
    } else if(arguments[0] != null && arguments[0].isList) {
      //console.log('list versus object');
      return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], ObjectOperators.addition);
    } else if(arguments[1] != null && arguments[1].isList) {
      //console.log('object versus list');
      return ObjectOperators._applyBinaryOperatorOnObjectWithList(arguments[0], arguments[1], ObjectOperators.addition);
    }

    var a0 = arguments[0];
    var a1 = arguments[1];
    var a0Type = typeOf(a0);
    var a1Type = typeOf(a1);
    //console.log('ObjectOperators.addition, a0Type, a1Type:['+a0Type, a1Type+']');
    var reversed = false;

    if(a1Type < a0Type && a1Type != "string" && a0Type != "string") {
      a0 = arguments[1];
      a1 = arguments[0];
      a0Type = typeOf(a0);
      a1Type = typeOf(a1);
      reversed = true;
    }

    var pairType = a0Type + "_" + a1Type;
    //console.log('ObjectOperators.addition, pairType:['+pairType+']');
    //
    switch(pairType) {
      case 'boolean_boolean':
        return a0 && a1;
      case 'date_string':
        return reversed ? a1 + DateOperators.dateToString(a0) : DateOperators.dateToString(a0) + a1;
      case 'number_string':
      case 'string_string':
      case 'string_number':
      case 'boolean_number':
      case 'number_number':
        return a0 + a1;
      case 'Point_Point':
        return new Point(a0.x + a1.x, a0.y + a1.y);
      case 'Point3D_Point3D':
        return new Point3D(a0.x + a1.x, a0.y + a1.y, a0.z + a1.z);
      case 'number_Point':
        return new Point(a0.x + a1, a0.y + a1);
      case 'number_Point3D':
        return new Point3D(a0.x + a1, a0.y + a1, a0.z + a1);
      case 'Interval_number':
        return new Interval(a0.x + a1, a0.y + a1);
      case 'Interval_Point':
        return new Point(a0.getMin() + a1.x, a0.getMax() + a1.y);
      case 'Interval_Interval':
        return new Point(a0.getMin() + a1.getMin(), a0.getMax() + a1.getMax());
      case 'Point_Rectangle':
        return new Rectangle(a0.x + a1.x, a0.y + a1.y, a1.width, a1.height);
      case 'Interval_Rectangle':
        return new Rectangle(a0.getMin() + a1.x, a0.getMax() + a1.y, a1.width, a1.height);
      case 'Rectangle_Rectangle':
        return new Rectangle(a0.x + a1.x, a0.y + a1.y, a0.width + a1.width, a0.height + a1.height);
      case 'date_number':
        return new Date(a0.getTime() + (a1 / DateOperators.millisecondsToDays));
      case 'date_date':
        return new Date(Number(a0.getTime() + a1.getTime())); //?
      case 'date_DateInterval':
        return new DateInterval(ObjectOperators.addition(a0, a1.date0), ObjectOperators.addition(a0, a1.date1));
      case 'DateInterval_number':
        return new DateInterval(ObjectOperators.addition(a0.date0, a1), ObjectOperators.addition(a0.date1, a1));
      case 'DateInterval_Interval':
        return new DateInterval(ObjectOperators.addition(a0.date0, a1.min), ObjectOperators.addition(a0.date1, a1.max));
      case 'DateInterval_DateInterval':
        return new DateInterval(ObjectOperators.addition(a0.date0, a1.date0), ObjectOperators.addition(a0.date1, a1.date1));
      case 'string_StringList':
        return a1.append(a0, false);
      case 'StringList_string':
        return a1.append(a0, true);
      default:
        console.log("[!] addition didn't manage to resolve:", pairType, a0 + a1);
        return null;

    }
    return a0 + a1;

  }

  result = arguments[0];
  for(i = 1; i < arguments.length; i++) {
    //console.log(i, 'result:', result);
    result = ObjectOperators.addition(result, arguments[i]);
  }
  return result;
};


/**
 * multiplies two or more objects, multiplication is performed according to the different types
 * @param {Object} object0
 *
 * @param {Object} object1
 * @param {Object} object2
 * @param {Object} object3
 * @param {Object} object4
 * @param {Object} object5
 * @return {Object}
 * tags:math
 */
ObjectOperators.multiplication = function() {
  //console.log("multiplication__________________________________arguments:", arguments);
  var result;
  var i;
  if(arguments.length < 2) {
    if(arguments.length == 1 && arguments[0].isList) {
      result = arguments[0][0];
      for(i = 1; arguments[0][i] != null; i++) {
        result = ObjectOperators.multiplication(result, arguments[0][i]);
      }
      return result;
    }
    return null;
  }

  var a0 = arguments[0];
  var a1 = arguments[1];
  var a0Type = typeOf(a0);
  var a1Type = typeOf(a1);
  var pairType = a0Type + "_" + a1Type;

  //c.log('pairType:['+pairType+']');

  if(arguments.length == 2) {
    if(arguments[0] == null) return null;

    if(pairType=='NumberTable_NumberTable') return NumberTableOperators.product(a0, a1);

    if(arguments[0].isList && arguments[1].isList) {
      return ObjectOperators._applyBinaryOperatorOnLists(arguments[0], arguments[1], ObjectOperators.multiplication);
    } else if(arguments[0].isList) {
      //console.log('list versus object');
      return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], ObjectOperators.multiplication);
    } else if(arguments[1].isList) {
      return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[1], arguments[0], ObjectOperators.multiplication);
    }

    if(a1Type < a0Type){
      a0 = arguments[1];
      a1 = arguments[0];
      a0Type = typeOf(a0);
      a1Type = typeOf(a1);
    }

    pairType = a0Type + "_" + a1Type;
    //console.log('pairType:['+pairType+']');

    //
    switch(pairType) {
      case 'number_number':
      case 'boolean_boolean':
      case 'boolean_number':
      case 'Date_string':
      case 'number_string':
      case 'string_string':
        return a0 * a1; //todo: what to do with strings?
      case 'Point_Point':
        return new Point(a0.x * a1.x, a0.y * a1.y);
      case 'Point3D_Point3D':
        return new Point3D(a0.x * a1.x, a0.y * a1.y, a0.z * a1.z);
      case 'number_Point':
        return new Point(a0.x * a1, a0.y * a1);
      case 'number_Point3D':
        return new Point3D(a0.x * a1, a0.y * a1, a0.z * a1);
      case 'Interval_number':
        return new Interval(a0.getMin() * a1, a0.getMax() * a1);
      case 'Interval_Point':
        return new Point(a0.getMin() * a1.x, a0.getMax() * a1.y);
      case 'Interval_Interval':
        return new Point(a0.getMin() + a1.getMin(), a0.getMax() + a1.getMax());
      case 'Point_Rectangle':
        return new Rectangle(a0.x * a1.x, a0.y * a1.y, a1.width, a1.height); //todo: no
      case 'Interval_Rectangle':
        return new Rectangle(a0.getMin() * a1.x, a0.getMax() * a1.y, a1.width, a1.height); //todo: no
      case 'Rectangle_Rectangle':
        return new Rectangle(a0.x * a1.x, a0.y * a1.y, a0.width * a1.width, a0.height * a1.height);
      case 'date_number':
        return new Date(a0.getTime() * (a1 / DateOperators.millisecondsToDays));
      case 'date_date':
        return new Date(Number(a0.getTime() + a1.getTime())); //todo: ???
      case 'date_DateInterval':
        return new DateInterval(ObjectOperators.multiplication(a0, a1.date0), ObjectOperators.multiplication(a0, a1.date1)); //todo: ???
      case 'DateInterval_number':
        return new DateInterval(ObjectOperators.multiplication(a0.date0, a1), ObjectOperators.multiplication(a0.date1, a1)); //todo: ???
      case 'DateInterval_Interval':
        return new DateInterval(ObjectOperators.multiplication(a0.date0, a1.min), ObjectOperators.multiplication(a0.date1, a1.max)); //todo: ???
      case 'DateInterval_DateInterval':
        return new DateInterval(ObjectOperators.multiplication(a0.date0, a1.date0), ObjectOperators.multiplication(a0.date1, a1.date1)); //todo: ???
      default:
        console.log("[!] multiplication didn't manage to resolve:", pairType, a0 * a1);
        return null;

    }
    return a0 * a1;
  }

  result = arguments[0];
  for(i = 1; i < arguments.length; i++) {
    //console.log(i, 'result:', result);
    result = ObjectOperators.multiplication(result, arguments[i]);
  }
  return result;
};

/**
 * divides two or more objects, division is performed according to the different types
 * @param {Object} object0
 *
 * @param {Object} object1
 * @param {Object} object2
 * @param {Object} object3
 * @param {Object} object4
 * @param {Object} object5
 * @return {Object}
 * tags:math
 */
ObjectOperators.division = function() {    
  var result;
  var i;
  if(arguments.length < 2) {
    if(arguments.length == 1 && arguments[0] && arguments[0].isList) {
      result = arguments[0][0];
      for(i = 1; arguments[0][i] != null; i++) {
        result = ObjectOperators.division(result, arguments[0][i]);
      }
      return result;
    }
    return null;
  }
  if(arguments.length == 2) {
    if(arguments[0] != null && arguments[0].isList && arguments[1] != null && arguments[1].isList) {
      return ObjectOperators._applyBinaryOperatorOnLists(arguments[0], arguments[1], ObjectOperators.division);
    } else if(arguments[0] != null && arguments[0].isList) {
      //console.log('list versus object');
      return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], ObjectOperators.division);
    } else if(arguments[1] != null && arguments[1].isList) {
      return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[1], arguments[0], ObjectOperators.division);
    }

    var a0 = arguments[0];
    var a1 = arguments[1];
    var a0Type = typeOf(a0);
    var a1Type = typeOf(a1);

    if(a1Type < a0Type) {
      a0 = arguments[1];
      a1 = arguments[0];
      a0Type = typeOf(a0);
      a1Type = typeOf(a1);
    }

    var pairType = a0Type + "_" + a1Type;
    //console.log('pairType:['+pairType+']');
    //
    switch(pairType) {
      case 'number_number':
      case 'boolean_boolean':
      case 'boolean_number':
      case 'Date_string':
      case 'number_string':
      case 'string_string':
        return a0 / a1; //todo: what to do with strings?
      case 'Point_Point':
        return new Point(a0.x / a1.x, a0.y / a1.y);
      case 'Point3D_Point3D':
        return new Point3D(a0.x / a1.x, a0.y / a1.y, a0.z / a1.z);
      case 'number_Point':
        return new Point(a0.x / a1, a0.y / a1);
      case 'number_Point3D':
        return new Point3D(a0.x / a1, a0.y / a1, a0.z / a1);
      case 'Interval_number':
        return new Interval(a0.getMin() / a1, a0.getMax() / a1);
      case 'Interval_Point':
        return new Point(a0.getMin() / a1.x, a0.getMax() / a1.y);
      case 'Interval_Interval':
        return new Point(a0.getMin() + a1.getMin(), a0.getMax() + a1.getMax());
      case 'Point_Rectangle':
        return new Rectangle(a0.x / a1.x, a0.y / a1.y, a1.width, a1.height); //todo: no
      case 'Interval_Rectangle':
        return new Rectangle(a0.getMin() / a1.x, a0.getMax() / a1.y, a1.width, a1.height); //todo: no
      case 'Rectangle_Rectangle':
        return new Rectangle(a0.x / a1.x, a0.y / a1.y, a0.width / a1.width, a0.height / a1.height);
      case 'date_number':
        return new Date(a0.getTime() / (a1 / DateOperators.millisecondsToDays));
      case 'date_date':
        return new Date(Number(a0.getTime() + a1.getTime())); //todo: ???
      case 'date_DateInterval':
        return new DateInterval(ObjectOperators.division(a0, a1.date0), ObjectOperators.division(a0, a1.date1)); //todo: ???
      case 'DateInterval_number':
        return new DateInterval(ObjectOperators.division(a0.date0, a1), ObjectOperators.division(a0.date1, a1)); //todo: ???
      case 'DateInterval_Interval':
        return new DateInterval(ObjectOperators.division(a0.date0, a1.min), ObjectOperators.division(a0.date1, a1.max)); //todo: ???
      case 'DateInterval_DateInterval':
        return new DateInterval(ObjectOperators.division(a0.date0, a1.date0), ObjectOperators.division(a0.date1, a1.date1)); //todo: ???
      default:
        console.log("[!] division didn't manage to resolve:", pairType, a0 / a1);
        return null;

    }
    return a0 / a1;
  }

  result = arguments[0];
  for(i = 1; i < arguments.length; i++) {
    //console.log(i, 'result:', result);
    result = ObjectOperators.division(result, arguments[i]);
  }
  return result;
};





//removed, added an approach method in NumberList and Polygon

/**
 * modifies and object, making it closer to another (convergent asymptotic vector aka destiny) object, objects need to be vectors
 * @param  {Object} objectToModify object that will be modified
 * @param  {Object} objectDestiny  object guide (convergent asymptotic vector)
 * @param  {Number} speed speed of convergence
 */
// ObjectOperators.approach = function(objectToModify, objectDestiny, speed){
// 	var type = typeOf(objectToModify);
// 	if(type!=typeOf(objectDestiny)) return null;
// 	speed = speed||0.5;
// 	var antispeed = 1-speed;

// 	switch(type){
// 		case "NumberList":
// 			objectToModify.forEach(function(n, i){objectToModify[i] = antispeed*objectToModify[i] + speed*objectDestiny[i];});
// 			break;
// 	}
// }





ObjectOperators._applyBinaryOperatorOnLists = function(list0, list1, operator) {
  var n = Math.min(list0.length, list1.length);
  var i;
  var resultList = new List();
  for(i = 0; i < n; i++) {
    resultList.push(ObjectOperators._applyBinaryOperator(list0[i], list1[i], operator));
  }
  return resultList.getImproved();
};
ObjectOperators._applyBinaryOperatorOnListWithObject = function(list, object, operator) {
  var i;
  var resultList = new List();
  for(i = 0; i < list.length; i++) {
    resultList.push(ObjectOperators._applyBinaryOperator(list[i], object, operator));
  }
  return resultList.getImproved();
};
ObjectOperators._applyBinaryOperatorOnObjectWithList = function(object, list, operator) {
  var i;
  var resultList = new List();
  for(i = 0; i < list.length; i++) {
    resultList.push(ObjectOperators._applyBinaryOperator(object, list[i], operator));
  }
  return resultList.getImproved();
};
ObjectOperators._applyBinaryOperator = function(object0, object1, operator) {
  return operator(object0, object1);
};
