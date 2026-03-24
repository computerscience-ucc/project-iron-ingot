import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Outlines, Edges } from "@react-three/drei";
import * as THREE from "three";

const W = 4,
  H = 1.1,
  D = 4;

const BASE_ZOOM = 110;

// Approximate projected scene dimensions in world units (isometric 45° view)
const SCENE_WIDTH = 6.5;
const SCENE_HEIGHT = 7;

/* ── Responsive zoom ────────────────────────────── */

function ResponsiveZoom() {
  const { camera, size } = useThree();

  useEffect(() => {
    // Fit the scene within the canvas, capped at BASE_ZOOM for large screens
    const zoomByWidth = size.width / SCENE_WIDTH;
    const zoomByHeight = size.height / SCENE_HEIGHT;
    camera.zoom = Math.min(zoomByWidth, zoomByHeight, BASE_ZOOM);
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  return null;
}

/* ── Marquee canvas factory ──────────────────────── */

function createMarquee(count) {
  const canvas = document.createElement("canvas");
  canvas.height = 64;
  const textures = Array.from({ length: count }, () => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = tex.magFilter = THREE.NearestFilter;
    return tex;
  });

  function update(text, active) {
    const ctx = canvas.getContext("2d");
    const fs = 38;
    ctx.font = `${fs}px "Minecraft", monospace`;
    const w = Math.ceil(ctx.measureText(text.toUpperCase()).width + 40);
    canvas.width = w;
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, w, canvas.height);
    ctx.font = `${fs}px "Minecraft", monospace`;
    ctx.fillStyle = active ? "#FF5154" : "#444444";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), 0, canvas.height / 2 + 4);
    textures.forEach((t) => (t.needsUpdate = true));
    return (w / canvas.height) * H;
  }

  return { textures, update };
}

/* ── Shared hooks ────────────────────────────────── */

function elasticOut(t, amp = 1, period = 1) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = (period / (2 * Math.PI)) * Math.asin(1 / amp);
  return (
    amp * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / period) +
    1
  );
}

function useSpinOnActive(active, target, duration = 3, amp = 1.5, period = 1) {
  const rot = useRef(0);
  const elapsed = useRef(0);
  const spinning = useRef(false);
  const prev = useRef(false);

  useEffect(() => {
    if (active && !prev.current) {
      elapsed.current = 0;
      spinning.current = true;
    }
    prev.current = active;
  }, [active]);

  useFrame((_, dt) => {
    if (!spinning.current) return;
    elapsed.current += dt;
    const t = Math.min(elapsed.current / duration, 1);
    rot.current = target * elasticOut(t, amp, period);
    if (t >= 1) {
      rot.current = target;
      spinning.current = false;
    }
  });

  return rot;
}

function useMarquee(text, active, sides) {
  const sys = useMemo(() => createMarquee(sides.length), [sides.length]);

  useEffect(() => {
    const apply = (tw) => {
      if (tw <= 0) return;
      sides.forEach(({ w, o }, i) => {
        sys.textures[i].repeat.x = w / tw;
        sys.textures[i].offset.x = o / tw;
      });
    };
    apply(sys.update(text, active));
    document.fonts.ready.then(() => apply(sys.update(text, active)));
  }, [text, active, sides, sys]);

  useFrame((_, dt) => sys.textures.forEach((t) => (t.offset.x += dt * 0.08)));

  return useMemo(
    () =>
      sys.textures.map(
        (map) =>
          new THREE.MeshBasicMaterial({
            map,
            toneMapped: false,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
          }),
      ),
    [sys],
  );
}

/* ── CS-logo box ────────────────────────────────── */

const EBOX_SIDES = [
  { w: W, o: 0 },
  { w: D, o: W },
  { w: D, o: 2 * W + D },
];

