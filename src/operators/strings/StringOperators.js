import StringList from "src/dataTypes/strings/StringList";
import NumberList from "src/dataTypes/numeric/NumberList";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import ColorOperators from "src/operators/graphic/ColorOperators";
import Table from "src/dataTypes/lists/Table";

/**
 * @classdesc  String Operators
 *
 * @namespace
 * @category strings
 */
function StringOperators() {}
export default StringOperators;

StringOperators.ENTER = String.fromCharCode(13);
StringOperators.ENTER2 = String.fromCharCode(10);
StringOperators.ENTER3 = String.fromCharCode(8232);

StringOperators.SPACE = String.fromCharCode(32);
StringOperators.SPACE2 = String.fromCharCode(160);

StringOperators.TAB = "	";
StringOperators.TAB2 = String.fromCharCode(9);

StringOperators.LINK_REGEX = /(^|\s+)(https*\:\/\/\S+[^\.\s+])/;
StringOperators.MAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
StringOperators.STOP_WORDS = StringList.fromArray("t,s,mt,rt,re,m,http,amp,a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your".split(","));




///**
// * splits a String by a character (entre by default)
// * @param  {String} string
// *
// * @param  {String} character
// * @return {StringList}
// * tags:deprecated
// */
// StringOperators.split = function(string, character) {
//   if(character == null) return StringOperators.splitByEnter(string);
//   return StringList.fromArray(string.split(character));
// };


/**
 * split a String by enter (using several codifications)
 * @param  {String} string
 * @return {StringList}
 * tags:
 */
StringOperators.splitByEnter = function(string) {
  if(string == null) {
    return null;
  }
  var stringList = StringOperators.splitString(string, "\n");
  if(stringList.length > 1)
  {
   return stringList;
  }
  stringList = StringOperators.splitString(string, StringOperators.ENTER2);
  if(stringList.length > 1) {
    return stringList;
  }
  stringList = StringOperators.splitString(string, StringOperators.ENTER3);
  if(stringList.length > 1) {
    return stringList;
  }
  return new StringList(string);
};


/**
 * replaces in a string ocurrences of a sub-string by another string (base in replace JavaScript method)
 * @param  {String} text to be modified
 * @param  {String} string string to be replaced (could be Regular Expression)
 * @param  {String} replacement string to be placed instead
 * @return {String}
 * tags:
 */
StringOperators.replaceStringInText = function(text, string, replacement) {
  if(text == null || string == null || replacement == null) return null;

  if(!(string instanceof RegExp)) string = new RegExp(string, "g");

  return text.replace(string, replacement);
};

/**
 * replaces in each string, a sub-string by a string
 * @param  {String} text where to replaces strings
 * @param  {StringList} strings to be replaced (could be Regular Expressions)
 * @param  {String} replacement string to be placed instead
 * 
 * @param {Boolean} asWords searches for words instead of string occurrences (using new RegExp("\\b" + string + "\\b"))
 * @return {String}
 * tags:
 */
StringOperators.replaceStringsInText = function(text, strings, replacement, asWords) {
  if(text==null || strings==null || replacement==null) return null;

  var newText = text;
  var nStrings = strings.length;
  var j;
  var string;

  for(j=0; j<nStrings; j++){
    string = strings[j];
    if(!(string instanceof RegExp)){
      if(asWords) {
        string = new RegExp("\\b" + string + "\\b", "g");
      } else {
        string = new RegExp(string, "g");
      }
    }
      
    newText = newText.replace(string, replacement);
  }

  return newText;
};

/**
 * builds a stringList of words contained in the text
 * @param  {String} string text to be analyzed
 *
 * @param  {Boolean} withoutRepetitions remove words repetitions
 * @param  {Boolean|StringList} stopWords remove stop words (true for default stop words, or stringList of words)
 * @param  {Boolean} sortedByFrequency  sorted by frequency in text (default: true)
 * @param  {Boolean} includeLinks include html links
 * @param  {Number} limit of words
 * @param  {Number} minSizeWords minimal number of characters of words
 * @return {StringList}
 * tags:
 */
