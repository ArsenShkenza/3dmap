/**
 * gltfpack with -cc (meshopt) / -tc (Basis) needs these on GLTFLoader before loadAsync().
 * Keep THREE_PKG_VERSION aligned with package.json "three" for basis transcoder URL.
 */
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const THREE_PKG_VERSION = "0.182.0";
const BASIS_TRANSCODER_BASE = `https://cdn.jsdelivr.net/npm/three@${THREE_PKG_VERSION}/examples/jsm/libs/basis/`;

/**
 * @param {import("three/examples/jsm/loaders/GLTFLoader.js").GLTFLoader} loader
 * @param {import("three").WebGLRenderer | null | undefined} webglRenderer — required for KTX2 / -tc textures
 */
export async function setupPackedGltfLoader(loader, webglRenderer) {
  await MeshoptDecoder.ready;
  loader.setMeshoptDecoder(MeshoptDecoder);

  if (webglRenderer) {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(BASIS_TRANSCODER_BASE);
    ktx2Loader.detectSupport(webglRenderer);
    loader.setKTX2Loader(ktx2Loader);
  }
}
