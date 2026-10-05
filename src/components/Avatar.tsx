import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { AdaptiveDpr, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type AgentState = "idle" | "typing" | "thinking" | "answering" | "excited" | "confused";
export type OneShot = "wave" | "poke" | "dance" | "excited" | "clap";

const AVATAR_URL = "/avatar.glb";
useGLTF.preload(AVATAR_URL);

// Looping clip for each chat state. Clip names come from avatar/scripts/rig_animate.py.
const STATE_CLIP: Record<AgentState, string> = {
  idle: "idle",
  typing: "typing",
  thinking: "thinking",
  answering: "talking",
  excited: "excited",
  confused: "confused",
};

const FADE = 0.35;

interface ModelProps {
  state: AgentState;
  oneShot?: { name: OneShot; id: number } | null;
  lookAtCursor: boolean;
  onPoke?: () => void;
  onReady?: () => void;
}

function AvatarModel({ state, oneShot, lookAtCursor, onPoke, onReady }: ModelProps) {
  const { scene: loaded, animations } = useGLTF(AVATAR_URL);
  // Skinned meshes need SkeletonUtils.clone so each canvas gets its own bones.
  const scene = useMemo(() => cloneSkinned(loaded), [loaded]);
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const actions = useMemo(() => {
    const map: Record<string, THREE.AnimationAction> = {};
    for (const clip of animations) map[clip.name] = mixer.clipAction(clip);
    return map;
  }, [animations, mixer]);

  const current = useRef<THREE.AnimationAction | null>(null);
  const playingOneShot = useRef(false);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const bones = useMemo(() => {
    // Works for both rigs: ours (head/neck/chest) and Tripo/Mixamo-style names.
    const find = (patterns: RegExp[]) => {
      for (const re of patterns) {
        let hit: THREE.Bone | null = null;
        scene.traverse((o) => {
          if (!hit && (o as THREE.Bone).isBone && re.test(o.name)) hit = o as THREE.Bone;
        });
        if (hit) return hit as THREE.Bone;
      }
      return null;
    };
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.frustumCulled = false; // skinned bounds don't follow animation
      }
    });
    return {
      head: find([/^head$/i, /(^|[:_])head$/i, /head/i]),
      neck: find([/^neck$/i, /neck/i]),
      chest: find([/^chest$/i, /spine0?2$/i, /upper_?chest/i, /spine0?1$/i]),
    };
  }, [scene]);

  const crossTo = (next: THREE.AnimationAction | undefined, once = false) => {
    if (!next) return;
    const prev = current.current;
    next.reset();
    next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
    next.clampWhenFinished = once;
    next.enabled = true;
    next.setEffectiveWeight(1);
    if (prev && prev !== next) next.crossFadeFrom(prev, FADE, true);
    next.play();
    current.current = next;
  };

  // Looping state clip, unless a one-shot is mid-flight.
  useEffect(() => {
    if (playingOneShot.current) return;
    crossTo(actions[STATE_CLIP[state]]);
  }, [state, actions]);

  // One-shots (wave, poke, dance…) return to the current state clip when done.
  useEffect(() => {
    if (!oneShot) return;
    const action = actions[oneShot.name];
    if (!action) return;
    playingOneShot.current = true;
    crossTo(action, true);
    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action !== action) return;
      playingOneShot.current = false;
      crossTo(actions[STATE_CLIP[stateRef.current]]);
    };
    mixer.addEventListener("finished", onFinished);
    return () => mixer.removeEventListener("finished", onFinished);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneShot?.id]);

  useEffect(() => () => {
    mixer.stopAllAction();
  }, [mixer]);

  // Fires once the GLB is parsed and on screen, not just when the canvas exists.
  useEffect(() => {
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor → head/neck offsets layered on top of whatever clip is playing.
  const target = useRef({ yaw: 0, pitch: 0 });
  const look = useRef({ yaw: 0, pitch: 0 });
  useEffect(() => {
    if (!lookAtCursor) return;
    const onMove = (e: PointerEvent) => {
      target.current.yaw = ((e.clientX / window.innerWidth) * 2 - 1) * 0.5;
      target.current.pitch = ((e.clientY / window.innerHeight) * 2 - 1) * 0.28;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [lookAtCursor]);

  const tmp = useMemo(
    () => ({
      parent: new THREE.Quaternion(),
      inv: new THREE.Quaternion(),
      rot: new THREE.Quaternion(),
      euler: new THREE.Euler(0, 0, 0, "YXZ"),
    }),
    [],
  );

  const talk = useRef(0);
  const attend = useRef(0);
  useFrame(({ clock }, delta) => {
    mixer.update(Math.min(delta, 0.1));

    // Head tracking fades out while the body is busy with a gesture.
    const busy = playingOneShot.current || stateRef.current === "thinking" || stateRef.current === "confused";
    const k = Math.min(1, delta * 5);
    const goalYaw = lookAtCursor && !busy ? target.current.yaw : 0;
    const goalPitch = lookAtCursor && !busy ? target.current.pitch : 0;
    look.current.yaw += (goalYaw - look.current.yaw) * k;
    look.current.pitch += (goalPitch - look.current.pitch) * k;

    // While answering: small, steady nods and a slight turn, like someone explaining.
    const talkGoal = stateRef.current === "answering" && !playingOneShot.current ? 1 : 0;
    talk.current += (talkGoal - talk.current) * Math.min(1, delta * 3);
    // While the visitor types: turn toward the chat box (screen-left) and glance down at it.
    const attendGoal = stateRef.current === "typing" && !playingOneShot.current ? 1 : 0;
    attend.current += (attendGoal - attend.current) * Math.min(1, delta * 4);
    const t = clock.elapsedTime;
    const pitch =
      look.current.pitch * (1 - attend.current) +
      attend.current * (0.14 + Math.sin(t * 0.9) * 0.02) +
      talk.current * (Math.sin(t * 3.1) * 0.05 + Math.sin(t * 7.3) * 0.015);
    const yaw =
      look.current.yaw * (1 - attend.current) +
      attend.current * -0.42 +
      talk.current * Math.sin(t * 1.2) * 0.09;
    if (Math.abs(yaw) < 1e-4 && Math.abs(pitch) < 1e-4) return;

    // Apply as a world-space rotation so bone axis conventions don't matter:
    // local' = parentWorld⁻¹ · R · parentWorld · local
    const { head, neck, chest } = bones;
    const apply = (bone: THREE.Bone | null, share: number) => {
      if (!bone || !bone.parent) return;
      bone.parent.updateWorldMatrix(true, false);
      bone.parent.getWorldQuaternion(tmp.parent);
      tmp.inv.copy(tmp.parent).invert();
      tmp.euler.set(pitch * share, yaw * share, 0);
      tmp.rot.setFromEuler(tmp.euler);
      bone.quaternion.premultiply(tmp.inv.multiply(tmp.rot).multiply(tmp.parent));
      bone.updateMatrixWorld(true);
    };
    apply(chest, 0.15);
    apply(neck, 0.35);
    apply(head, 0.5);
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!onPoke) return;
    e.stopPropagation();
    onPoke();
  };

  return (
    <primitive
      object={scene}
      onPointerDown={onPointerDown}
      onPointerOver={() => onPoke && (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    />
  );
}

interface Props extends ModelProps {
  className?: string;
  /** Camera framing: full body for the hero, closer crop for side sections. */
  framing?: "full" | "half" | "hero";
}

const FRAMING = {
  full: { position: [0, 1.0, 4.6] as [number, number, number], target: [0, 0.92, 0] as [number, number, number], fov: 27 },
  half: { position: [0, 1.35, 3.4] as [number, number, number], target: [0, 1.3, 0] as [number, number, number], fov: 27 },
  // "full" for a canvas that bleeds 18% above its stage: wider vertical FOV and a raised
  // target keep him the same size with his feet in the same place, but give raised
  // arms headroom instead of clipping them.
  hero: { position: [0, 1.2, 4.6] as [number, number, number], target: [0, 1.12, 0] as [number, number, number], fov: 31.6 },
};

export function Avatar({ className = "", framing = "full", ...model }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const f = FRAMING[framing];

  // Mount the WebGL canvas only when near the viewport and pause it when off-screen,
  // so at most one avatar is ever rendering.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const nearIo = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "60% 0px" });
    const visIo = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    nearIo.observe(el);
    visIo.observe(el);
    return () => {
      nearIo.disconnect();
      visIo.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      {near && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          camera={{ position: f.position, fov: f.fov }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.6 }}
          onCreated={({ camera }) => camera.lookAt(...f.target)}
        >
          <AdaptiveDpr />
          {/* Procedural studio IBL (no HDR download) + warm sun key, front fill, cool rim. No shadow maps. */}
          <StudioEnvironment />
          <hemisphereLight args={["#fff2e2", "#c99a6a", 0.55]} />
          <directionalLight position={[-2.2, 3.4, 3.2]} intensity={2.7} color="#ffd9ad" />
          <directionalLight position={[1.5, 1.4, 4]} intensity={1.0} color="#fff1e0" />
          <directionalLight position={[2.6, 2.4, -2.6]} intensity={1.8} color="#ffcf9a" />
          <Suspense fallback={null}>
            <AvatarModel {...model} />
            <FootShadow />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

/** Soft studio lighting baked once per canvas from three's RoomEnvironment (no HDR download). */
function StudioEnvironment() {
  const gl = useThree((st) => st.gl);
  const map = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => map.dispose(), [map]);
  return <Environment map={map} environmentIntensity={0.55} />;
}

/** Soft baked blob under the feet (replaces a per-frame contact-shadow render). */
function FootShadow() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(14,23,38,0.45)");
    grad.addColorStop(1, "rgba(14,23,38,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0.02]} scale={[1.1, 0.7, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}