StringOperators.getWords = function(string, withoutRepetitions, stopWords, sortedByFrequency, includeLinks, limit, minSizeWords) {
  if(string == null) return null;

  var links;

  minSizeWords = minSizeWords || 0;
  withoutRepetitions = withoutRepetitions == null ? true : withoutRepetitions;
  sortedByFrequency = sortedByFrequency == null ? true : sortedByFrequency;
  includeLinks = includeLinks == null ? true : includeLinks;
  limit = limit == null ? 0 : limit;

  var i, j;

  if(includeLinks) {
    links = string.match(StringOperators.LINK_REGEX);
  }

  string = string.toLowerCase().replace(StringOperators.LINK_REGEX, "");

  var list = string.match(/\w+/g);

  if(list == null) return new StringList();

  list = StringList.fromArray(list);

  if(includeLinks && links != null) list = list.concat(links);
  list = StringList.fromArray(list).replace(/ /g, "");

  var nMatches;

  if(stopWords != null) { //TODO:check before if all stopwrds are strings
    //list.removeElements(stopWords);
    
    if(stopWords===true) stopWords = StringOperators.STOP_WORDS;

    nMatches = list.length;
    var nStopWords = stopWords.length;
    for(i = 0; i<nMatches; i++) {
      for(j = 0; j<nStopWords; j++) {
        if((typeof stopWords[j]) == 'string') {
          if(stopWords[j] == list[i]) {
            list.splice(i, 1);
            i--;
            nMatches = list.length;
            break;
          }
        } else if(stopWords[j].test(list[i])) {
          list.splice(i, 1);
          i--;
          nMatches = list.length;
          break;
        }
      }
    }

  }

  if(minSizeWords > 0) {
    nMatches = list.length;
    for(i = 0; i<nMatches; i++) {
      if(list[i].length < minSizeWords) {
        list.splice(i, 1);
        i--;
        nMatches = list.length;
      }
    }
  }

  if(sortedByFrequency) {
    if(withoutRepetitions) {
      list = list.getFrequenciesTable(true)[0];// //ListOperators.countElementsRepetitionOnList(list, true)[0];
      if(limit !== 0) list = list.splice(0, limit);

      return list;
    }

    var occurrences = list.getFrequenciesTable();
    list = list.getSortedByList(occurrences);
    if(limit !== 0) list = list.splice(0, limit);

    return list;
  }

  if(withoutRepetitions) {
    list = list.getWithoutRepetitions();
  }

  if(limit !== 0) list = list.splice(0, limit);
  return list;
};



/**
 * return a substring
 * @param  {String} string
 *
 * @param  {Number} i0 init index
 * @param  {Number} length of ths substring (if null returns substring from i0 to the end)
 * @return {String}
 * tags:filter
 */
StringOperators.substr = function(string, i0, length) {
  i0 = i0 || 0;
  return string.substr(i0, length);
};

/**
 * split a String by a separator (a String) and returns a StringList
 * @param  {String} string
 *
 * @param  {String} separator (default: ",")
 * @return {StringList}
 * tags:
 */
StringOperators.splitString = function(string, separator) {
  if(string == null) return null;
  if(separator == null) separator = ",";
  if(typeof separator == "string") separator = separator.replace("\\n", "\n");
  if(string.indexOf(separator) == -1) return new StringList(string);
  return StringList.fromArray(string.split(separator));
};

/**
 * searches for two Strings within a String and returns the String in between
 * @param  {String} text
 * @param  {String} subString0
 *
 * @param  {String} subString1 if null returns the text after subString0
 * @return {String}
 * tags:filter
 */
