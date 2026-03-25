"use client";

import { useEffect, useRef, useState } from "react";

const interiorSceneCache = new Map();

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

function normalizeInteriorModel(root, THREE) {
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

function focusInteriorCamera(viewerState) {
  const { camera, controls, bounds, size } = viewerState;
  const dimensions = bounds.getSize(size);
  const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z, 0.001);
  const targetHeight = Math.max(dimensions.y * 0.42, 0.45);

  controls.target.set(0, targetHeight, 0);
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

  camera.position.set(maxDimension * 0.18, targetHeight + maxDimension * 0.05, maxDimension * 0.22);
  camera.near = 0.003;
  camera.far = 120;
  camera.updateProjectionMatrix();
}

async function toggleFullscreen(container, isFullscreen) {
  if (typeof document === "undefined") {
    return;
  }

  if (isFullscreen) {
    await document.exitFullscreen?.();
    return;
  }

  await container?.requestFullscreen?.();
}

function FullscreenIcon({ isFullscreen }) {
  return isFullscreen ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 4H5v4M15 4h4v4M9 20H5v-4M15 20h4v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InteriorExplorer3D({
  asset,
  project,
  caption,
  statusLabel = "Interior Navigation"
}) {
  const [status, setStatus] = useState("loading");
  const stageContainerRef = useRef(null);
  const stageShellRef = useRef(null);
  const frameRef = useRef(0);
  const viewerStateRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === stageContainerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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

        if (cancelled || !stageShellRef.current) {
          return;
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = "three-model-stage";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(48, 1, 0.003, 120);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;

        const ambientLight = new THREE.AmbientLight(0xffffff, 2.15);
        const hemisphereLight = new THREE.HemisphereLight(0xf7efe0, 0x172436, 1.25);
        const keyLight = new THREE.DirectionalLight(0xf7ddbc, 1.7);
        keyLight.position.set(4.6, 5.2, 4.2);
        const fillLight = new THREE.DirectionalLight(0x94c7ea, 0.95);
        fillLight.position.set(-3.8, 3.4, -4.8);
        scene.add(ambientLight, hemisphereLight, keyLight, fillLight);

        stageShellRef.current.replaceChildren(renderer.domElement);

        const resize = () => {
          if (!stageShellRef.current) {
            return;
          }

          const { clientWidth, clientHeight } = stageShellRef.current;
          renderer.setSize(clientWidth, clientHeight, false);
          camera.aspect = clientWidth / Math.max(clientHeight, 1);
          camera.updateProjectionMatrix();
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(stageShellRef.current);

        let cachedScene = interiorSceneCache.get(asset.src);
        if (!cachedScene) {
          const loader = new GLTFLoader();
          cachedScene = loader.loadAsync(asset.src).then((gltf) => gltf.scene);
          interiorSceneCache.set(asset.src, cachedScene);
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
          setDoubleSidedMaterial(node, THREE);
        });

        const bounds = normalizeInteriorModel(modelScene, THREE);
        scene.add(modelScene);

        const viewerState = {
          bounds,
          camera,
          controls,
          renderer,
          scene,
          size: new THREE.Vector3()
        };

        viewerStateRef.current = viewerState;
        focusInteriorCamera(viewerState);
        setStatus("ready");

        const render = () => {
          controls.update();
          renderer.render(scene, camera);
          frameRef.current = window.requestAnimationFrame(render);
        };

        render();
      } catch (error) {
        console.error("Failed to render interior explorer", error);
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
  }, [asset.id, asset.src]);

  return (
    <article className="model-card interior-model-card">
      <div className="section-head">
        <div>
          <p className="section-label">Virtual Experience</p>
          <h3>{asset.label}</h3>
        </div>
        <span className="status-pill subtle">{statusLabel}</span>
      </div>

      <div
        ref={stageContainerRef}
        className={`model-stage interior-model-stage${isFullscreen ? " is-fullscreen" : ""}`}
      >
        <div className="viewer-toolbar">
          <button
            type="button"
            className="viewer-toolbar-button"
            onClick={() => toggleFullscreen(stageContainerRef.current, isFullscreen)}
            aria-label={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
            title={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
          >
            <FullscreenIcon isFullscreen={isFullscreen} />
          </button>
        </div>
        <div ref={stageShellRef} className="three-model-shell" />

        {status !== "ready" ? (
          <div className="model-overlay">
            <p className="section-label">
              {status === "error" ? "Preview unavailable" : "Loading interior explorer"}
            </p>
            <p>
              {status === "error"
                ? `The interior explorer could not render. The raw asset remains available at ${asset.src}.`
                : `Preparing ${asset.fileName} for a closer interior walkthrough.`}
            </p>
          </div>
        ) : null}
      </div>

      <p className="interior-viewer-note">Drag to look around. Scroll to move deeper. Right-drag to pan.</p>
      <p className="model-caption">{caption ?? project.virtualExperience}</p>
      <p className="model-meta">
        Current asset: <code>{asset.fileName}</code>
      </p>
    </article>
  );
}
