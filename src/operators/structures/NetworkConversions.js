import Network from "src/dataTypes/structures/networks/Network";
import Table from "src/dataTypes/lists/Table";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import Node from "src/dataTypes/structures/elements/Node";
import Relation from "src/dataTypes/structures/elements/Relation";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import ListGenerators from "src/operators/lists/ListGenerators";
import { typeOf } from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc Includes functions to convert Networks into other DataTypes.
 *
 * @namespace
 * @category networks
 */
function NetworkConversions() {}
export default NetworkConversions;


/**
 * Builds the adjacent matrix of a network.
 * @param {Network} network
 *
 * @param {Boolean} useIds use nodes ids (default), or nodes names as labels
 * @param {Boolean} includeLabelsList (default: false) first list is labels (nodes ids or names)
 * @param {Number} countMode 0:count number of relations<br>1:add relations weights
 * @return {Table} if labels are not added the result is a NumberTable
 * tags:conversion
 */
NetworkConversions.NetworkToTable = function(network, useIds, includeLabelsList, countMode){
  if(network==null) return;

  useIds = useIds==null?true:useIds;
  countMode = countMode==null?0:countMode;

  var table = includeLabelsList?new Table():new NumberTable();
  var labels = useIds?network.nodeList.getIds():network.nodeList.getNames();
  labels.name = "node names";
  if(includeLabelsList) table[0] = labels;

  var list;
  var nNodes = network.nodeList.length;
  var nRelations = network.relationList.length;
  var i;
  var relation;
  var indexesDictionary = {};

  var indexOffset = includeLabelsList?1:0;

  for(i=0; i<nNodes; i++){
    list = ListGenerators.createListWithSameElement(nNodes, 0);
    list.name = labels[i];
    table.push(list);
    indexesDictionary[network.nodeList[i].id] = i;
  }

  for(i=0; i<nRelations; i++){
    relation = network.relationList[i];
    if(countMode===0){
      table[indexesDictionary[relation.node0.id]+indexOffset][indexesDictionary[relation.node1.id]]++;
    } else {
      table[indexesDictionary[relation.node0.id]+indexOffset][indexesDictionary[relation.node1.id]]+=relation.weight;
    }
  }

  return table;
};


/**
 * Builds a Network based on a two columns Table, creating relations on co-occurrences, or a square NumberTable read as an adjacentMatrix.
 * @param {Table} table table with at least two columns (categories that will generate the nodes)
 *
 * @param {NumberList} numberList Weights of relations.
 * @param {Number} threshold Minimum weight or number of co-occurrences to create a relation.
 * @param {Boolean} allowMultipleRelations (false by default)
 * @param {Number} minRelationsInNode Remove nodes with number of relations below threshold.
 * @param {StringList} stringList Contents of relations, or names of nodes in case of table being an adjacent matrix (square NumberTable)
 * @return {Network}
 * tags:conversion
 */
NetworkConversions.TableToNetwork = function(table, numberList, threshold, allowMultipleRelations, minRelationsInNode, stringList) {
  if(table == null || !table.isTable || table[0] == null || table[1] == null) return;

  var nElements;
  var node0;
  var node1;
  var name0;
  var name1;
  var relation;
  var i, j;
  var list;
  var network = new Network();

  threshold = threshold==null?0:threshold;

  console.log(table.type);
  console.log(table.type == "NumberTable", table.length > 2, table.length==table[0].length);

  if(table.type == "NumberTable" && table.length > 2  && table.length==table[0].length){
    nElements = table.length;

    for(i=0; i<nElements; i++){
      name0 = stringList==null?( (table[i].name==null || table[i].name=="")?"node_"+i:table[i].name ):stringList[i];
      node0 = new Node(name0, name0);
      network.addNode(node0);
    }

    for(i=0; i<nElements; i++){
      list = table[i];
      node0 = network.nodeList[i];
      for(j=0; j<nElements; j++){
        node1 = network.nodeList[j];
        if(list[j]>threshold){
          relation = new Relation(i+"_"+j,i+"_"+j,node0, node1, list[j]);
          network.addRelation(relation);
        }
      }
    }

    return network;
  }


  //trace("••••••• createNetworkFromPairsTable", table);
  if(allowMultipleRelations == null) allowMultipleRelations = false;
  if(table.length < 2) return null;
  
  

  if(numberList == null) {
    nElements = Math.min(table[0].length, table[1].length);
  } else {
    nElements = Math.min(table[0].length, table[1].length, numberList.length);
  }

  //trace("nElements", nElements);

  if(numberList == null && table.length > 2 && typeOf(table[2]) == "NumberList" && table[2].length >= nElements) numberList = table[2];


  if(typeOf(table[0]) == NodeList && typeOf(table[1]) == NodeList) {
    //....    different methodology here
  }

  
  for(i = 0; i < nElements; i++) {
    name0 = "" + table[0][i];
    name1 = "" + table[1][i];
    //trace("______________ i, name0, name1:", i, name0, name1);
    node0 = network.nodeList.getNodeById(name0);
    if(node0 == null) {
      node0 = new Node(name0, name0);
      network.addNode(node0);
    } else {
      node0.weight++;
    }
    node1 = network.nodeList.getNodeById(name1);
    if(node1 == null) {
      node1 = new Node(name1, name1);
      network.addNode(node1);
    } else {
      node1.weight++;
    }
    if(numberList == null) {
      relation = network.relationList.getFirstRelationByIds(node0.id, node1.id, false);
      if(relation == null ||  allowMultipleRelations) {
        relation = new Relation(name0 + "_" + name1 + network.relationList.length, name0 + "_" + name1, node0, node1, 1);
        network.addRelation(relation);
      } else {
        relation.weight++;
      }
    } else if(numberList[i] > threshold) {
      relation = new Relation(name0 + "_" + name1, name0 + "_" + name1, node0, node1, numberList[i]);
      network.addRelation(relation);
    }

    if(stringList) relation.content = stringList[i];
  }

  if(minRelationsInNode) {
    for(i = 0; network.nodeList[i] != null; i++) {
      if(network.nodeList[i].relationList.length < minRelationsInNode) {
        network.removeNode(network.nodeList[i]);
        i--;
      }
    }
  }

  return network;
};