StringOperators.getFirstTextBetweenStrings = function(text, subString0, subString1) {
  var i0 = text.indexOf(subString0);
  if(i0 == -1) return null;
  if(subString1 === "" || subString1 == null) return text.substr(i0 + subString0.length);
  var i1 = text.indexOf(subString1, i0 + subString0.length + 1);
  if(i1 == -1) return text.substring(i0 + subString0.length);
  return text.substr(i0 + subString0.length, i1 - (i0 + subString0.length));
};

/**
 * searches all the Strings contained between two Strings in a String
 * @param  {String} text
 * @param  {String} subString0
 * @param  {String} subString1
 * @return {StringList}
 * tags:filter
 */
StringOperators.getAllTextsBetweenStrings = function(text, subString0, subString1) { //TODO: improve using indexOf(string, START_INDEX)
  if(text.indexOf(subString0) == -1) return new StringList();
  var blocks = text.split(subString0);
  var nBlocks = blocks.length;
  var stringList = new StringList();
  var block;
  var index;
  var i;
  for(i = 1; i < nBlocks; i++) {
    block = blocks[i];
    if(subString1 == subString0) {
      stringList.push(block);
    } else {
      index = block.indexOf(subString1);
      if(index >= 0) {
        stringList.push(block.substr(0, index));
      }
    }
  }
  return stringList;
};

/**
 * associates a value to each text in a StringList, according to number of words containg in each StringList; one lists pushes to negative values, the other to positive. A classic use would be a primitive sentimental analisis using a list of positive adjectives and a list of negative ones
 * @param  {String} string to be analized
 * @param  {StringList} negativeStrings list of 'negative' words
 * @param  {StringList} positiveStrings list of 'positive' words
 *
 * @param  {Boolean} normalizeBySize divide score by the string size
 * @return {Number}
 * tags:analysis
 */
StringOperators.countWordsDichotomyAnalysis = function(string, negativeStrings, positiveStrings, normalizeBySize) {
  var val = 0;
  negativeStrings.forEach(function(word) {
    val -= StringOperators.countWordOccurrences(string, word);
  });
  positiveStrings.forEach(function(word) {
    val += StringOperators.countWordOccurrences(string, word);
  });
  if(normalizeBySize) val /= string.length;
  return val;
};


/**
 * creates a list of urls contained in the html in <a> tags
 * @param  {String} html to be analyzied
 *
 * @param {String} urlSource optional, if provided will be used to build complete urls
 * @param {Boolean} removeHash if true removes the hastag (anchor) content of the url
 * @return {StringList} list of urls
 * tags:html
 */
