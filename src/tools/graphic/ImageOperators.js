/* global console, Image */

import Table from "src/dataTypes/lists/Table";
import TableGenerators from "src/operators/lists/TableGenerators";
import ColorList from "src/dataTypes/graphic/ColorList";
import ColorOperators from "src/operators/graphic/ColorOperators";

function ImageOperators() {}
export default ImageOperators;

/**
 * imageToTableOfRGBA
 * @param  {Image} img
 *
 * @param  {Boolean} brgbaStringsInCells if true use rgba(r,g,b,a) format rather than arrays (default: false)
 * @return {Table} Table with [r,g,b,a] arrays at each cell of table
 * tags: image
 */
ImageOperators.imageToTableOfRGBA = function(img, brgbaStringsInCells) {
  if(img == null || img.width <= 0) return null;
  brgbaStringsInCells = brgbaStringsInCells == null ? false : brgbaStringsInCells;
  var data = ImageOperators._getPixelData(img);
  if(data == null) return null;
  var tab;
  if(brgbaStringsInCells){
    tab = new Table();
    for(var col=0; col < img.width; col++){
      tab.push(new ColorList());
      for(var row=0; row < img.height; row++)
        tab[col].push('');
    }
  }
  else
   tab = TableGenerators.createTableWithSameElement(img.width,img.height,[]);
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

/**
 * invertImageColors
 * @param  {Image} img
 *
 * @return {Image} image with colors inverted, alpha stays the same
 * tags: image
 */
ImageOperators.invertImageColors = function(img) {
  if(img == null || img.width <= 0) return null;
  var data = ImageOperators._getPixelData(img);
  if(data == null) return null;
  for(var i=0;i<data.length;i+=4){
    data[i]   = 255 - data[i];
    data[i+1] = 255 - data[i+1];
    data[i+2] = 255 - data[i+2];
  }
  try {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    var inverted = new ImageData(data, img.width, img.height);
    context.putImageData(inverted, 0, 0 );
    var img2 = document.createElement('img');
    img2.src = canvas.toDataURL("image/png");
  }
  catch(err){
    throw(err);
  }
  return img2;
};

/**
 * This method just returns the pixel data, null if the image is not accessible
 *
 * @param  {Image} img
 * @ignore
 */
ImageOperators._getPixelData = function(img) {
  if(img == null || img.width <= 0) return null;
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
  return data;
};
