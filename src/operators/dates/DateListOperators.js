import Tree from "src/dataTypes/structures/networks/Tree";
import Node from "src/dataTypes/structures/elements/Node";
import DateList from "src/dataTypes/dates/DateList";
import DateInterval from "src/dataTypes/dates/DateInterval";
import DateOperators from "src/operators/dates/DateOperators";
import Table from "src/dataTypes/lists/Table";
import NumberList from "src/dataTypes/numeric/NumberList";
import StringList from "src/dataTypes/strings/StringList";

/**
 * @classdesc Provides a set of tools that work with DateLists.
 *
 * @namespace
 * @category dates
 */
function DateListOperators() {}
export default DateListOperators;


/**
 * @todo write docs
 */
DateListOperators.buildTimeTreeFromDates = function(dates) {
  if(dates == null) return;

  var tree = new Tree();
  var minYear;
  var maxYear;

  var minDate = dates[0];
  var maxDate = dates[0];



  dates.forEach(function(date) {
    minDate = date < minDate ? date : minDate;
    maxDate = date > maxDate ? date : maxDate;
  });

  minYear = minDate.getFullYear();
  maxYear = minDate.getFullYear();

  var superior = new Node("years", "years");
  tree.addNodeToTree(superior);
  superior.dates = dates.clone();

  var y, m, d, h, mn;
  var yNode, mNode, dNode, hNode, mnNode;
  var nDaysOnMonth;

  //var N=0;

  for(y = minYear; y <= maxYear; y++) {
    yNode = new Node(String(y), String(y));
    tree.addNodeToTree(yNode, superior);
  }

  dates.forEach(function(date) {
    y = DateListOperators._y(date);
    yNode = superior.toNodeList[y - minYear];

    if(yNode.dates == null) {
      yNode.dates = new DateList();

      for(m = 0; m < 12; m++) {
        mNode = new Node(DateOperators.MONTH_NAMES[m] + "_" + y, DateOperators.MONTH_NAMES[m]);
        tree.addNodeToTree(mNode, yNode);
        nDaysOnMonth = DateOperators.getNDaysInMonth(y, m + 1);
      }
    }
    yNode.dates.push(date);


    m = DateListOperators._m(date);
    mNode = yNode.toNodeList[m];
    if(mNode.dates == null) {
      mNode.dates = new DateList();
      for(d = 0; d < nDaysOnMonth; d++) {
        dNode = new Node((d + 1) + "_" + mNode.id, String(d + 1));
        tree.addNodeToTree(dNode, mNode);
      }
    }
    mNode.dates.push(date);

    d = DateListOperators._d(date);
    dNode = mNode.toNodeList[d];
    if(dNode.dates == null) {
      dNode.dates = new DateList();
      for(h = 0; h < 24; h++) {
        hNode = new Node(h + "_" + dNode.id, String(h) + ":00");
        tree.addNodeToTree(hNode, dNode);
      }
    }
    dNode.dates.push(date);

    h = DateListOperators._h(date);
    hNode = dNode.toNodeList[h];
    if(hNode.dates == null) {
      hNode.dates = new DateList();
      for(mn = 0; mn < 60; mn++) {
        mnNode = new Node(mn + "_" + hNode.id, String(mn));
        tree.addNodeToTree(mnNode, hNode);
      }
    }
    hNode.dates.push(date);

    mn = DateListOperators._mn(date);
    mnNode = hNode.toNodeList[mn];
    if(mnNode.dates == null) {
      mnNode.dates = new DateList();
      //c.l(date);
      // N++;
      // for(s=0; s<60; s++){
      // 	sNode = new Node(String(s), s+"_"+mnNode.id);
      // 	tree.addNodeToTree(sNode, mnNode);
      // }
    }
    mnNode.weight++;
    mnNode.dates.push(date);

    // s = DateListOperators._s(date);
    // sNode = mnNode.toNodeList[s];
    // if(sNode.dates==null){
    // 	sNode.dates = new DateList();
    // }
    // sNode.dates.push(date);
    // sNode.weight++;
  });

  tree.assignDescentWeightsToNodes();

  //



  // for(y=minYear; y<=maxYear; y++){
  // 	yNode = new Node(String(y), String(y));
  // 	tree.addNodeToTree(yNode, superior);

  // 	for(m=0; m<12; m++){
  // 		mNode = new Node(DateOperators.MONTH_NAMES[m], DateOperators.MONTH_NAMES[m]+"_"+y);
  // 		tree.addNodeToTree(mNode, yNode);
  // 		nDaysOnMonth = DateOperators.getNDaysInMonth(y, m+1);

  // 		for(d=0; d<nDaysOnMonth; d++){
  // 			dNode = new Node(String(d+1), (d+1)+"_"+mNode.id);
  // 			tree.addNodeToTree(dNode, mNode);

  // 			for(h=0; h<24; h++){
  // 				hNode = new Node(String(h), h+"_"+dNode.id);
  // 				tree.addNodeToTree(hNode, dNode);

  // 				for(mn=0; mn<60; mn++){
  // 					mnNode = new Node(String(mn), mn+"_"+hNode.id);
  // 					tree.addNodeToTree(mnNode, hNode);

  // 					for(s=0; s<60; s++){
  // 						sNode = new Node(String(s), s+"_"+mnNode.id);
  // 						tree.addNodeToTree(sNode, mnNode);
  // 					}
  // 				}
  // 			}
  // 		}
  // 	}
  // }

  return tree;
};