StringOperators.getLinksFromHtml = function(html, urlSource, removeHash) {
  var doc = document.createElement("html");
  doc.innerHTML = html;

  var i;
  var links = doc.getElementsByTagName("a");
  var originalUrl, url;
  var urls = new StringList();
  var index;
  var urlSourceParts;
  var parts, blocks;
  var root;

  urlSource = urlSource === "" ? null : urlSource;
  removeHash = removeHash == null ? false : removeHash;

  if(urlSource) {
    urlSource = urlSource.trim();

    if(urlSource.substr(-5) == ".html") {
      urlSourceParts = urlSource.split("/");
      urlSource = urlSourceParts.slice(0, urlSourceParts.length - 1).join("/");
    }
    if(urlSource.indexOf(-1) == "/") urlSource = urlSource.substr(0, urlSource.length - 1);
    urlSourceParts = urlSource.split("/");

    root = urlSource.replace("//", "**").split("/")[0].replace("**", "//");
  }


  for(i = 0; i < links.length; i++) {
    originalUrl = url = links[i].getAttribute("href");
    if(url == null) continue;

    if(url.indexOf('=') != -1) url = url.split('=')[0];

    //console.log(url);
    if(urlSource && url.indexOf('http://') == -1 && url.indexOf('https://') == -1 && url.indexOf('wwww.') == -1 && url.indexOf('file:') == -1 && url.indexOf('gopher:') == -1 && url.indexOf('//') !== 0) {
      if(url.substr(0, 9) == "../../../") {
        url = urlSourceParts.slice(0, urlSourceParts.length - 3).join("/") + "/" + url.substr(9);
      } else if(url.substr(0, 6) == "../../") {
        url = urlSourceParts.slice(0, urlSourceParts.length - 2).join("/") + "/" + url.substr(6);
      } else if(url.substr(0, 3) == "../") {
        url = urlSourceParts.slice(0, urlSourceParts.length - 1).join("/") + "/" + url.substr(3);
      } else if(url.charAt(0) == "/") {
        url = root + url;
      } else {
        url = urlSource + "/" + url;
      }
    }
    if(removeHash && url.indexOf("#") != -1) url = url.split('#')[0];
    if(url.substr(-1) == "/") url = url.substr(0, url.length - 1);

    index = url.indexOf('/../');
    while(index != -1) {
      blocks = url.split('/../');
      parts = blocks[0].replace("//", "**").split("/");
      url = parts.slice(0, parts.length - 1).join("/").replace("**", "//") + ("/" + blocks.slice(1).join("/../"));
      index = url.indexOf('/../');
    }

    if(url.indexOf('./') != -1) {
      parts = url.replace("//", "**").split("/");
      if(parts[0].substr(-1) == ".") {
        parts[0] = parts[0].substr(0, parts[0].length - 1);
        url = parts.join('/').replace("**", "//");
      }
    }

    url = url.trim();

    if(url.substr(-1) == "/") url = url.substr(0, url.length - 1);

    if(url == urlSource) continue;
    //console.log(urlSource+' | '+originalUrl+' -> '+url);
    urls.push(url);
  }

  urls = urls.getWithoutRepetitions();

  return urls;
};


/**
 * validates is string contains another string, as string or word (space or punctuation boundaries)
 * @param {String} text string to be validated
 * @param {String} string string or word to be searched
 *
 * @param {Boolean} asWord if true a word will be searched (false by default)
 * @param {Boolean} caseSensitive (false by default)
 * @return {Boolean} returns true if string or word is contained
 */
StringOperators.textContainsString = function(text, string, asWord, caseSensitive) {
  text = caseSensitive ? string : text.toLowerCase();
  string = caseSensitive ? string : string.toLowerCase();
  return asWord ?
    text.match(new RegExp("\\b" + string + "\\b")).length > 0 :
    text.indexOf(string) != -1;
};

/**
 * print a string in console
 * @param  {String} string to be printed in console
 * @param  {Boolean} frame  if true (default) prints ///////////////// on top and bottom
 * tags:
 */
StringOperators.logInConsole = function(string, frame) {
  frame = frame == null ? true : frame;
  if(frame) console.log('///////////////////////////////////////////////////');
  console.log(string);
  if(frame) console.log('///////////////////////////////////////////////////');
};




//////


/**
 * @todo finish docs
 */
StringOperators.getParenthesisContents = function(text, brackets) {
  var contents = new StringList();

  var subText = text;

  var contentObject = StringOperators.getFirstParenthesisContentWithIndexes(text, brackets);

  var nAttempts = 0;
  while(contentObject.content !== "" && contentObject.index1 < subText.length - 1 && nAttempts < text.length) {
    contents.push(contentObject.content);
    subText = subText.substr(contentObject.index1 + 2);
    contentObject = StringOperators.getFirstParenthesisContentWithIndexes(subText, brackets);
    nAttempts++;
  }

  return contents;
};

/**
 * @todo finish docs
 */
StringOperators.getFirstParenthesisContent = function(text, brackets) {
  return StringOperators.getFirstParenthesisContentWithIndexes(text, brackets).content;
};

/**
 * @todo finish docs
 */
