// Standard lib.
import { strictEqual as assertStrictEqual } from 'assert';

// Constants.
const HELMET_ATTRIBUTE = 'data-helmet';

// Utils.
const { hasOwnProperty } = Object.prototype;

// Helpers.
const extractHelmetNodes = (target, currentNode, dict = {}) => {
  // Ignore nodes without children.
  const { content } = currentNode;
  if (!Array.isArray(content)) {
    return currentNode;
  }

  // Collect helmet nodes from direct child nodes.
  const helmetNodes = content
    .reduce((nodeList, childNode) => {
      const {
        [HELMET_ATTRIBUTE]: key,
        ...attrs
      } = childNode.attrs || {};

      // Move node if it's a helmet node which' key hasn't been moved yet.
      if (typeof key !== 'undefined' && !dict[key]) {
        // eslint-disable-next-line no-param-reassign
        dict[key] = true; // Add to dictionary.
        nodeList.push({ ...childNode, attrs });
      }
      return nodeList;
    }, []);

  // Push helmet nodes onto target.
  target.push(...helmetNodes);

  // Return node without helmet nodes, and recurse into direct children of children.
  return {
    ...currentNode,
    content: content
      .filter(({ attrs }) => !(attrs && hasOwnProperty.call(attrs, HELMET_ATTRIBUTE)))
      .map((childNode) => extractHelmetNodes(target, childNode, dict))
  };
};

// Exports.
export default (tree) => {
  // PostHTML does not provide access to parent nodes, so it is required to
  // walk the entire tree in order to change nodes to another parent.
  const nodesToMove = [];
  tree.match({ tag: 'body' }, (node) => extractHelmetNodes(nodesToMove, node));

  // Append nodes to the first head element only.
  if (nodesToMove.length > 0) {
    tree.match({ tag: 'head' }, (node) => ({
      ...node,
      content: (node.content || []).concat(nodesToMove.splice(0))
    }));
  }

  // Verify head element was found.
  assertStrictEqual(nodesToMove.length, 0, 'Helmet: no head element found');

  return tree;
};
