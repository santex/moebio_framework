import { version } from "src/Version";
import MD5 from "src/tools/utils/strings/MD5";
import NetworkEncodings from "src/operators/structures/NetworkEncodings";
import { typeOf } from "src/tools/utils/code/ClassUtils";

//data models info
export var dataModelsInfo = [
  {
    type:"Null",
    short:"Ø",
    category:"object",
    level:"0",
    write:"true",
    inherits:null,
    comments:"javascript null object",
    color:"#ffffff"
  },
  {
    type:"Object",
    short:"{}",
    category:"object",
    level:"0",
    write:"true",
    inherits:null,
    to:"String",
    comments:"javascript Object",
    color:"#C0BFBF"
  },
  {
    type:"Function",
    short:"F",
    category:"object",
    level:"0",
    inherits:null,
    comments:"javascript Function",
    color:"#C0BFBF"
  },  {
    type:"Boolean",
    short:"b",
    category:"boolean",
    level:"0",
    write:"true",
    inherits:null,
    to:"Number",
    comments:"javascript Boolean object (true/false)",
    color:"#4F60AB"
  },
  {
    type:"Number",
    short:"#",
    category:"numeric",
    level:"0",
    write:"true",
    inherits:null,
    to:"String",
    comments:"javascript number object",
    color:"#5DA1D8"
  },
  {
    type:"Interval",
    short:"##",
    category:"numeric",
    level:"0.5",
    write:"true",
    inherits:"Point",
    to:"Point",
    contains:"Number",
    comments:"an Interval has x and y properties",
    color:"#386080"
  },
  {
    type:"Array",
    short:"[]",
    category:"object",
    level:"1",
    inherits:null,
    to:"List",
    contains:"Object,Null",
    comments:"javascript Array object",
    color:"#80807F"
  },
  {
    type:"List",
    short:"L",
    category:"lists",
    level:"1",
    inherits:"Array",
    contains:"Object",
    comments:"A List is an Array that doesn't contain nulls, and with enhanced functionalities",
    color:"#80807F"
  },
  {
    type:"Table",
    short:"T",
    category:"lists",
    level:"2",
    inherits:"List",
    contains:"List",
    comments:"A Table is a List of Lists",
    color:"#80807F"
  },
  {
    type:"BooleanList",
    short:"bL",
    category:"boolean",
    level:"1",
    inherits:"List",
    to:"NumberList",
    contains:"Boolean",
    comments:"List of Booleans",
    color:"#3A4780"
  },
  {
    type:"NumberList",
    short:"#L",
    category:"numeric",
    level:"1",
    write:"true",
    inherits:"List",
    to:"StringList",
    contains:"Number",
    comments:"List of Numbers",
    color:"#386080"
  },
  {
    type:"IntervalList",
    short:"##L",
    category:"numeric",
    level:"1",
    write:"true",
    inherits:"List",
    to:"StringList",
    contains:"Interval",
    comments:"List of Intervals",
    color:"#386080"
  },
  {
    type:"NumberTable",
    short:"#T",
    category:"numeric",
    level:"2",
    write:"true",
    inherits:"Table",
    to:"Network",
    contains:"NumberList",
    comments:"Table with NumberLists",
    color:"#386080"
  },
  {
    type:"String",
    short:"s",
    category:"strings",
    level:"0",
    write:"true",
    inherits:null,
    comments:"javascript String object",
    color:"#8BC63F"
  },
  {
    type:"StringList",
    short:"sL",
    category:"strings",
    level:"1",
    write:"true",
    inherits:"List",
    contains:"String",
    comments:"List of strings",
    color:"#5A8039"
  },
  {
    type:"StringTable",
    short:"sT",
    category:"strings",
    level:"2",
    inherits:"Table",
    contains:"StringList",
    comments:"Table with StringLists",
    color:"#5A8039"
  },
  {
    type:"Date",
    short:"d",
    category:"dates",
    level:"0.5",
    write:"true",
    inherits:null,
    to:"Number,String",
    comments:"javascript Date object",
    color:"#7AC8A3"
  },
  {
    type:"DateInterval",
    short:"dd",
    category:"dates",
    level:"0.75",
    inherits:null,
    to:"Interval",
    contains:"Date",
    comments:"a DateInterval has an date0 and date1 properties",
    color:"#218052"
  },
  {
    type:"DateList",
    short:"dL",
    category:"dates",
    level:"1.5",
    inherits:"List",
    to:"NumberList,StringList",
    contains:"Date",
    comments:"List of Dates",
    color:"#218052"
  },
  {
    type:"Point",
    short:".",
    category:"geometry",
    level:"0.5",
    write:"true",
    inherits:null,
    to:"Interval",
    contains:"Number",
    comments:"a Point has x and y properties",
    color:"#9D59A4"
  },
  {
    type:"Rectangle",
    short:"t",
    category:"geometry",
    level:"0.5",
    inherits:null,
    to:"Polygon",
    contains:"Number",
    comments:"a Rectangle has x, y, width and height properties",
    color:"#9D59A4"
  },
  {
    type:"Polygon",
    short:".L",
    category:"geometry",
    level:"1.5",
    inherits:"List",
    to:"NumberTable",
    contains:"Point",
    comments:"A Polygon is a List of Points",
    color:"#76297F"
  },
  {
    type:"RectangleList",
    short:"tL",
    category:"geometry",
    level:"1.5",
    inherits:null,
    to:"MultiPolygon",
    contains:"Rectangle",
    comments:"A RectangleList is a List of Rectangles",
    color:"#76297F"
  },
  {
    type:"MultiPolygon",
    short:".T",
    category:"geometry",
    level:"2.5",
    inherits:"Table",
    contains:"Polygon",
    comments:"A MultiPolygon is a List of Polygons",
    color:"#76297F"
  },
  {
    type:"Point3D",
    short:"3",
    category:"geometry",
    level:"0.5",
    write:"true",
    inherits:"Point",
    to:"NumberList",
    contains:"Number",
    comments:"a Point has x, y and z properties",
    color:"#9D59A4"
  },
  {
    type:"Polygon3D",
    short:"3L",
    category:"geometry",
    level:"1.5",
    inherits:"List",
    to:"NumberTable",
    contains:"Point3D",
    comments:"A Polygon3D is a List of Point3D",
    color:"#76297F"
  },
  {
    type:"MultiPolygon3D",
    short:"3T",
    category:"geometry",
    level:"2.5",
    inherits:"Table",
    contains:"Polygon3D",
    comments:"A MultiPolygon3D is a List of Polygon3D",
    color:"#76297F"
  },
  {
    type:"Color",
    short:"c",
    category:"graphic",
    level:"0",
    inherits:null,
    to:"String",
    comments:"a Color is a string that can be interpreted as color",
    color:"#EE4488"
  },
  {
    type:"ColorScale",
    short:"cS",
    category:"graphic",
    level:"0",
    write:"true",
    inherits:"Function",
    comments:"a ColorScale is a Function that receives values between 0 and 1 and returns a Color",
    color:"#802046"
  },
  {
    type:"ColorList",
    short:"cL",
    category:"graphic",
    level:"1",
    write:"true",
    inherits:"List",
    to:"StringList",
    contains:"Color",
    comments:"A ColorList is a List of Colors",
    color:"#802046"
  },
  {
    type:"Image",
    short:"i",
    category:"graphic",
    level:"0",
    inherits:null,
    comments:"javascript Image object",
    color:"#802046"
  },
  {
    type:"ImageList",
    short:"iL",
    category:"graphic",
    level:"1",
    inherits:"List",
    contains:"Image",
    comments:"An ImageList is a List of Images",
    color:"#802046"
  },
  {
    type:"Node",
    short:"n",
    category:"structures/elements",
    level:"0",
    inherits:null,
    comments:"A Node is an Object with properties name, id, toNodeList, fromNodeList among others",
    color:"#FAA542"
  },
  {
    type:"Relation",
    short:"r",
    category:"structures/elements",
    level:"0.5",
    inherits:"Node",
    contains:"Node",
    comments:"A Relation contains node0 and node1 properties",
    color:"#FAA542"
  },
  {
    type:"NodeList",
    short:"nL",
    category:"structures/lists",
    level:"1",
    inherits:"List",
    contains:"Node",
    comments:"A NodeList is a List of Nodes",
    color:"#805522"
  },
  {
    type:"RelationList",
    short:"rL",
    category:"structures/lists",
    level:"1.5",
    inherits:"NodeList",
    contains:"Relation",
    comments:"A RelationList is a List of Relation",
    color:"#805522"
  },
  {
    type:"Network",
    short:"Nt",
    category:"structures/networks",
    level:"2",
    inherits:null,
    to:"Table",
    contains:"NodeList,RelationList",
    comments:"A Network contains a NodeList and a RelationList",
    color:"#805522"
  },
  {
    type:"Tree",
    short:"Tr",
    category:"structures/networks",
    level:"2",
    inherits:"Network",
    to:"Table",
    contains:"NodeList,RelationList",
    comments:"A Tree is a Network whose Nodes contain only one father, except for one Node that has no father",
    color:"#805522"
  }
];



