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

  for(i=0; i<nLists; i++){
    list = table[i];
    if(list.length!=nElements) return null;
    for(j=0; j<nElements; j++){
      element = list[j];
      
      id = TreeConversions._getId(table, i, j);
      node = tree.nodeList.getNodeById(id);
      if(node == null) {
        node = new Node(id, String(element));
        if(i === 0) {
          tree.addNodeToTree(node, father);
        } else {
          parent = tree.nodeList.getNodeById(TreeConversions._getId(table, i - 1, j));
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


  // table.forEach(function(list, i) {
  //   table[i].forEach(function(element, j) {
  //     id = TreeConversions._getId(table, i, j);
  //     node = tree.nodeList.getNodeById(id);
  //     if(node == null) {
  //       node = new Node(id, String(element));
  //       if(i === 0) {
  //         tree.addNodeToTree(node, father);
  //       } else {
  //         parent = tree.nodeList.getNodeById(TreeConversions._getId(table, i - 1, j));
  //         tree.addNodeToTree(node, parent);
  //       }
  //     }
  //   });
  // });

  tree.assignDescentWeightsToNodes();

  return tree;
};

/**
 * @todo write docs
 */
TreeConversions._getId = function(table, i, j) {
  var iCol = 1;
  var id = String(table[0][j]);
  while(iCol <= i) {
    id += "_" + String(table[iCol][j]);
    iCol++;
  }
  return id;
};
