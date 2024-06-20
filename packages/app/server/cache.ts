import NodeCache from "node-cache";

const cache = new NodeCache();

export function createCache() {
  const save = (key: string, item: any) => {
    cache.set(key, item);
  };

  const getItem = (key: string) => {
    cache.get(key);
  };

  return {
    save,
    getItem,
  };
}
