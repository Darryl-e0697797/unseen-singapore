import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { unpackModel } from '../../../../packages/shared/model-transport';
import { modelUrl } from './model-url';

class CompressedModelLoader extends GLTFLoader {
  override load(...args: Parameters<GLTFLoader['load']>) {
    const [url, onLoad, , onError] = args;
    if (!url.endsWith('.gz')) return super.load(...args);
    this.manager.itemStart(url);
    fetch(url)
      .then(async (response) => {
        if (!response.ok || !response.body) throw new Error(`Model unavailable: ${response.status}`);
        const bytes = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
        const decoded = unpackModel(new Uint8Array(bytes));
        return this.parseAsync(decoded.buffer as ArrayBuffer, new URL('.', new URL(url, location.href)).href);
      })
      .then(onLoad)
      .catch((error) => { this.manager.itemError(url); onError?.(error); })
      .finally(() => this.manager.itemEnd(url));
  }
}

/** Lossless transport only: scene geometry is byte-for-byte unchanged after decompression. */
export const useModel = (path: string) => useLoader(CompressedModelLoader, modelUrl(path));
