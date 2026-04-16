"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  clampFloorValue,
  FLOOR_OVERVIEW_VALUE,
  getFloorFocusCopy,
  getFloorLabel,
  getFloorOptions,
} from "@/lib/floor-explorer";
import { setupPackedGltfLoader } from "@/lib/setupPackedGltfLoader";
import { cn } from "@/lib/cn";
import {
  sectionLabel,
  serifHeading,
  subtleStatusPill,
} from "@/lib/uiClasses";

const floorSceneCache = new Map();
const modelCardClass =
  "grid gap-[18px] rounded-[20px] border border-white/8 p-[18px] [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),rgba(255,255,255,0.02)] max-[820px]:rounded-[18px] max-[820px]:px-4 max-[820px]:py-[14px]";
const stageClass =
  "model-stage floor-model-stage relative mt-4 min-h-[320px] overflow-hidden rounded-[22px] border border-white/8 [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),#08121d] max-[820px]:mt-3 max-[820px]:min-h-[min(52vw,280px)] max-[820px]:rounded-[18px]";
const floorButtonClass =
  "rounded-[18px] border border-white/8 bg-white/[0.03] px-[14px] py-3 text-left text-pro-text-soft transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.24)]";
const floorButtonActiveClass =
  "border-[rgba(241,211,161,0.28)] text-pro-gold-bright [background:linear-gradient(180deg,rgba(214,180,123,0.16),rgba(214,180,123,0.06)),rgba(255,255,255,0.04)]";

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
    value.toLowerCase(),
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

  namedFloorNodes.shellNodes.forEach((node) =>
    setVisibilityRecursive(node, true),
  );
  (namedFloorNodes.floorNodes.get(selectedFloor) ?? []).forEach((node) =>
    setVisibilityRecursive(node, true),
  );
}

function normalizeModel(root, THREE) {
  const initialBox = new THREE.Box3().setFromObject(root);
  const initialSize = initialBox.getSize(new THREE.Vector3());
  const longestSide = Math.max(
    initialSize.x,
    initialSize.y,
    initialSize.z,
    0.001,
  );
  const scaleFactor = 2.95 / longestSide;

  root.scale.setScalar(scaleFactor);

  const scaledBox = new THREE.Box3().setFromObject(root);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  root.position.set(-scaledCenter.x, -scaledBox.min.y, -scaledCenter.z);

  return new THREE.Box3().setFromObject(root);
}

function focusCamera(viewerState, selectedFloor, project) {
  const { THREE, camera, controls, bounds } = viewerState;
  const size = bounds.getSize(viewerState.size);
  const maxDimension = Math.max(size.x, size.y, size.z, 0.001);
  const center = new THREE.Vector3();
  bounds.getCenter(center);

  controls.target.copy(center);
  controls.zoomToCursor = false;
  controls.autoRotate = selectedFloor === FLOOR_OVERVIEW_VALUE;
  controls.autoRotateSpeed = 0.75;
  controls.minDistance = maxDimension * 0.95;
  controls.maxDistance = maxDimension * 4.8;
  controls.update();

  camera.position.set(
    center.x + maxDimension * 1.75,
    center.y + size.y * 0.38,
    center.z + maxDimension * 1.85,
  );
  camera.lookAt(center);
  camera.near = 0.01;
  camera.far = 40;
  camera.updateProjectionMatrix();

  viewerState.floorModeLabel = getFloorLabel(project, selectedFloor);
}

function syncFloorPresentation(viewerState, asset, project, selectedFloor) {
  if (!viewerState) {
    return;
  }

  const hasNamedNodes = viewerState.namedFloorNodes.floorNodes.size > 0;

  showAllNodes(viewerState.root);

  if (selectedFloor === FLOOR_OVERVIEW_VALUE) {
    focusCamera(viewerState, selectedFloor, project);
    return;
  }

  if (hasNamedNodes) {
    applyNamedFloorVisibility(
      viewerState.root,
      viewerState.namedFloorNodes,
      selectedFloor,
    );
    focusCamera(viewerState, selectedFloor, project);
    return;
  }

  showAllNodes(viewerState.root);
  focusCamera(viewerState, FLOOR_OVERVIEW_VALUE, project);
}