function EBoxMesh({
  position,
  active,
  text = "ONLINE PUBLIC INFORMATION BOARD",
}) {
  const groupRef = useRef();
  const rot = useSpinOnActive(active, Math.PI * 2, 5, 1.5, 1);
  const mats = useMarquee(text, active, EBOX_SIDES);

  const { ext } = useMemo(() => {
    const seg = D / 7,
      thk = seg,
      gap = 0.4;
    const sX = -W / 2 + thk + gap,
      bR = sX + thk;
    const t2B = -D / 2 + 2 * seg,
      t2T = -D / 2 + 3 * seg;
    const t3B = -D / 2 + 4 * seg,
      t3T = -D / 2 + 5 * seg;

    const s = new THREE.Shape();
    s.moveTo(-W / 2, -D / 2);
    s.lineTo(W / 2, -D / 2);
    s.lineTo(W / 2, -D / 2 + seg);
    s.lineTo(-W / 2 + thk, -D / 2 + seg);
    s.lineTo(-W / 2 + thk, D / 2 - seg);
    s.lineTo(W / 2 - thk, D / 2 - seg);
    s.lineTo(W / 2 - thk, t3T);
    s.lineTo(sX, t3T);
    s.lineTo(sX, t2B);
    s.lineTo(W / 2, t2B);
    s.lineTo(W / 2, t2T);
    s.lineTo(bR, t2T);
    s.lineTo(bR, t3B);
    s.lineTo(W / 2, t3B);
    s.lineTo(W / 2, D / 2);
    s.lineTo(-W / 2, D / 2);
    s.closePath();

    const ext = new THREE.ExtrudeGeometry(s, { depth: H, bevelEnabled: false });
    return { ext };
  }, []);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y = rot.current;
  });

  const col = active ? "white" : "#444444";

  return (
    <group ref={groupRef} position={position}>
      <mesh
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        position={[0, 0.55, 0]}
        geometry={ext}
      >
        <meshBasicMaterial
          color="#181818"
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={2}
          polygonOffsetUnits={2}
        />
        <Outlines color={col} thickness={3.4} />
        <Edges color={col} threshold={15} />
      </mesh>
      {active && (
        <>
          <mesh position={[0, 0, D / 2]} material={mats[0]}>
            <planeGeometry args={[W, H]} />
          </mesh>
          <mesh
            position={[W / 2, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            material={mats[1]}
          >
            <planeGeometry args={[D, H]} />
          </mesh>
          <mesh
            position={[-W / 2, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            material={mats[2]}
          >
            <planeGeometry args={[D, H]} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ── Regular box ─────────────────────────────────── */

const BOX_SIDES = [
  { w: W, o: 0 },
  { w: D, o: W },
  { w: W, o: W + D },
  { w: D, o: 2 * W + D },
];

function BoxMesh({
  position,
  active,
  text = "SENIOR PROJECT DISCOVERY SHOWCASE",
}) {
  const groupRef = useRef();
  const rot = useSpinOnActive(active, Math.PI, 3.4, 3, 1);
  const mats = useMarquee(text, active, BOX_SIDES);

  const { box } = useMemo(() => {
    const box = new THREE.BoxGeometry(W, H, D);
    return { box };
  }, []);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y = rot.current;
  });

  const col = active ? "white" : "#444444";

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={box}>
        <meshBasicMaterial
          color="#181818"
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={2}
          polygonOffsetUnits={2}
        />
        <Outlines color={col} thickness={3.4} />
        <Edges color={col} threshold={15} />
      </mesh>
      {active && (
        <>
          <mesh position={[0, 0, D / 2]} material={mats[0]}>
            <planeGeometry args={[W, H]} />
          </mesh>
          <mesh
            position={[W / 2, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            material={mats[1]}
          >
            <planeGeometry args={[D, H]} />
          </mesh>
          <mesh
            position={[0, 0, -D / 2]}
            rotation={[0, Math.PI, 0]}
            material={mats[2]}
          >
            <planeGeometry args={[W, H]} />
          </mesh>
          <mesh
            position={[-W / 2, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            material={mats[3]}
          >
            <planeGeometry args={[D, H]} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ── Exported scene wrapper ──────────────────────── */

function SceneContent({ activeIndex }) {
  return (
    <group>
      <ResponsiveZoom />
      <EBoxMesh position={[0, 1.3, 0]} active={activeIndex === 0} />
      <BoxMesh position={[0, 0, 0]} active={activeIndex === 1} />
      <BoxMesh
        position={[0, -1.3, 0]}
        active={activeIndex === 2}
        text="STUDENT COLLABORATIVE NETWORK"
      />
    </group>
  );
}

export default function Scene3D({ activeIndex = 0, scrollYProgress }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [10, 9, 10], zoom: BASE_ZOOM, near: -100, far: 100 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <SceneContent
        activeIndex={activeIndex}
        scrollYProgress={scrollYProgress}
      />
    </Canvas>
  );
}
