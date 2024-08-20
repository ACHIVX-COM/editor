export const OBJECT_TYPES = {
  BLOCK: "block",
  LEAF: "leaf",
  TEXT: "text",
  MARK: "mark",
  INLINE: "inline",
};

export const NODE_TYPES = {
  PARAGRAPH: "paragraph",
  VIDEO: "video",
  IMAGE: "image",
  LINK: "link",
  LIST_ITEM: "list-item",
  BULLETED_LIST: "bulleted-list",
  NUMBERED_LIST: "numbered-list",
  BLOCK_QUOTE: "block-quote",
  HEADING_TWO: "heading-two",
  HEADING_ONE: "heading-one",
};

function traverseNode(node, parent, visitors, index, depth) {
  const visitor = visitors[node.type || node.object] || visitors.any;

  let newNode = { ...node };

  if (visitor) {
    const processedNode = visitor({ ...newNode }, parent, index, depth);

    if (processedNode === false) {
      return false;
    }

    newNode = processedNode || node;
  }

  let children;
  let path;

  if (newNode.nodes) {
    children = newNode.nodes;
    path = "nodes";
  } else {
    children = newNode.leaves;
    path = "leaves";
  }

  if (children) {
    const newChildren = [];

    for (const [idx, child] of children.entries()) {
      if (!child) {
        continue;
      }

      const processedNode = traverseNode(
        child,
        {
          node: newNode,
          parent,
        },
        visitors,
        idx,
        depth + 1,
      );

      if (processedNode !== false) {
        newChildren.push(processedNode);
      }
    }

    newNode[path] = newChildren;
  }

  return newNode;
}

/**
 * Provides recursive, depth-first search document traversal. Use visitors collection to define nodes of interest.
 * If no visitor for given node is defined, no-op happens.
 * If visitor returns new node, the old node is replaced.
 * If visitor returns false, node is dropped from the document.
 * If visitor returns null/undefined/void, original node is used.
 * @param document Document to traverse.
 * @param visitors Collection of visitors.
 */
export function traverse(document, visitors) {
  return traverseNode(
    document,
    {
      node: undefined,
    },
    visitors,
    0,
    0,
  );
}
