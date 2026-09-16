export const modelUrl = (path: string) => typeof DecompressionStream === 'function' ? `${path}.pack.gz` : path;
