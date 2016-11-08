import Rectangle from "src/dataTypes/geometry/Rectangle";
import StringList from "src/dataTypes/strings/StringList";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import ColorOperators from "src/operators/graphic/ColorOperators";

function NumberListDraw() {}
export default NumberListDraw;

/**
 * draws a simple graph
 * @param  {Rectangle} frame
 * @param  {NumberList} numberList
 *
 * @param {Number} margin
 * @param {Object} xValues horizontal values, could be a stringList, a numberList or an Interval
 * @param {Boolean} bShowHues
 * @return {Number} index of element clicked
 * tags:draw
 */
NumberListDraw.drawSimpleGraph = function(frame, numberList, margin, xValues, bShowHues, graphics) {
  if(numberList == null || NumberListOperators.normalized(numberList) == null) return;

  if(graphics==null) graphics = frame.graphics; //momentary fix
  bShowHues = bShowHues == null ? false : bShowHues;

  margin = margin || 0;

  //setup
  if(frame.memory == null || numberList != frame.memory.numberList) {
    frame.memory = {
      numberList: numberList,
      minmax: numberList.getInterval(),
      zero: null
    };
    if(frame.memory.minmax.x > 0 && frame.memory.minmax.y > 0) {
      frame.memory.normalizedList = NumberListOperators.normalizeToMax(numberList);
    } else {
      frame.memory.normalizedList =  NumberListOperators.normalized(numberList);
      frame.memory.zero = -frame.memory.minmax.x / frame.memory.minmax.getAmplitude();
    }

    frame.memory.xTexts = new StringList();

    if(xValues != null && xValues.type == "Interval") {
      var kx = (xValues.getAmplitude() + 1) / numberList.length;
    }

    numberList.forEach(function(val, i) {
      frame.memory.xTexts[i] = (xValues == null) ? String(numberList[i]) : ((kx == null ? xValues[i] : (xValues.x + i * kx)) + ":" + numberList[i]);
    });
  }

  var i;
  var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
  subframe.bottom = subframe.getBottom();
  var x;
  var dx = subframe.width / numberList.length;
  var w = Math.max(1, dx);
  var overI = -1;

  var mouseOnFrame = subframe.containsPoint(graphics.mP);
  var normalColor = mouseOnFrame ? 'rgb(160,160,160)' : 'black';

  if(frame.memory.zero) {
    var zeroY = subframe.bottom - subframe.height * frame.memory.zero; //Math.max(subframe.bottom - subframe.height*frame.memory.zero, subframe.y);
    for(i = 0; numberList[i] != null; i++) {
      x = subframe.x + i * dx;
      if(mouseOnFrame && graphics.mX > x && graphics.mX < x + dx) {
        overI = i;
        graphics.setFill('black');
      } else {
        graphics.setFill(normalColor);
      }
      if(bShowHues){
        var h = Math.floor(i*360/numberList.length);
        var rgb = ColorOperators.RGBArrayToString(ColorOperators.HSVtoRGB(h,(!mouseOnFrame || i == overI ) ? 1 : .5,1));
        graphics.setFill(rgb);
      }
      graphics.fRect(subframe.x + i * dx, zeroY, w, -subframe.height * (frame.memory.normalizedList[i] - frame.memory.zero));
    }
  } else {
    for(i = 0; numberList[i] != null; i++) {
      x = subframe.x + i * dx;
      if(mouseOnFrame && graphics.mX > x && graphics.mX < x + dx) {
        overI = i;
        graphics.setFill('black');
      } else {
        graphics.setFill(normalColor);
      }
      if(bShowHues){
        var h = Math.floor(i*360/numberList.length);
        var rgb = ColorOperators.RGBArrayToString(ColorOperators.HSVtoRGB(h,(!mouseOnFrame || i == overI ) ? 1 : .5,1));
        graphics.setFill(rgb);
      }
      graphics.fRect(x, subframe.bottom, w, -subframe.height * frame.memory.normalizedList[i]);
    }
  }

  var clicked;

  if(overI != -1) {
    graphics.setText('white', 12);
    var text = frame.memory.xTexts[overI];
    var w = graphics.getTextW(text);
    graphics.setFill('rgb(100,100,100)');
    graphics.fLines(
      graphics.mX, graphics.mY,
      graphics.mX + 16, graphics.mY - 10,
      graphics.mX + w + 16, graphics.mY - 10,
      graphics.mX + w + 16, graphics.mY - 30,
      graphics.mX + 6, graphics.mY - 30,
      graphics.mX + 6, graphics.mY - 10
    );
    graphics.setFill('white');
    graphics.fText(text, graphics.mX + 10, graphics.mY - 26);
    if(graphics.MOUSE_DOWN) {
      clicked = overI;
    }
  }

  return clicked;
};