StringOperators.getFirstParenthesisContentWithIndexes = function(text, brackets) {
  var open = brackets ? "[" : "(";
  var close = brackets ? "]" : ")";

  var openRegEx = brackets ? /\[/g : /\(/g;
  var closeRegEx = brackets ? /\]/g : /\)/g;

  var indexOpen = text.indexOf(open);

  if(indexOpen == -1) return {
    "content": "",
    "index0": 0,
    "index1": 0
  };

  var indexClose = text.indexOf(close);

  var part = text.substring(indexOpen + 1, indexClose);

  var openMatch = part.match(openRegEx);
  var closeMatch = part.match(closeRegEx);

  var nOpen = (openMatch == null ? 0 : openMatch.length) - (closeMatch == null ? 0 : closeMatch.length);
  var nAttempts = 0;


  while((nOpen > 0 || indexClose == -1) && nAttempts < text.length) {
    indexClose = text.indexOf(close, indexClose);
    part = text.substring(indexOpen + 1, indexClose + 1);
    indexClose++;
    openMatch = part.match(openRegEx);
    closeMatch = part.match(closeRegEx);
    nOpen = (openMatch == null ? 0 : openMatch.length) - (closeMatch == null ? 0 : closeMatch.length);

    nAttempts++;
  }
  indexClose = text.indexOf(close, indexClose);

  return {
    "content": indexClose == -1 ? text.substring(indexOpen + 1) : text.substring(indexOpen + 1, indexClose),
    "index0": indexOpen + 1,
    "index1": indexClose == -1 ? (text.length - 1) : (indexClose - 1)
  };
};

/**
 * @todo finish docs
 */
StringOperators.placeString = function(string, stringToPlace, index) {
  return string.substr(0, index) + stringToPlace + string.substr(index + stringToPlace.length);
};

/**
 * @todo finish docs
 */
StringOperators.insertString = function(string, stringToInsert, index) {
  return string.substr(0, index) + stringToInsert + string.substr(index);
};

/**
 * transforms a text by performing multiple optional cleaning operations (applied in the same order as parameters suggest)
 * @param {String} string to be transformed
 *
 * @param {Boolean} removeEnters
 * @param {Boolean} removeTabs
 * @param {String} replaceTabsAndEntersBy
 * @param {Boolean} removePunctuation
 * @param {Boolean} toLowerCase
 * @param {StringList} stopWords removes strings from text
 * @param {Boolean} removeDoubleSpaces
 * @param {Boolean} removeAccentsAndDiacritics removes accents and diacritics from characters
 * @return {String}
 * tags:filter
 */
StringOperators.cleanText = function(string, removeEnters, removeTabs, replaceTabsAndEntersBy, removePunctuation, toLowerCase, stopWords, removeDoubleSpaces, removeAccentsAndDiacritics){
  if(string==null) return null;
  
  //console.log("string["+string+"]");

  if(removeEnters) string = StringOperators.removeEnters(string, replaceTabsAndEntersBy);
  if(removeTabs) string = StringOperators.removeTabs(string, replaceTabsAndEntersBy);
  if(removePunctuation) string = StringOperators.removePunctuation(string);
  if(toLowerCase) string = string.toLowerCase();

  if(stopWords!=null){
    string = StringOperators.replaceStringsInText(string, stopWords, "", true);
  }

  if(removeDoubleSpaces) string = StringOperators.removeDoubleSpaces(string);

  if(removeAccentsAndDiacritics) string = StringOperators.removeAccentsAndDiacritics(string);

  return string;
};

/**
 * removes enters from string
 * @param {String} string to be transformed

 * @param {String} replaceBy optional string to replace enters
 * @return {String}
 * tags:
 */
StringOperators.removeEnters = function(string, replaceBy) {
  if(string==null) return null;
  replaceBy = replaceBy==null?"":replaceBy;
  var r = new RegExp('\\'+StringOperators.ENTER+'|\\'+StringOperators.ENTER2+'|\\'+StringOperators.ENTER3,'gi');
  return string.replace(r, replaceBy);
};

