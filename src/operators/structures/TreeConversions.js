import Tree from "src/dataTypes/structures/networks/Tree";
import Node from "src/dataTypes/structures/elements/Node";
import NumberList from "src/dataTypes/numeric/NumberList";

/**
 * @classdesc Tools to convert Trees to other data types
 *
 * @namespace
 * @category networks
 */
function TreeConversions() {}
export default TreeConversions;

/**
 * convert a table that describes a tree (higher hierarchies in first lists) into a Tree
 * count ocurrences of leaves in the table and assigns value to nodes weight
 * assigns the index of row associated to leaves in properties: firstIndexInTable and indexesInTable
 * @param {Table} table
 *
 * @param {String} fatherName name of father node
 * @return {Tree}
 * tags:conversion
 */
TreeConversions.TableToTree = function(table, fatherName)  {
  if(table == null) return;

  fatherName = fatherName == null ? "father" : fatherName;

  var tree = new Tree();
  var node, parent;
  var id;

  var father = new Node(fatherName, fatherName);
  tree.addNodeToTree(father, null);

  var nLists = table.length;
  var nElements = table[0].length;
  var i, j;
  var list, element;

  //var nodesDictionary = {};

  for(i=0; i<nLists; i++){
    list = table[i];
    if(list.length!=nElements) return null;
    
    for(j=0; j<nElements; j++){
      //console.log('------------------j:', j);
      element = list[j];
      
      id = TreeConversions._getId(table, i, j);
      node = tree.nodeList.getNodeById(id);
      if(node == null) {
        node = new Node(id, String(element));

        //console.log('\n');
        //console.log(node);
        //nodesDictionary[ (i+"**"+j) ] = node;
        //console.log('+++['+ (i+"**"+j)+']');//'   -->', nodesDictionary[ (i+"**"+j) ]);

        if(i === 0) {
          tree.addNodeToTree(node, father);
        } else {
          
          //parent = nodesDictionary[ ((i-1)+"**"+j) ];// tree.nodeList.getNodeById(TreeConversions._getId(table, i - 1, j)); //<----why it doesn't work??
          parent = tree.nodeList.getNodeById(TreeConversions._getId(table, i - 1, j));
          
          // if(parent==null) {
          //   console.log('<<<['+ ((i-1)+"**"+j)+']' );
          //   console.log('nodesDictionary:', nodesDictionary);
          //   console.log(tree.nodeList);
          //   return;
          // } else {
          //   console.log('√');
          // }

          tree.addNodeToTree(node, parent);
        }

        node.firstIndexInTable = j;
        node.indexesInTable = new NumberList(j);

      } else {
        node.weight++;
        node.indexesInTable.push(j);
      }
    }
  }

  tree.assignDescentWeightsToNodes();

  var _assignIndexesToNode = function(node) {
    var i;
    if(node.toNodeList.length === 0) {
      return node.indexesInTable;
    } else {
      node.indexesInTable = new NumberList();
    }
    for(i = 0; node.toNodeList[i] != null; i++) {
      node.indexesInTable = node.indexesInTable.concat( _assignIndexesToNode(node.toNodeList[i]) );
    }
    return node.indexesInTable;
  };

  _assignIndexesToNode(tree.nodeList[0]);

  return tree;
};

/**
 * @todo write docs
 */
TreeConversions._getId = function(table, i, j) {
  var iCol = 1;
  var id = "_"+String(table[0][j]);
  while(iCol <= i) {
    id += "_" + String(table[iCol][j]);
    iCol++;
  }
  return id;
};
