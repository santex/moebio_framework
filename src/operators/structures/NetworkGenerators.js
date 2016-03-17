import Node from "src/dataTypes/structures/elements/Node";
import Relation from "src/dataTypes/structures/elements/Relation";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import Network from "src/dataTypes/structures/networks/Network";
import Table from "src/dataTypes/lists/Table";
import StringOperators from "src/operators/strings/StringOperators";
import StringListOperators from "src/operators/strings/StringListOperators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import TableOperators from "src/operators/lists/TableOperators";
import NumberOperators from "src/operators/numeric/NumberOperators";
import StringList from "src/dataTypes/strings/StringList";
import NetworkEncodings from "src/operators/structures/NetworkEncodings";

/**
 * @classdesc NetworkGenerators provides a set of tools to generate Network
 * instances from a variety of sources.
 * @namespace
 * @category networks
 */
function NetworkGenerators() {}
export default NetworkGenerators;


/**
 * Build a random network based on the provided options
 * @param {Number} nNodes number of nodes
 * @param {Number} pRelationOrNumberOfRelations if value<1 it's G(n,p) aka Poisson random graph, the probability of a relation being created between 2 nodes, otherwise it's G(n,m) the number of relations
 *
 * @param {Number} mode <br>0:simple random G(n,p) or G(n,m)<br>1:clusterized
 * @param {Boolean} randomRelationsWeights adds a random weigth to relations
 * @param {Number} seed random seed for stable random generation
 * @return {Network}
 * @example
 * // generate a sparsely connected network with 2000 Nodes
 * network = NetworkGenerators.createRandomNetwork(2000, 0.0006, 1);
 * tags:
 */
NetworkGenerators.createRandomNetwork = function(nNodes, pRelationOrNumberOfRelations, mode, randomRelationsWeights, seed) {
  if(nNodes == null || pRelationOrNumberOfRelations == null) return null;

  var funcRandom;

  if(seed!=null){
    funcRandom = function(){
      seed++;
     return NumberOperators.getRandomWithSeed(seed);
   };
  } else {
    funcRandom = Math.random;
  }

  mode = mode == null ? 0 : mode;

  var i, j;
  var network = new Network();
  var node;

  for(i = 0; i < nNodes; i++) {
    network.addNode(new Node("n" + i, "n" + i));
  }

  switch(mode) {
    case 0:
      if(pRelationOrNumberOfRelations<1){
        for(i = 0; i < nNodes - 1; i++) {
          node = network.nodeList[i];
          for(j = i + 1; j < nNodes; j++) {
            if(funcRandom() < pRelationOrNumberOfRelations) network.addRelation(new Relation(i + "_" + j, i + "_" + j, node, network.nodeList[j], randomRelationsWeights ? funcRandom() : 1));
          }
        }
      } else {
        pRelationOrNumberOfRelations = Math.min(pRelationOrNumberOfRelations, nNodes*(nNodes-1)*0.5);
        while(network.relationList.length<pRelationOrNumberOfRelations){
          i = Math.floor(funcRandom()*nNodes);
          j = Math.floor(funcRandom()*nNodes);
          if(i!=j && network.relationList.getNodeById(i + "_" + j)==null){
            network.addRelation(new Relation(i + "_" + j, i + "_" + j, network.nodeList[i], network.nodeList[j], randomRelationsWeights ? funcRandom() : 1));
          }
        }
      }
      
      return network;
    case 1:
      var nPairs = nNodes * (nNodes - 1) * 0.5;
      var pending;
      var maxDegree = 0;
      var otherNode;
      var id;
      for(i = 0; i < nPairs; i++) {
        if(funcRandom() < pRelationOrNumberOfRelations) {
          pending = true;
          while(pending) {
            node = network.nodeList[Math.floor(network.nodeList.length * funcRandom())];
            if(funcRandom() < (node.nodeList.length + 1) / (maxDegree + 1)) {
              while(pending) {
                otherNode = network.nodeList[Math.floor(network.nodeList.length * funcRandom())];
                id = node.id + "_" + otherNode.id;
                if(network.relationList.getNodeById(id) != null || network.relationList.getNodeById(otherNode.id + "_" + node.id) != null) continue;
                if(funcRandom() < (otherNode.nodeList.length + 1) / (maxDegree + 1)) {
                  network.addRelation(new Relation(id, id, node, otherNode, randomRelationsWeights ? funcRandom() : 1));
                  pending = false;
                }
              }
            }
          }
        }
      }
      return network;
  }
};