/**
 * removes tabs from string
 * @param {String} string to be transformed

 * @param {String} replaceBy optional string to replace tabs
 * @return {String}
 * tags:
 */
StringOperators.removeTabs = function(string, replaceBy) {
  if(string==null) return null;
  replaceBy = replaceBy || "";
  var r = new RegExp('\\'+StringOperators.TAB+'|\\'+StringOperators.TAB2+'|\\t','gi');
  return string.replace(r, replaceBy);
};

/**
 * removes punctuation from a string, using regex /[:,.;?!\(\)\"\']/gi
 * @param {String} string to be transformed

 * @param {String} replaceBy optional string to replace punctuation signs
 * @return {String}
 * tags:
 */
StringOperators.removePunctuation = function(string, replaceBy) {
  if(string==null) return null;
  replaceBy = replaceBy || "";
  return string.replace(/[:,.;?!\(\)\"\']/gi, replaceBy);
};

/**
 * removes double spaces from a string
 * @param {String} string to be transformed
 * @return {String}
 * tags:
 */
StringOperators.removeDoubleSpaces = function(string) {
  if(string==null) return null;
  var retString = string;
  var regExpr = RegExp(/  /);
  while(regExpr.test(retString)) {
    retString = retString.replace(regExpr, " ");
  }
  return retString;
};

/**
 * @todo finish docs
 */
StringOperators.removeInitialRepeatedCharacter = function(string, character) {
  if(string==null) return null;
  while(string.charAt(0) == character) string = string.substr(1);
  return string;
};


/**
 * takes plain text from html
 * @param  {String} html
 * @return {String}
 * tags:
 */
StringOperators.removeHtmlTags = function(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText;
};

/**
 * @todo finish docs
 */
StringOperators.removeLinks = function(text) {
  text += ' ';
  var regexp = /https*:\/\/[a-zA-Z0-9\/\.]+( |:|;|\r|\t|\n|\v)/g;
  return(text.replace(regexp, ' ')).substr(0, text.length - 2);
};

/**
 * @todo finish docs
 */
StringOperators.removeQuotes = function(string) { //TODO:improve
  if(string.charAt(0) == "\"") string = string.substr(1);
  if(string.charAt(string.length - 1) == "\"") string = string.substr(0, string.length - 1);
  return string;
};

// StringOperators.trim = function(string){
// 	return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
// }



StringOperators.removeAccentsAndDiacritics = function(string) {
  var r = string.replace(new RegExp(/[àáâãäå]/g), "a");
  r = r.replace(new RegExp(/æ/g), "ae");
  r = r.replace(new RegExp(/ç/g), "c");
  r = r.replace(new RegExp(/[èéêë]/g), "e");
  r = r.replace(new RegExp(/[ìíîï]/g), "i");
  r = r.replace(new RegExp(/ñ/g), "n");
  r = r.replace(new RegExp(/[òóôõö]/g), "o");
  r = r.replace(new RegExp(/œ/g), "oe");
  r = r.replace(new RegExp(/[ùúûü]/g), "u");
  r = r.replace(new RegExp(/[ýÿ]/g), "y");

  r = r.replace(new RegExp(/[ÀÁÂÄÃ]/g), "A");
  r = r.replace(new RegExp(/Æ/g), "AE");
  r = r.replace(new RegExp(/Ç/g), "c");
  r = r.replace(new RegExp(/[ÈÉÊË]/g), "E");
  r = r.replace(new RegExp(/[ÌÍÎÏ]/g), "I");
  r = r.replace(new RegExp(/Ñ/g), "N");
  r = r.replace(new RegExp(/[ÒÓÔÖÕ]/g), "O");
  r = r.replace(new RegExp(/Œ/g), "OE");
  r = r.replace(new RegExp(/[ÙÚÛÜ]/g), "U");
  r = r.replace(new RegExp(/[Ÿ]/g), "Y");

  return r;
};

/**
 * creates a table with frequent words and occurrences numbers
 * @param  {String} string text to be analyzed
 *
 * @param  {StringList|Number} stopWords optional list of stop words, if values is 1 default stop words will be used
 * @param  {Boolean} includeLinks
 * @param  {Number} limit max size of rows
 * @param  {Number} minSizeWords
 * @return {Table} contains a list of words, and a numberList of occurrences
 * tags:words
 */
StringOperators.getWordsOccurrencesTable = function(string, stopWords, includeLinks, limit, minSizeWords) {
  if(string == null) return;
  if(string.length === 0) return new Table(new StringList(), new NumberList());

  if(stopWords==1) stopWords = StringOperators.STOP_WORDS;

  var words = StringOperators.getWords(string, false, stopWords, false, includeLinks, null, minSizeWords);
  var table;
  if(limit != null)
    table = words.getFrequenciesTable(true).sliceRows(0, limit-1);
  else
    table = words.getFrequenciesTable(true);
  return table;// ListOperators.countElementsRepetitionOnList(words, true, false, limit);
};


/**
 * @todo finish docs
 */
StringOperators.indexesOf = function(text, string) { //TODO:test
  var index = text.indexOf(string);
  if(index == -1) return new NumberList();
  var indexes = new NumberList(index);
  index = text.indexOf(string, index + 1);
  while(index != -1) {
    indexes.push(index);
    index = text.indexOf(string, index + 1);
  }
  return indexes;
};

/**
 * returns a string repeated a number of times
 * @param  {String} text to be repeated
 * @param  {Number} n number of repetitions
 * @return {String}
 * tags:
 */
StringOperators.repeatString = function(text, n) {
  var i;
  var newText = "";
  for(i = 0; i < n; i++) {
    newText += text;
  }
  return newText;
};




//counting / statistics

/**
 * count the number of occurrences of a string into a text
 * @param {String} text
 * @param {String} string
 *
 * @param {Boolean} asWord if false (default) searches for substring, if true searches for word
 * @return {Number} number of occurrences
 * tags:count
 */
StringOperators.countOccurrences = function(text, string, asWord) { //seems to be th emost efficient: http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
  if(asWord) return StringOperators.countWordOccurrences(text, string);

  var n = 0;
  var index = text.indexOf(string);
  while(index != -1) {
    n++;
    index = text.indexOf(string, index + string.length);
  }
  return n;
};

/**
 * @todo finish docs
 */
StringOperators.countWordOccurrences = function(string, word) {
  var regex = new RegExp("\\b" + word + "\\b");
  return StringOperators.countRegexOccurrences(string, regex);
};

/**
 * @todo finish docs
 */
StringOperators.countRegexOccurrences = function(string, regex) {
  var match = string.match(regex);
  return match == null ? 0 : match.length;
};

/**
 * count the number of occurrences of a list of strings into a text
 * @param {String} text
 * @param {StringList} strings
 *
 * @param {Boolean} asWords if false (default) searches for substrings, if true searches for words
 * @return {NumberList} number of occurrences per string
 * tags:count
 */
StringOperators.countStringsOccurrences = function(text, strings, asWords) {
  if(text==null || strings==null) return;

  var i;
  var numberList = new NumberList();
  var nStrings = strings.length;
  for(i = 0; i<nStrings; i++) {
    if(asWords){
      numberList[i] = StringOperators.countRegexOccurrences(text, new RegExp("\\b" + strings[i] + "\\b"));
    } else {
      numberList[i] = StringOperators.countOccurrences(text, strings[i]);
    }
  }
  return numberList;
};

//validation

/**
 * @todo finish docs
 */
StringOperators.validateEmail = function(text) {
  return StringOperators.MAIL_REGEX.test(text);
};

/**
 * @todo finish docs
 */
StringOperators.validateUrl = function(text) {
  return StringOperators.LINK_REGEX.test(text);
};


/**
 * creates an html string that depicts a proprtions bar with colors for categories
 * @param  {NumberList} normalizedWeights normalized weights
 *
 * @param  {Number} nChars width in characters
 * @param  {ColorList} colors list of categorical colors
 * @param  {String} character character or characters to be used as primitive
 * @return {String} html depciting colored segments forming a bar in a single line
 */
StringOperators.createsCategoricalColorsBlocksHtml = function(normalizedWeights, nChars, colors, character){
  if(normalizedWeights==null) return "";

  var bars="";

  nChars = nChars==null?20:nChars;
  colors = colors==null?ColorListGenerators.createDefaultCategoricalColorList(normalizedWeights.length):colors;
  character = character==null?"█":character;

  normalizedWeights.forEach(function(w, j){
    w = Math.floor(w*nChars) +  ( (w*nChars - Math.floor(w*nChars))>Math.random()?1:0 );
    bars += "<font color=\""+ColorOperators.colorStringToHEX(colors[j])+"\">";
    for(var i=0; i<w; i++){
      bars += character;
    }
    bars += "</f>";
  });

  return bars;
};

/**
 * calculate the Levenshtein (aka edit) Distance between two strings
 * @param {String} text1
 * @param {String} text2
 *
 * @return {Number} edit distance
 * tags:distance
 */
StringOperators.getLevenshteinDistance = function(a, b) {
/*
Copyright (c) 2011 Andrei Mackenzie
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
  if(a.length === 0) return b.length; 
  if(b.length === 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row 
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};


StringOperators.isAbsoluteUrl = function(string){
  if(string==null) return null;

  var cases = ["http://", "https://", "fttp://", "fttps://"];
  for(var i=0; i<cases.length; i++){
    if(string.indexOf(cases[i])===0) return true;
  }

  return false;
};

/**
 * builds a stringList of word sequences contained in the text
 * @param  {String} string text to be analyzed
 *
 * @param  {Number} minSequenceSize least amount of words in sequence (default:2)
 * @param  {Number} maxSequenceSize most amount of words in sequence (default:2)
 * @param  {Boolean|StringList} stopWords do not allow stop words (true for default stop words, or stringList of words)
 * @param  {Number} limit to the number of sequences
 * @param  {Number} minSizeWords minimal number of characters of words
 * @return {StringList}
 * tags:
 */
StringOperators.getNgrams = function(string, minSequenceSize, maxSequenceSize, stopWords, limit, minSizeWords) {
  
  minSequenceSize = minSequenceSize || 2;
  maxSequenceSize = maxSequenceSize || 2;
  if(maxSequenceSize < minSequenceSize) maxSequenceSize = minSequenceSize;
  minSizeWords = minSizeWords || 0;
  limit = limit == null ? 0 : limit;
  if(stopWords===true) stopWords = StringOperators.STOP_WORDS;

  var i, j, sSeq;

  // get all the words
  var words = StringOperators.getWords(string, false, false, false, false, null, 1);
  var sLSequences = new StringList();
  if(words == null) return sLSequences;

  for(i=0; i<words.length; i++){
    sSeq = words[i];
    if(stopWords && stopWords.indexOf(words[i]) != -1) continue;
    if(minSizeWords && words[i].length < minSizeWords) continue;
    for(j=i+1; j < words.length && j < i+maxSequenceSize; j++){
      if(stopWords && stopWords.indexOf(words[j]) != -1) break;
      if(minSizeWords && words[j].length < minSizeWords) break;
      if(j >= i + minSequenceSize - 1){
        sSeq = sSeq + ' ' + words[j];
        sLSequences.push(sSeq);
        if(limit !== 0 && sLSequences.length == limit) break;
      }
    }
    if(limit !== 0 && sLSequences.length == limit) break;
  }
  return sLSequences;
}

