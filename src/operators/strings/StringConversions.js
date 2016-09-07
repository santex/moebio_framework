

/**
 * @classdesc  String Conversions
 *
 * @namespace
 * @category strings
 */
function StringConversions() {}
export default StringConversions;



/**
 * converts a string in json format into an Object (JSON.parse(string))
 * @param  {String} string in format json
 * @return {Object}
 * tags:conversion
 */
StringConversions.stringToObject = function(string) {
  try {
    return JSON.parse(string);
  } catch(err) {
    // fall through and try some common quasi-json formats
  }
  if(string == null) return null;
  // often we have a list of objects on separate lines without enclosing [] or commas between
  var aObjs = string.split(/\r?\n/);
  var s='[';
  var sAdded, bAddedItem = false;
  for(var i = 0; i<aObjs.length; i++){
    if(aObjs[i].trim().length == 0) continue;
    if(aObjs[i] == '{'){
      // assume each object definition spread across multiple lines
      sAdded = '';
      while(aObjs[i] != '}' && i < aObjs.length){
        sAdded += ' ' + aObjs[i];
        i++;
      }
      sAdded += '}';
    }
    else
      sAdded = aObjs[i];
    sAdded = (bAddedItem ? ',\r\n' : '\r\n') + sAdded;
    bAddedItem = true;
    s += sAdded;
  }
  s += '\r\n]';
  try {
    return JSON.parse(s);
  } catch(err) {
    return null;
  }
};