/**
 * Build a random network based on words co-occurrences in a list of texts, each text has an associated node
 * @param {StringList} nNodes number of nodes
 *
 * @param {Number} threshold minimum cosine similarity value to create a relation (default 0.7)
 * @param {StringList} titles optional names for nodes
 * @param {StringList|Number} stopWords optional list of words to overlook in analysis (if stopWords is 1 predefined english stopwords StringOperators.STOP_WORDS will be used)
 * @return {Network} network of texts, nodes will have extra parameters text (with original texts) and freqTable (table with words and frequencies)
 * tags:
 */
NetworkGenerators.createNetworkFromTexts = function(stringList, threshold, titles, stopWords){
  if(stringList==null) return;
  if(threshold==null) threshold = 0.7;
  if(stopWords==1) stopWords = StringOperators.STOP_WORDS;

  var i, j;
  var nTexts = stringList.length;
  
  var freqTablesList = new Table();

  for(i=0; i<nTexts; i++){
    freqTablesList[i] = StringOperators.getWordsOccurrencesTable(stringList[i], stopWords, true, 200, 3);
  }
  
  if(titles==null){
    titles = new StringList();
    for(i=0; i<nTexts; i++){
      titles[i] = "text "+i;
    }
  }
  var net = NetworkGenerators.createNetworkFromListAndFunction(freqTablesList, TableOperators.cosineSimilarityDataTables, titles, threshold, 2);
  for(i=0; i<nTexts; i++){
    net.nodeList[i].text = stringList[i];
    net.nodeList[i].freqTable = freqTablesList[i];
  }
  return net;
};


/**
 * @param strings
 * @param texts
 * @param {Number} weightsForRelationsMethod
 * <ul>
 * <li><strong>0</strong>: dotProduct (more efficient)</li>
 * <li><strong>1</strong>: {@link http://en.wikipedia.org/wiki/Cosine_similarity|cosinus similarity}</li>
 *
 */
NetworkGenerators.createTextsCoOccurrencesNetwork = function(strings, texts, weightsForRelationsMethod, minimum) {
  var occurrencesTable = StringListOperators.countStringsOccurrencesOnTexts(strings, texts, weightsForRelationsMethod, minimum);
  return NetworkGenerators.createNetworkFromOccurrencesTable(occurrencesTable);
};

/**
 * @todo write docs
 */
NetworkGenerators.createNetworkFromOccurrencesTable = function(occurrencesTable, weightsForRelationsMethod, minimum) {
  weightsForRelationsMethod = weightsForRelationsMethod == null ? 0 : weightsForRelationsMethod;
  minimum = minimum == null ? 0 : minimum;

  var network = new Network();
  var i;
  var j;
  var string0;
  var string1;
  var weight;
  var node0;
  var node1;
  var norm0;
  var norm1;
  for(i = 0; occurrencesTable[i] != null; i++) {
    string0 = occurrencesTable[i].name;
    if(i === 0) {
      node0 = new Node(string0, string0);
      network.addNode(node0);
    } else {
      node0 = network.nodeList[i];
    }
    norm0 = occurrencesTable[i].getSum();
    node0.weight = norm0;
    for(j = i + 1; occurrencesTable[j] != null; j++) {
      string1 = occurrencesTable[j].name;
      if(i === 0) {
        node1 = new Node(string1, string1);
        network.addNode(node1);
      } else {
        node1 = network.nodeList[j];
      }
      norm1 = occurrencesTable[j].getSum();
      node1.weight = norm1;

      switch(weightsForRelationsMethod) {
        case 0:
          weight = occurrencesTable[i].dotProduct(occurrencesTable[j]);
          break;
        case 1:
          weight = NumberListOperators.cosinus(occurrencesTable[i], occurrencesTable[j]);
          break;
      }

      if(weight > minimum) {
        network.createRelation(node0, node1, string0 + "_" + string1, weight);
      }
    }
  }

  return network;
};

/**
 * Creates a network using a list and measuring the relation weight with a given method
 * a Relation is created between two nodes if and only if the returned weight is > 0
 * @param {List} list List of objects that define the nodes
 * @param {Function} weightFunction method used to eval each pair of nodes
 *
 * @param {StringList} names optional, names of Nodes
 * @param {Number} threshold (default: 0.3)
 * @param {Number} weightMode relations weight mode<br>0: weight<br>1:weight -  threshold<br>2:(weight -  threshold)/(1 - threshold)
 * @return {Network} a network with number of nodes equal to the length of the List
 * tags:
 */