//global constants
export var TwoPi = 2*Math.PI;
export var HalfPi = 0.5*Math.PI;
export var radToGrad = 180/Math.PI;
export var gradToRad = Math.PI/180;

/**
 * @todo write docs
 */
Array.prototype.last = function(){
  return this[this.length-1];
};

window.addEventListener('load', function(){
  console.log('Moebio Framework v' + version);
}, false);


////structures local storage

/**
 * @todo write docs
 */
export function setStructureLocalStorageWithSeed(object, seed, comments){
  setStructureLocalStorage(object, MD5.hex_md5(seed), comments);
}

/**
 * Puts an object into HTML5 local storage. Note that when you 
 * store your object it will be wrapped in an object with the following 
 * structure. This structure can be retrieved later in addition to the base
 * object.
 *  {
 *    id: storage id
 *    type: type of object
 *    comments: user specified comments
 *    date: current time
 *    code: the serialized object
 *  }
 * 
 * @param {Object} object   the object to store
 * @param {String} id       the id to store it with
 * @param {String} comments extra comments to store along with the object.
 */
export function setStructureLocalStorage(object, id, comments){
  var type = typeOf(object);
  var code;

  switch(type){
    case 'string':
      code = object;
      break;
    case 'Network':
      code = NetworkEncodings.encodeGDF(object);
      break;
    default:
      type = 'object';
      code = JSON.stringify(object);
      break;
  }

  var storageObject = {
    id:id,
    type:type,
    comments:comments,
    date:new Date(),
    code:code
  };

  var storageString = JSON.stringify(storageObject);
  localStorage.setItem(id, storageString);
}