/**
 * @ignore
 */
DateListOperators._y = function(date) {
  return date.getFullYear();
};

/**
 * @ignore
 */
DateListOperators._m = function(date) {
  return date.getMonth();
};

/**
 * @ignore
 */
DateListOperators._d = function(date) {
  return date.getDate() - 1;
};

/**
 * @ignore
 */
DateListOperators._h = function(date) {
  return date.getHours();
};

/**
 * @ignore
 */
DateListOperators._mn = function(date) {
  return date.getMinutes();
};

/**
 * @ignore
 */
DateListOperators._s = function(date) {
  return date.getSeconds();
};

/**
 * @ignore
 */
DateListOperators._ms = function(date) {
  return date.getMilliseconds();
};

/**
 * builds various types of summary tables from dates and optional associated values
 * @param  {DateList} list of dates
 *
 * @param  {Number} outputType 0 - Weekday by Hour (default)<br>outputType 1 - Month by Day<br>outputType 2 - Day Sequence (with optional DateInterval)
 * @param  {NumberList} values associated with dates (optional)
 * @param  {DateInterval} range of dates to use for outputType=2 (optional)
 * @return {Table}
 * tags:dates
 */
DateListOperators.buildSummaryTableFromDates = function(dates,outputType,nlValues,intDates){
  if(dates == null || dates.type != 'DateList') return null;
  outputType = outputType == null ? 0 : outputType;
  var nameType = 'Weekday by Hour Summary';
  var sCol0 = 'Hour';
  if(outputType == 1){
    nameType = 'Month by Day Summary';
    sCol0 = 'Day';
  }
  else if(outputType == 2){
    nameType = 'Sequence';
    sCol0 = 'Date';
  }
  var tab = new Table();
  if(dates.name != null)
    tab.name = dates.name + ' ' + nameType;
  else
    tab.name = nameType;
  tab.push(new StringList());
  tab[0].name = sCol0;
  var lang = window && window.navigator && window.navigator.language ? window.navigator.language : 'en-US';
  var dt0 = new Date(2016,0,17,10,0,0,0); // sunday
  var i,dt,nL,j,d,h;
  if(outputType == 2){
    // do this separately, it's too different from the other two outputs
    if(intDates == null || intDates.type != 'DateInterval')
      intDates = new DateInterval(dates.getMin(),dates.getMax());
    tab.push(new NumberList());
    tab[1].name = 'Value';
    var iDays = DateOperators.daysBetweenDates(intDates.date0,intDates.date1);
    // fill values with zero to start
    for(i=0;i<=iDays;i++){
      dt = DateOperators.addDaysToDate(intDates.date0,i);
      tab[0][i] = DateOperators.dateToString(dt,1);
      tab[1][i] = 0;
    }
    // now process dates
    for(i=0;i<dates.length;i++){
      // get row number
      j = Math.floor(DateOperators.daysBetweenDates(intDates.date0,dates[i]));
      if(j < 0 || j >= tab[1].length) continue; // skip entries outside of range
      if(bValues)
        tab[1][j] += nlValues[i];
      else
        tab[1][j] ++;
    }
    return tab;
  }

  var bValues = nlValues && nlValues.length == dates.length;
  var nCols = outputType == 0 ? 7 : 12;
  var inc = outputType == 0 ? 1 : 30;
  for(i=0;i<nCols;i++){
    dt = i == 0 ? dt0 : DateOperators.addDaysToDate(dt0,i*inc);
    nL = new NumberList();
    nL.name = dt.toLocaleString(lang, outputType == 0 ? {weekday: 'long'} : {month: 'long'});
    tab.push(nL);
    if(i==0){
      if(outputType == 0)
        for(j=0;j<24;j++){
          if(j==0)
            tab[0][j] = 'Midnight';
          else if(j==12)
            tab[0][j] = 'Noon';
          else if(j > 12)
            tab[0][j] = String(j-12);
          else
            tab[0][j] = String(j);
        }
      else
        for(j=0;j<31;j++){
          tab[0][j] = String(j+1);
        }
    }
  }
  for(d=1;d<=nCols;d++){
    for(h=0;h<tab[0].length;h++)
      tab[d][h]=0;
  }
  for(i=0;i<dates.length;i++){
    if(outputType==0){
      d = dates[i].getDay();
      h = dates[i].getHours();
    }
    else{
      d = dates[i].getMonth();
      h = dates[i].getDate()-1;
    }
    if(bValues)
      tab[d+1][h]+=nlValues[i];
    else
      tab[d+1][h]++;
  }

  return tab;
};
