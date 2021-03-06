
/**
 * @classdesc Functions for drawing {@link Color|Colors}.
 *
 * @namespace
 * @category drawing
 */
function ColorsDraw() {}
export default ColorsDraw;

/**
 * draws a color scale, with optional min and max associated values
 * @param  {Rectangle} frame
 * @param  {ColorScale} colorScale
 *
 * @param  {Number} minValue value associated to min color
 * @param  {Number} maxValue value associated to max color
 * tags:draw
 */
ColorsDraw.drawColorScaleLegend = function(frame, colorScale, minValue, maxValue, graphics) {
  if(colorScale==null) return;

  if(graphics==null) graphics = frame.graphics;

  // TODO refactor this to import context from Global and not reassign it.
  var change = true;//frame.memory == null || frame.width != frame.memory.w || frame.height != frame.memory.h || colorScale != frame.memory.cS || minValue != frame.memory.min || maxValue != frame.memory.max;

  if(change) {
    // frame.memory = {
    //   w: frame.width,
    //   h: frame.height,
    //   cS: colorScale,
    //   min: minValue,
    //   max: maxValue
    // };

    ///// capture image 1
    // TODO refactor to not reassign context
    // var newCanvas = document.createElement("canvas");
    // newCanvas.width = frame.width;
    // newCanvas.height = frame.height;
    // var newContext = newCanvas.getContext("2d");
    // newContext.clearRect(0, 0, frame.width, frame.height);
    // var mainContext = context;
    // context = newContext;
    /////

    var x;

    if(frame.width > frame.height) {

      for(x = 0; x < frame.width; x += 2) {
        graphics.setFill(colorScale(x / frame.width));
        graphics.fRect(x+frame.x, 0+frame.y, 2, frame.height);
      }

      graphics.setStroke('rgba(255,255,255,0.8)', 3);

      if(minValue != null) {
        graphics.setText('black', 12, null, 'left', 'middle');
        graphics.fsText(minValue, 4+frame.x, frame.height * 0.5+frame.y);
      }

      if(maxValue != null) {
        graphics.setText('black', 12, null, 'right', 'middle');
        graphics.fsText(maxValue, frame.width - 4+frame.x, frame.height * 0.5+frame.y);
      }
    } else {

      //finis this, with color scale going uppwards, and texts for min max values

      for(x = 0; x < frame.height; x += 2) {
        graphics.setFill(colorScale(x / frame.height));
        graphics.fRect(0+frame.x, x+frame.y, frame.width, 2);
      }
    }

    //// capture image 2
    // TODO refactor to not reassign context
    // context = mainContext;
    // frame.memory.image = new Image();
    // frame.memory.image.src = newCanvas.toDataURL();
    ////
  }


  // if(frame.memory.image) {
  //   graphics.drawImage(frame.memory.image, frame.x, frame.y);
  // }

};
