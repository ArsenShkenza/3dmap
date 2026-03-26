"use client";

import { useEffect, useRef, useState } from "react";

const gltfSceneCache = new Map();

function setDoubleSidedMaterial(node, THREE) {
  if (!node.material) {
    return;
  }

  if (Array.isArray(node.material)) {
    node.material = node.material.map((material) => {
      const clonedMaterial = material.clone();
      clonedMaterial.side = THREE.DoubleSide;
      clonedMaterial.needsUpdate = true;
      return clonedMaterial;
    });
    return;
  }

  const clonedMaterial = node.material.clone();
  clonedMaterial.side = THREE.DoubleSide;
  clonedMaterial.needsUpdate = true;
  node.material = clonedMaterial;
}

/** Same as interior path: scale to a stable span, center XZ, ground at Y=0 — orbit target stays true bbox center. */
export function normalizeGltfModel(root, THREE) {
  const initialBox = new THREE.Box3().setFromObject(root);
  const initialSize = initialBox.getSize(new THREE.Vector3());
  const longestSide = Math.max(initialSize.x, initialSize.y, initialSize.z, 0.001);
  const scaleFactor = 5.6 / longestSide;

  root.scale.setScalar(scaleFactor);

  const scaledBox = new THREE.Box3().setFromObject(root);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  root.position.set(-scaledCenter.x, -scaledBox.min.y, -scaledCenter.z);

  return new THREE.Box3().setFromObject(root);
}

export function focusOrbitCamera(viewerState) {
  const { THREE, camera, controls, bounds, size } = viewerState;
  const dimensions = bounds.getSize(size);
  const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z, 0.001);
  const center = new THREE.Vector3();
  bounds.getCenter(center);

  controls.target.copy(center);
  controls.zoomToCursor = false;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.minDistance = Math.max(maxDimension * 0.025, 0.03);
  controls.maxDistance = maxDimension * 3.4;
  controls.minPolarAngle = 0.02;
  controls.maxPolarAngle = Math.PI - 0.02;
  controls.zoomSpeed = 1.08;
  controls.panSpeed = 1.1;
  controls.rotateSpeed = 0.78;
  controls.update();

  const eye = new THREE.Vector3(
    maxDimension * 0.52,
    maxDimension * 0.3,
    maxDimension * 0.58
  );
  camera.position.copy(center).add(eye);
  camera.near = 0.003;
  camera.far = 120;
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}

/**
 * @param {{ id: string, src: string }} asset
 * @param {React.RefObject<HTMLElement | null>} containerRef
 * @param {"interior" | "exterior"} variant
 * @param {{ autoRotate?: boolean }} [options]
 */
export function useGltfOrbitViewer(asset, containerRef, variant, options = {}) {
  const { autoRotate = variant === "exterior" } = options;
  const [status, setStatus] = useState("loading");
  const frameRef = useRef(0);
  const viewerStateRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver;

    async function setupViewer() {
      try {
        setStatus("loading");

        const THREE = await import("three");
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js"
        );
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );

        if (cancelled || !containerRef.current) {
          return;
        }

        const useAlpha = variant === "interior";
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: useAlpha });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        if (!useAlpha) {
          renderer.setClearColor(0x08121d, 1);
        }
        renderer.domElement.className = "three-model-stage";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(48, 1, 0.003, 120);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.zoomToCursor = false;
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 1.15;

        const ambientLight = new THREE.AmbientLight(0xffffff, 2.15);
        const hemisphereLight = new THREE.HemisphereLight(0xf7efe0, 0x172436, 1.25);
        const keyLight = new THREE.DirectionalLight(0xf7ddbc, 1.7);
        keyLight.position.set(4.6, 5.2, 4.2);
        const fillLight = new THREE.DirectionalLight(0x94c7ea, 0.95);
        fillLight.position.set(-3.8, 3.4, -4.8);
        scene.add(ambientLight, hemisphereLight, keyLight, fillLight);

        containerRef.current.replaceChildren(renderer.domElement);

        const resize = () => {
          if (!containerRef.current) {
            return;
          }

          const { clientWidth, clientHeight } = containerRef.current;
          renderer.setSize(clientWidth, clientHeight, false);
          camera.aspect = clientWidth / Math.max(clientHeight, 1);
          camera.updateProjectionMatrix();
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(containerRef.current);

        let cachedScene = gltfSceneCache.get(asset.src);
        if (!cachedScene) {
          const loader = new GLTFLoader();
          cachedScene = loader.loadAsync(asset.src).then((gltf) => gltf.scene);
          gltfSceneCache.set(asset.src, cachedScene);
        }

        const baseScene = await cachedScene;
        if (cancelled || !baseScene) {
          return;
        }

        const modelScene = baseScene.clone(true);
        modelScene.traverse((node) => {
          if (!node.isMesh) {
            return;
          }

          node.castShadow = true;
          node.receiveShadow = true;
          if (variant === "interior") {
            setDoubleSidedMaterial(node, THREE);
          }
        });

        const bounds = normalizeGltfModel(modelScene, THREE);
        scene.add(modelScene);

        const viewerState = {
          THREE,
          bounds,
          camera,
          controls,
          renderer,
          scene,
          size: new THREE.Vector3()
        };

        viewerStateRef.current = viewerState;
        focusOrbitCamera(viewerState);
        setStatus("ready");

        const render = () => {
          controls.update();
          renderer.render(scene, camera);
          frameRef.current = window.requestAnimationFrame(render);
        };

        render();
      } catch (error) {
        console.error("Failed to render GLTF orbit viewer", error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    setupViewer();

    return () => {
      cancelled = true;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      const viewerState = viewerStateRef.current;
      if (viewerState) {
        viewerState.controls.dispose();
        viewerState.renderer.dispose();
      }
      viewerStateRef.current = null;
    };
  }, [asset.id, asset.src, autoRotate, variant]);

  return status;
}
