"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  clampFloorValue,
  FLOOR_OVERVIEW_VALUE,
  getFloorCount,
  getFloorFocusCopy,
  getFloorLabel,
  getFloorOptions
} from "@/lib/floor-explorer";

const floorSceneCache = new Map();

function getNamedNodePrefix(pattern = "floor_01") {
  const normalized = pattern.toLowerCase();
  const match = normalized.match(/^(.*?)(\d+)$/);
  return match ? match[1] : normalized;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectNamedFloorNodes(root, floorConfig = {}) {
  const floorNodes = new Map();
  const shellNodes = [];
  const prefix = getNamedNodePrefix(floorConfig.namedNodePattern);
  const floorPattern = new RegExp(`${escapeRegExp(prefix)}(\\d+)`);
  const shellPatterns = (floorConfig.shellNodePatterns ?? []).map((value) =>
    value.toLowerCase()
  );

  root.traverse((node) => {
    const nodeName = node.name?.toLowerCase();
    if (!nodeName || node === root) {
      return;
    }

    const floorMatch = nodeName.match(floorPattern);
    if (floorMatch) {
      const floorValue = Number.parseInt(floorMatch[1], 10);
      const bucket = floorNodes.get(floorValue) ?? [];
      bucket.push(node);
      floorNodes.set(floorValue, bucket);
      return;
    }

    if (shellPatterns.some((pattern) => nodeName.includes(pattern))) {
      shellNodes.push(node);
    }
  });

  return { floorNodes, shellNodes };
}

function setVisibilityRecursive(node, visible) {
  node.visible = visible;
  node.children.forEach((child) => setVisibilityRecursive(child, visible));
}

function showAllNodes(root) {
  root.traverse((node) => {
    node.visible = true;
  });
}

function applyNamedFloorVisibility(root, namedFloorNodes, selectedFloor) {
  showAllNodes(root);
  if (selectedFloor === FLOOR_OVERVIEW_VALUE) {
    return;
  }

  root.children.forEach((child) => setVisibilityRecursive(child, false));

  namedFloorNodes.shellNodes.forEach((node) => setVisibilityRecursive(node, true));
  (namedFloorNodes.floorNodes.get(selectedFloor) ?? []).forEach((node) =>
    setVisibilityRecursive(node, true)
  );
}

function cloneMaterials(root) {
  const materials = [];

  root.traverse((node) => {
    if (!node.isMesh || !node.material) {
      return;
    }

    if (Array.isArray(node.material)) {
      node.material = node.material.map((material) => {
        const clone = material.clone();
        materials.push(clone);
        return clone;
      });
      return;
    }

    node.material = node.material.clone();
    materials.push(node.material);
  });

  return materials;
}

function normalizeModel(root, THREE) {
  const initialBox = new THREE.Box3().setFromObject(root);
  const initialSize = initialBox.getSize(new THREE.Vector3());
  const longestSide = Math.max(initialSize.x, initialSize.y, initialSize.z, 0.001);
  const scaleFactor = 2.95 / longestSide;

  root.scale.setScalar(scaleFactor);

  const scaledBox = new THREE.Box3().setFromObject(root);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  root.position.set(-scaledCenter.x, -scaledBox.min.y, -scaledCenter.z);

  return new THREE.Box3().setFromObject(root);
}

function getSliceRange(bounds, floorCount, selectedFloor, padding = 0.06) {
  const height = Math.max(bounds.max.y - bounds.min.y, 0.001);
  const floorHeight = height / Math.max(floorCount, 1);
  const rawLower = bounds.min.y + floorHeight * (selectedFloor - 1);
  const rawUpper = bounds.min.y + floorHeight * selectedFloor;
  const inset = floorHeight * padding;
  const lower = rawLower + inset;
  const upper = Math.max(lower + floorHeight * 0.18, rawUpper - inset);

  return { lower, upper };
}

function setMaterialClipping(materials, planes) {
  materials.forEach((material) => {
    material.clippingPlanes = planes;
    material.needsUpdate = true;
  });
}

function focusCamera(viewerState, selectedFloor, project, sliceRange) {
  const { camera, controls, bounds } = viewerState;
  const size = bounds.getSize(viewerState.size);
  const maxDimension = Math.max(size.x, size.y, size.z, 0.001);
  const focusHeight =
    selectedFloor === FLOOR_OVERVIEW_VALUE || !sliceRange
      ? bounds.min.y + size.y * 0.56
      : (sliceRange.lower + sliceRange.upper) / 2;

  controls.target.set(0, focusHeight, 0);
  controls.autoRotate = selectedFloor === FLOOR_OVERVIEW_VALUE;
  controls.autoRotateSpeed = 0.75;
  controls.minDistance = maxDimension * 0.95;
  controls.maxDistance = maxDimension * 4.8;
  controls.update();

  camera.position.set(maxDimension * 1.75, focusHeight + size.y * 0.38, maxDimension * 1.85);
  camera.near = 0.01;
  camera.far = 40;
  camera.updateProjectionMatrix();

  viewerState.floorModeLabel = getFloorLabel(project, selectedFloor);
}

function syncFloorPresentation(viewerState, asset, project, selectedFloor) {
  if (!viewerState) {
    return;
  }

  const mode = asset.floorExplorer?.mode ?? "slice";
  const floorCount = getFloorCount(project);
  const hasNamedNodes = viewerState.namedFloorNodes.floorNodes.size > 0;

  showAllNodes(viewerState.root);
  setMaterialClipping(viewerState.materials, null);

  if (selectedFloor === FLOOR_OVERVIEW_VALUE) {
    focusCamera(viewerState, selectedFloor, project, null);
    return;
  }

  if (mode === "namedNodes" && hasNamedNodes) {
    applyNamedFloorVisibility(viewerState.root, viewerState.namedFloorNodes, selectedFloor);
    focusCamera(viewerState, selectedFloor, project, null);
    return;
  }

  const sliceRange = getSliceRange(
    viewerState.bounds,
    floorCount,
    selectedFloor,
    asset.floorExplorer?.slicePadding ?? 0.06
  );

  setMaterialClipping(viewerState.materials, [
    new viewerState.THREE.Plane(new viewerState.THREE.Vector3(0, 1, 0), -sliceRange.lower),
    new viewerState.THREE.Plane(new viewerState.THREE.Vector3(0, -1, 0), sliceRange.upper)
  ]);
  focusCamera(viewerState, selectedFloor, project, sliceRange);
}

export default function ProjectExplorer3D({ asset, project }) {
  const [selectedFloor, setSelectedFloor] = useState(FLOOR_OVERVIEW_VALUE);
  const [status, setStatus] = useState("loading");
  const stageRef = useRef(null);
  const frameRef = useRef(0);
  const viewerStateRef = useRef(null);
  const floorOptions = useMemo(() => getFloorOptions(project), [project]);
  const allFloors = useMemo(
    () => floorOptions.filter((option) => option.value !== FLOOR_OVERVIEW_VALUE).reverse(),
    [floorOptions]
  );

  useEffect(() => {
    setSelectedFloor(FLOOR_OVERVIEW_VALUE);
  }, [project.id]);

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

        if (cancelled || !stageRef.current) {
          return;
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.localClippingEnabled = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = "three-model-stage";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 40);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI * 0.14;
        controls.maxPolarAngle = Math.PI * 0.48;

        scene.add(new THREE.AmbientLight(0xffffff, 1.85));

        const keyLight = new THREE.DirectionalLight(0xf4ddba, 1.95);
        keyLight.position.set(3.2, 4.1, 5.6);
        const fillLight = new THREE.DirectionalLight(0x7ab9db, 0.95);
        fillLight.position.set(-4.2, 2.8, 3.1);
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
        rimLight.position.set(0, 5.4, -4.2);
        scene.add(keyLight, fillLight, rimLight);

        stageRef.current.replaceChildren(renderer.domElement);

        const resize = () => {
          if (!stageRef.current) {
            return;
          }

          const { clientWidth, clientHeight } = stageRef.current;
          renderer.setSize(clientWidth, clientHeight, false);
          camera.aspect = clientWidth / Math.max(clientHeight, 1);
          camera.updateProjectionMatrix();
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(stageRef.current);

        let cachedScene = floorSceneCache.get(asset.src);
        if (!cachedScene) {
          const loader = new GLTFLoader();
          cachedScene = loader.loadAsync(asset.src).then((gltf) => gltf.scene);
          floorSceneCache.set(asset.src, cachedScene);
        }

        const baseScene = await cachedScene;
        if (cancelled || !baseScene) {
          return;
        }

        const modelScene = baseScene.clone(true);
        const materials = cloneMaterials(modelScene);
        const bounds = normalizeModel(modelScene, THREE);
        const namedFloorNodes = collectNamedFloorNodes(modelScene, asset.floorExplorer);

        scene.add(modelScene);

        const viewerState = {
          THREE,
          bounds,
          camera,
          controls,
          materials,
          namedFloorNodes,
          renderer,
          root: modelScene,
          scene,
          size: new THREE.Vector3()
        };

        viewerStateRef.current = viewerState;
        syncFloorPresentation(viewerState, asset, project, selectedFloor);
        setStatus("ready");

        const render = () => {
          controls.update();
          renderer.render(scene, camera);
          frameRef.current = window.requestAnimationFrame(render);
        };

        render();
      } catch (error) {
        console.error("Failed to render project explorer", error);
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
  }, [asset.id, asset.src, project.id]);

  useEffect(() => {
    syncFloorPresentation(viewerStateRef.current, asset, project, selectedFloor);
  }, [asset, project, selectedFloor]);

  return (
    <article className="model-card floor-model-card">
      <div className="section-head">
        <div>
          <p className="section-label">Full Project Explorer</p>
          <h3>{asset.label}</h3>
        </div>
        <span className="status-pill subtle">{getFloorLabel(project, selectedFloor)}</span>
      </div>

      <div className="floor-explorer-panel">
        <div className="floor-directory">
          <div className="floor-directory-head">
            <p className="section-label">Floor Directory</p>
            <p className="floor-directory-copy">
              Choose the exact level instead of scrubbing through the tower.
            </p>
          </div>

          <div className="floor-grid" role="list" aria-label="All building floors">
            <button
              type="button"
              className={`floor-grid-button floor-grid-button-overview${
                selectedFloor === FLOOR_OVERVIEW_VALUE ? " active" : ""
              }`}
              onClick={() => setSelectedFloor(FLOOR_OVERVIEW_VALUE)}
            >
              <span>Exterior</span>
              <strong>{getFloorLabel(project, FLOOR_OVERVIEW_VALUE)}</strong>
            </button>
            {allFloors.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`floor-grid-button${
                  selectedFloor === option.value ? " active" : ""
                }`}
                onClick={() =>
                  setSelectedFloor(clampFloorValue(project, Number(option.value)))
                }
              >
                <span>Level {String(option.value).padStart(2, "0")}</span>
                <strong>{option.label}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="model-stage floor-model-stage">
        <div ref={stageRef} className="three-model-shell" />

        {status === "error" && asset.posterSrc ? (
          <img className="model-fallback" src={asset.posterSrc} alt={asset.label} />
        ) : null}

        {status !== "ready" ? (
          <div className="model-overlay">
            <p className="section-label">
              {status === "error" ? "Preview unavailable" : "Loading floor explorer"}
            </p>
            <p>
              {status === "error"
                ? `The floor explorer could not render. The raw asset remains available at ${asset.src}.`
                : `Preparing ${asset.fileName} so the selected building can move from exterior story into floor-by-floor review.`}
            </p>
          </div>
        ) : null}
      </div>

      <p className="model-caption">{getFloorFocusCopy(project, selectedFloor)}</p>
      <p className="model-meta">
        Pilot mode: <code>{asset.floorExplorer?.mode ?? "slice"}</code>. Preferred export:
        <code> {asset.floorExplorer?.namedNodePattern ?? "floor_01"}</code>
      </p>
    </article>
  );
}
