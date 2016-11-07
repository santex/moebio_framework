/* global console, Image */

import NumberList from "src/dataTypes/numeric/NumberList";
import Table from "src/dataTypes/lists/Table";
import TableGenerators from "src/operators/lists/TableGenerators";
import ColorList from "src/dataTypes/graphic/ColorList";
import List from "src/dataTypes/lists/List";
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
 * getColorFrequencyTable
 * @param  {Image} img
 * @param  {Number} quality is number 1 or greater. Higher numbers are faster to compute but lower quality (default:1)
 * @param  {Number} distNeutral Level of neutral colors (black, white, grey) to ignore.<br>Range is [0,256], 0 means keep all neutrals (default:10)
 * @param  {Number} distUnique Number controlling how different colors must be to get combined in the results.<br>Range is [0,765], 0 means do not combine any (default:16)
 * @param  {Number} maxColors is the maximum number of colors to keep in the results table (default:8) 
 *
 * @return {Table} table with column 0 having color values and column 1 the freq
 * tags: image
 */
ImageOperators.getColorFrequencyTable = function(img, quality, distNeutral, distUnique, maxColors) {
  if(img == null || img.width <= 0) return null;
  quality = quality == null || quality == 0 ? 1 : Math.round(quality);
  distNeutral = distNeutral == null ? 10 : distNeutral;
  distUnique = distUnique == null ? 16 : distUnique;
  maxColors = maxColors == null ? 8 : maxColors;
  var data = ImageOperators._getPixelData(img);
  if(data == null) return null;
  var dict = {};
  var sCol,o,bNeutral,i,j;
  for(i=0;i<data.length;i+=4*quality){
    if(data[i+3] < 64) continue; // ignore highly transparent pixels, future parm?
    bNeutral = Math.abs(data[i]-data[i+1]) < distNeutral && Math.abs(data[i]-data[i+2]) < distNeutral && Math.abs(data[i+1]-data[i+2]) < distNeutral;
    if(bNeutral) continue;
    sCol = 'rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]/255+')';
    o = dict[sCol];
    if(o == null){
      o = {sCol:sCol,count:0,arr:[data[i],data[i+1],data[i+2],data[i+3]/255]};
      dict[sCol] = o;
    }
    o.count++; 
  }
  var tab = new Table();
  tab.push(new ColorList());
  tab.push(new NumberList());
  tab.push(new List());
  tab[0].name = 'Color';
  tab[1].name = 'Frequency';
  tab[2].name = 'Color Array';
  for(var key in dict){
    o = dict[key];
    tab[0].push(o.sCol);
    tab[1].push(o.count);
    tab[2].push(o.arr);
  }
  tab = tab.getListsSortedByList(1,false);
  // combine similar colors together
  if(distUnique > 0){
    var nLRemove = new NumberList();
    for(i=1; i < tab[0].length; i++){
      // compare to all previous items in list
      var distClosest = Number.MAX_VALUE;
      var iClosest = -1;
      for(j=0; j < i; j++){
        if(tab[2][j][0] == -1) continue; // previously combined
        var d = Math.abs(tab[2][i][0] - tab[2][j][0]); // r
        d +=    Math.abs(tab[2][i][1] - tab[2][j][1]); // g
        d +=    Math.abs(tab[2][i][2] - tab[2][j][2]); // b
        if(d < distClosest){
          distClosest = d;
          iClosest = j;
        }
      }
      if(distClosest < distUnique){
        nLRemove.push(i); // mark entry for removal
        tab[2][i][0] = -1; // indicator that this has been removed so we do not combine subsequent items into it
        tab[1][iClosest] += tab[1][i];
      }
    }
    // remove all rows from table for elements in nLRemove
    tab = tab.getWithoutRows(nLRemove);
  }
  if(tab[0].length > maxColors){
    tab = tab.sliceRows(0,maxColors-1);
  }
  // re-sort since numbers were changed 
  tab = tab.getListsSortedByList(1,false);
  return tab;
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