NetworkGenerators.createNetworkFromListAndFunction = function(list, weightFunction, names, threshold, weightMode) {
  if(list==null || weightFunction==null) return;

  var i, j;
  var w;
  var node, node1;
  var network = new Network();
  var n = list.length;

  threshold = threshold==null?0.3:threshold;

  for(i=0; i<n; i++){
    network.addNode(new Node("n_"+i, names == null ? "n_"+i : names[i]));
  }

  for(i=0; i<n; i++){
    node = network.nodeList[i];
    for(j=i+1; j<n; j++){
      node1 = network.nodeList[j];
      w = weightFunction(list[i], list[j]);
      if(Math.random()<0.0001) console.log(i,j,w);
      if(w > threshold) {
        if(weightMode>0) w -= threshold;
        if(weightMode==2) w /= (1-threshold);
        network.addRelation(new Relation(i + "_" + j, i + "_" + j, node, node1, w));
      }
    }
  }

  return network;
};


/**
 * Builds a network from a text, using previously detected words or noun phrases, and with relations built from co-occurrences in sentences
 * relations contain as description the part of the sentence that ends with the second node name (thus being compatible with NoteWork)
 * @param  {String} text
 * @param  {StringList} nounPhrases words, n-grams or noun phrases
 *
 * @param {String} splitCharacters split blocks by characters defined as string regexp expression (defualt:"\.|\n"), blocks determine relations
 * @return {Network}
 * tags:
 */
NetworkGenerators.createNetworkFromTextAndWords = function(text, nounPhrases, splitCharacters) {
  if(text == null || nounPhrases == null) return null;

  splitCharacters = splitCharacters == null ? "\\.|\\n" : splitCharacters;

  var network = new Network();

  nounPhrases = nounPhrases.getWithoutElements(new StringList("", " ", "\n"));

  nounPhrases.forEach(function(np) {
    np = NetworkEncodings._simplifyForNoteWork(np);
    if(np) nounPhrases.push(np);
  });

  nounPhrases = nounPhrases.getWithoutRepetitions();

  var sentences = text.split(new RegExp(splitCharacters, "g"));

  var node, relation;
  var index;
  var node0;
  var regex;
  var id;

  var mat;

  var nodesInSentence;
  var maxWeight, maxNode;

  nounPhrases.forEach(function(np) {
    node = new Node(np, np);
    network.addNode(node);
    mat = text.match(NetworkEncodings._regexWordForNoteWork(np));
    node.weight = mat == null ? 1 : mat.length;
  });

  sentences.forEach(function(sentence) {
    sentence = sentence.trim();
    nodesInSentence = new NodeList();
    maxWeight = 0;
    nounPhrases.forEach(function(np) {
      node0 = network.nodeList.getNodeById(np);
      regex = NetworkEncodings._regexWordForNoteWork(np);
      index = sentence.search(regex);

      if(index != -1) {
        maxNode = node0.weight > maxWeight ? node0 : maxNode;
        maxWeight = Math.max(node0.weight, maxWeight);
        if(node0 != maxNode) nodesInSentence.push(node0);
        // nounPhrases.forEach(function(np1){
        // 	regex = NetworkEncodings._regexWordForNoteWork(np1);
        // 	index2 = sentence.search(regex);
        // 	if(index2!=-1){
        // 		node1 = network.nodeList.getNodeById(np1);

        // 		relation = network.relationList.getFirstRelationBetweenNodes(node0, node1, false);

        // 		if(relation==null){
        // 			if(index<index2){
        // 				id = node0.id+"_"+node1.id+"|"+sentence;
        // 				relation = new Relation(id, id, node0, node1);
        // 			} else {
        // 				id = node1.id+"_"+node0.id+"|"+sentence;
        // 				relation = new Relation(id, id, node1, node0);
        // 			}
        // 			relation.content = sentence;//.substr(0, index3+1).trim();
        // 			relation.paragraphs = new StringList(relation.content);
        // 			network.addRelation(relation);
        // 		} else {
        // 			relation.paragraphs.push(sentence);
        // 		}
        // 	}
        // });
      }
    });


    nodesInSentence.forEach(function(node0) {
      id = maxNode.id + "_" + node0.id + "|" + sentence;
      relation = new Relation(id, id, maxNode, node0);
      relation.content = sentence;
      network.addRelation(relation);
    });


  });

  //nested NPs (example: "health", "health consequences")
  network.nodeList.forEach(function(node0) {
    regex = NetworkEncodings._regexWordForNoteWork(node0.id);
    network.nodeList.forEach(function(node1) {
      if(node0 != node1 && node1.id.search(regex) != -1) {
        id = node1.id + "_" + node0.id + "|contains " + node0.id;
        relation = new Relation(id, id, node1, node0);
        relation.content = "contains " + node0.id;
        network.addRelation(relation);
      }
    });
  });

  return network;
};
