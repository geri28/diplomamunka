export const resolveAliasNode = (nodeName) => {
  if (!nodeName) return null;

  if (nodeName.includes("_seged")) {
    return nodeName.split("_seged")[0];
  }

  return nodeName;
};
