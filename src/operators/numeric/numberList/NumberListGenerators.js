import NumberList from "src/dataTypes/numeric/NumberList";
import Interval from "src/dataTypes/numeric/Interval";
import NumberOperators from "src/operators/numeric/NumberOperators";

/**
 * @classdesc NumberList Generators
 *
 * @namespace
 * @category numbers
 */
function NumberListGenerators() {}
export default NumberListGenerators;

/**
 * Generate a NumberList with sorted Numbers
 * @param {Number} nValues length of the NumberList
 *
 * @param {Number} start first value
 * @param {Number} step increment value
 * @return {NumberList} generated NumberList
 * tags:generator
 */
NumberListGenerators.createSortedNumberList = function(nValues, start, step) {
  start = start || 0;
  step = step || 1;
  if(step === 0) step = 1;
  var i;
  var numberList = new NumberList();
  for(i = 0; i < nValues; i++) {
    numberList.push(start + i * step);
  }
  return numberList;
};

/**
 * creates a list with numbers within a range defined by an interval
 * @param  {Number} nValues
 *
 * @param  {Interval} interval range of the numberList
 * @param  {Number} mode <br>0:random <br>1:evenly distributed
 * @param  {Number} seed optional seed for random numbers ([!] not yet working @todo: finish)
 * @return {NumberList}
 * tags:random,generator
 */
NumberList.createNumberListWithinInterval = function(nValues, interval, mode, randomSeed) {
  if(interval == null) interval = new Interval(0, 1);
  mode = mode==null?0:mode;

  var numberList = new NumberList();
  var range = interval.getAmplitude();
  var min = Number(interval.getMin());
  var i;
  switch(mode){
    case 0://random
      for(i = 0; i < nValues; i++) {
        numberList.push(min + Number(Math.random() * range));
      }
      break;
  }
  
  return numberList;
};

NumberList.createRandomNormalDistribution = function(nValues, mean, stdev){
  var fac = stdev/6
  (Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random())*stdev/6+mean;
}

/**
 * creates a list with random numbers
 *
 * @param  {Number} nValues
 *
 * @param  {Interval} interval range of the numberList
 * @param  {Number} seed optional seed for seeded random numbers
 * @return {NumberList}
 * tags:random,generator
 */
NumberListGenerators.createRandomNumberList = function(nValues, interval, seed, func) {
  seed = seed == null ? -1 : seed;
  interval = interval == null ? new Interval(0, 1) : interval;

  var numberList = new NumberList();
  var amplitude = interval.getAmplitude();

  var random = seed == -1 ? Math.random : new NumberOperators._Alea("my", seed, "seeds");

  for(var i = 0; i < nValues; i++) {
    //seed = (seed*9301+49297) % 233280; //old method, close enough: http://moebio.com/research/randomseedalgorithms/
    //numberList[i] = interval.x + (seed/233280.0)*amplitude; //old method

    numberList[i] = func == null ? (random() * amplitude + interval.x) : func(random() * amplitude + interval.x);
  }

  return numberList;
};
