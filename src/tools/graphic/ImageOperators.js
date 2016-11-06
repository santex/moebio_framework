/* global console, Image */

import Table from "src/dataTypes/lists/Table";
import TableGenerators from "src/operators/lists/TableGenerators";
import ColorOperators from "src/operators/graphic/ColorOperators";

function ImageOperators() {}
export default ImageOperators;

/**
 * imageToTableOfRGBA
 * @param  {Image} img
 * @return {Table} Table with [r,g,b,a] arrays at each cell of table
 * tags:
 */
ImageOperators.imageToTableOfRGBA = function(img, brgbaStringsInCells) {
  if(img == null || img.width <= 0) return null;
  brgbaStringsInCells = brgbaStringsInCells == null ? false : brgbaStringsInCells;
  var tab = TableGenerators.createTableWithSameElement(img.width,img.height,[]);
  var data;
  try {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0 );
    data = context.getImageData(0, 0, img.width, img.height).data;
  }
  catch(err){
    throw(err);
  }
  // var i = (y * width + x) * 4;
  var x,y,r,g,b,a;
  for(var i=0;i<data.length;i+=4){
    x = (i / 4) % img.width;
    y = Math.floor((i / 4) / img.width);
    if(brgbaStringsInCells)
      tab[x][y] = 'rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]/255+')';
    else
      tab[x][y] = [data[i],data[i+1],data[i+2],data[i+3]/255];
  }
  return tab;
};