export default function ProjectExplorer3D({ asset, project }) {
  const [selectedFloor, setSelectedFloor] = useState(FLOOR_OVERVIEW_VALUE);
  const [status, setStatus] = useState("loading");
  const stageRef = useRef(null);
  const frameRef = useRef(0);
  const viewerStateRef = useRef(null);
  const floorOptions = useMemo(() => getFloorOptions(project), [project]);
  const allFloors = useMemo(
    () =>
      floorOptions
        .filter((option) => option.value !== FLOOR_OVERVIEW_VALUE)
        .reverse(),
    [floorOptions],
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
        const { OrbitControls } =
          await import("three/examples/jsm/controls/OrbitControls.js");
        const { GLTFLoader } =
          await import("three/examples/jsm/loaders/GLTFLoader.js");

        if (cancelled || !stageRef.current) {
          return;
        }

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = "three-model-stage";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 40);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.zoomToCursor = false;
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
          await setupPackedGltfLoader(loader, renderer);
          cachedScene = loader.loadAsync(asset.src).then((gltf) => gltf.scene);
          floorSceneCache.set(asset.src, cachedScene);
        }

        const baseScene = await cachedScene;
        if (cancelled || !baseScene) {
          return;
        }

        const modelScene = baseScene.clone(true);
        const bounds = normalizeModel(modelScene, THREE);
        const namedFloorNodes = collectNamedFloorNodes(
          modelScene,
          asset.floorExplorer,
        );

        scene.add(modelScene);

        const viewerState = {
          THREE,
          bounds,
          camera,
          controls,
          namedFloorNodes,
          renderer,
          root: modelScene,
          scene,
          size: new THREE.Vector3(),
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
    syncFloorPresentation(
      viewerStateRef.current,
      asset,
      project,
      selectedFloor,
    );
  }, [asset, project, selectedFloor]);

  return (
    <article className={modelCardClass}>
      <div className="flex items-start justify-between gap-3 max-[820px]:flex-col max-[820px]:items-start">
        <div className="min-w-0">
          <p className={sectionLabel}>Full Project Explorer</p>
          <h3 className={cn(serifHeading, "text-[1.05rem]")}>{asset.label}</h3>
        </div>
        <span className={subtleStatusPill}>
          {getFloorLabel(project, selectedFloor)}
        </span>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-3">
          <div className="grid gap-[6px]">
            <p className={sectionLabel}>Floor Directory</p>
            <p className="m-0 text-pro-text-soft leading-[1.55]">
              Choose an authored floor group from the structured building model.
            </p>
          </div>

          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(148px,1fr))] gap-[10px] max-[820px]:grid-cols-1"
            role="list"
            aria-label="All building floors"
          >
            <button
              type="button"
              className={cn(
                floorButtonClass,
                "grid gap-[6px]",
                selectedFloor === FLOOR_OVERVIEW_VALUE && floorButtonActiveClass,
              )}
              onClick={() => setSelectedFloor(FLOOR_OVERVIEW_VALUE)}
            >
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-pro-text-faint">
                Exterior
              </span>
              <strong className="text-[0.9rem] leading-[1.35]">
                {getFloorLabel(project, FLOOR_OVERVIEW_VALUE)}
              </strong>
            </button>
            {allFloors.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  floorButtonClass,
                  "grid gap-[6px]",
                  selectedFloor === option.value && floorButtonActiveClass,
                )}
                onClick={() =>
                  setSelectedFloor(
                    clampFloorValue(project, Number(option.value)),
                  )
                }
              >
                <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-pro-text-faint">
                  Level {String(option.value).padStart(2, "0")}
                </span>
                <strong className="text-[0.9rem] leading-[1.35]">
                  {option.label}
                </strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={stageClass}>
        <div ref={stageRef} className="three-model-shell" />

        {status === "error" && asset.posterSrc ? (
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            src={asset.posterSrc}
            alt={asset.label}
          />
        ) : null}

        {status !== "ready" ? (
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/8 bg-[rgba(8,14,21,0.78)] px-4 py-[14px] backdrop-blur-[14px]">
            <p className={sectionLabel}>
              {status === "error"
                ? "Preview unavailable"
                : "Loading floor explorer"}
            </p>
            <p className="mt-2 text-pro-text-soft leading-[1.55]">
              {status === "error"
                ? `The floor explorer could not render. The raw asset remains available at ${asset.src}.`
                : `Preparing ${asset.fileName} so the selected building can move from exterior story into floor-by-floor review.`}
            </p>
          </div>
        ) : null}
      </div>

      <p className="mt-[14px] text-pro-text-soft leading-[1.55]">
        {getFloorFocusCopy(project, selectedFloor)}
      </p>
      <p className="mt-[10px] text-[0.84rem] text-pro-text-faint">
        Explorer mode:{" "}
        <code className="font-mono text-pro-gold-bright">
          {asset.floorExplorer?.mode ?? "namedNodes"}
        </code>.
        Required export:
        <code className="font-mono text-pro-gold-bright">
          {" "}
          {asset.floorExplorer?.namedNodePattern ?? "floor_01"}
        </code>
      </p>
    </article>
  );
}