/**
 * @todo write docs
 */
export function getStructureLocalStorageFromSeed(seed, returnStorageObject){
  return getStructureLocalStorage(MD5.hex_md5(seed), returnStorageObject);
}

/**
 * Gets a item previously stored in localstorage. @see setStructureLocalStorage
 * You can choose either to retrieve the object that was stored of the wrapper
 * object created when it was stored.
 * 
 * @param  {String} id id of object to lookup
 * @param  {boolean} returnStorageObject return the wrapper object instead of the original value
 * @return {Object|null} returns the object (or wrapper) that was stored, or null if nothing is found with this id.
 */
export function getStructureLocalStorage(id, returnStorageObject){
  returnStorageObject = returnStorageObject||false;

  var item = localStorage.getItem(id);

  if(item==null) return null;

  var storageObject;
  try{
    storageObject = JSON.parse(item);
  } catch(err){
    return null;
  }

  if(storageObject.type==null && storageObject.code==null) return null;

  var type = storageObject.type;
  var code = storageObject.code;
  var object;

  switch(type){
    case 'string':
      object = code;
      break;
    case 'Network':
      object = NetworkEncodings.decodeGDF(code);
      break;
    case 'object':
      object = JSON.parse(code);
      break;
  }

  if(returnStorageObject){
    storageObject.object = object;
    storageObject.size = storageObject.code.length;
    storageObject.date = new Date(storageObject.date);

    return storageObject;
  }

  return object;
}

