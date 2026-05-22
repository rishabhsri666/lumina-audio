import NodeCache from "node-cache";

export const streamCache = new NodeCache({
  stdTTL: 60 * 20,
});