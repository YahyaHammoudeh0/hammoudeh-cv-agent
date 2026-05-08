import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useEffect, useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

export type AgentState = "idle" | "typing" | "thinking" | "answering" | "excited" | "confused";

const ROBOT_URL = "/nexbot.glb";
useGLTF.preload(ROBOT_URL);

function buildFaceCanvas() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 384;
  return c;
}

const LEFT_CX = 416;
const RIGHT_CX = 608;
const EYE_CY = 226;
const MOUTH_CY = 360;
const QUESTION_CY = 258;
const EYE_SPACING = 26;
const EYE_DOT = 17;

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ledPattern(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  points: Array<[number, number, number?]>,
  sp = EYE_SPACING,
  d = EYE_DOT,
) {
  for (const [x, y, scale = 1] of points) {
    dot(ctx, cx + x * sp, cy + y * sp, (d * scale) / 2);
  }
}

function rectEye(ctx: CanvasRenderingContext2D, cx: number, cy: number, cols: number, rows: number, sp: number, d: number) {
  const x0 = cx - (cols * sp) / 2;
  const y0 = cy - (rows * sp) / 2;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      dot(ctx, x0 + i * sp + sp / 2, y0 + j * sp + sp / 2, d / 2);
    }
  }
}

function scanEye(ctx: CanvasRenderingContext2D, cx: number, cy: number, cols: number, rows: number, sp: number, d: number, t: number) {
  const phase = (t * 1.6) % (cols + 2);
  const x0 = cx - (cols * sp) / 2;
  const y0 = cy - (rows * sp) / 2;
  for (let i = 0; i < cols; i++) {
    const dist = Math.abs(i - phase + 1);
    const intensity = Math.max(0.15, 1 - dist / 2.2);
    ctx.globalAlpha = intensity;
    for (let j = 0; j < rows; j++) {
      dot(ctx, x0 + i * sp + sp / 2, y0 + j * sp + sp / 2, d / 2);
    }
  }
  ctx.globalAlpha = 1;
}

function chevronEye(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: "up" | "down") {
  // ^ / v shape, 5 dots
  const sp = 22;
  const d = 16;
  const sign = dir === "up" ? -1 : 1;
  const offsets: [number, number][] = [
    [-2, 1 * sign],
    [-1, 0],
    [0, -1 * sign],
    [1, 0],
    [2, 1 * sign],
  ];
  for (const [ox, oy] of offsets) {
    dot(ctx, cx + ox * sp, cy + oy * sp, d / 2);
  }
}

function smileArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  const n = 11;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = cx + (t - 0.5) * w;
    const y = cy + (4 * t * (1 - t)) * h * 0.5 - h * 0.25;
    dot(ctx, x, y, 10);
  }
}

function ellipsis(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = 0.35 + Math.max(0, Math.sin(t * 5 - i * 0.8)) * 0.65;
    dot(ctx, cx + (i - 1) * 30, cy, 8);
  }
  ctx.globalAlpha = 1;
}

function waveformMouth(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  const n = 9;
  for (let i = 0; i < n; i++) {
    const x = cx + (i - (n - 1) / 2) * 22;
    const y = cy + Math.sin(t * 9 + i * 0.9) * 15;
    dot(ctx, x, y, 7);
  }
}

function questionMark(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ledPattern(ctx, cx, cy, [
    [-1, -2],
    [0, -2],
    [1, -1],
    [0, 0],
    [0, 1],
    [0, 2, 0.75],
  ], 18, 12);
}

function drawFace(canvas: HTMLCanvasElement, state: AgentState, t: number) {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(255, 255, 255, 0.75)";
  ctx.shadowBlur = 12;

  // Compact LED matrices. These render onto the visor as a canvas texture, not inside the GLB.
  switch (state) {
    case "idle": {
      const blink = Math.sin(t * 1.8) > 0.96;
      if (blink) {
        rectEye(ctx, LEFT_CX, EYE_CY, 4, 1, EYE_SPACING, EYE_DOT * 0.85);
        rectEye(ctx, RIGHT_CX, EYE_CY, 4, 1, EYE_SPACING, EYE_DOT * 0.85);
      } else {
        ledPattern(ctx, LEFT_CX, EYE_CY, [
          [-1.5, -0.5],
          [-0.5, -0.5],
          [0.5, -0.5],
          [1.5, -0.5],
          [-1, 0.5],
          [0, 0.5],
          [1, 0.5],
        ]);
        ledPattern(ctx, RIGHT_CX, EYE_CY, [
          [-1.5, -0.5],
          [-0.5, -0.5],
          [0.5, -0.5],
          [1.5, -0.5],
          [-1, 0.5],
          [0, 0.5],
          [1, 0.5],
        ]);
      }
      break;
    }
    case "typing":
      ledPattern(ctx, LEFT_CX, EYE_CY, [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [0, 1],
      ]);
      ledPattern(ctx, RIGHT_CX, EYE_CY, [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [0, 1],
      ]);
      ellipsis(ctx, 512, MOUTH_CY, t);
      break;
    case "thinking":
      scanEye(ctx, LEFT_CX, EYE_CY, 5, 2, EYE_SPACING, EYE_DOT, t);
      scanEye(ctx, RIGHT_CX, EYE_CY, 5, 2, EYE_SPACING, EYE_DOT, t);
      ellipsis(ctx, 512, MOUTH_CY, t * 0.8);
      break;
    case "answering": {
      const pulse = 1 + Math.abs(Math.sin(t * 5)) * 0.15;
      ledPattern(ctx, LEFT_CX, EYE_CY - 8, [
        [-2, 0, 0.85],
        [-1, -0.5, pulse],
        [0, -0.8, pulse],
        [1, -0.5, pulse],
        [2, 0, 0.85],
        [-1, 0.7],
        [0, 0.8],
        [1, 0.7],
      ]);
      ledPattern(ctx, RIGHT_CX, EYE_CY - 8, [
        [-2, 0, 0.85],
        [-1, -0.5, pulse],
        [0, -0.8, pulse],
        [1, -0.5, pulse],
        [2, 0, 0.85],
        [-1, 0.7],
        [0, 0.8],
        [1, 0.7],
      ]);
      waveformMouth(ctx, 512, MOUTH_CY, t);
      break;
    }
    case "excited":
      chevronEye(ctx, LEFT_CX, EYE_CY, "up");
      chevronEye(ctx, RIGHT_CX, EYE_CY, "up");
      smileArc(ctx, 512, MOUTH_CY, 170, 48);
      break;
    case "confused":
      rectEye(ctx, LEFT_CX, EYE_CY, 3, 2, EYE_SPACING, EYE_DOT);
      dot(ctx, RIGHT_CX, EYE_CY, 23);
      ctx.save();
      ctx.translate(512, MOUTH_CY);
      ctx.rotate(-0.15);
      ctx.fillRect(-60, -5, 120, 10);
      ctx.restore();
      questionMark(ctx, 512, QUESTION_CY);
      break;
  }
  ctx.shadowBlur = 0;
}

// Real 2×2 twill carbon fiber: each cell contains four PARALLEL thin strands, alternating
// direction with neighbour cells. Each strand has a center-bright gradient that fakes a
// round thread cross-section so light glints down the strand axis like real CF.
function buildCarbonNormal() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#5e5eff";
  ctx.fillRect(0, 0, 512, 512);

  const cellSize = 32;
  const strands = 4;
  const strandSpan = cellSize / strands;

  for (let y = 0; y < 512; y += cellSize) {
    for (let x = 0; x < 512; x += cellSize) {
      const row = Math.floor(y / cellSize);
      const col = Math.floor(x / cellSize);
      const horizontal = (row + col) % 2 === 0;

      for (let i = 0; i < strands; i++) {
        if (horizontal) {
          const sy = y + i * strandSpan;
          const grad = ctx.createLinearGradient(0, sy + 0.5, 0, sy + strandSpan - 0.5);
          grad.addColorStop(0, "#4848ff");
          grad.addColorStop(0.5, "#b4b4ff");
          grad.addColorStop(1, "#4848ff");
          ctx.fillStyle = grad;
          ctx.fillRect(x, sy + 0.5, cellSize, strandSpan - 1);
        } else {
          const sx = x + i * strandSpan;
          const grad = ctx.createLinearGradient(sx + 0.5, 0, sx + strandSpan - 0.5, 0);
          grad.addColorStop(0, "#4848ff");
          grad.addColorStop(0.5, "#b4b4ff");
          grad.addColorStop(1, "#4848ff");
          ctx.fillStyle = grad;
          ctx.fillRect(sx + 0.5, y, strandSpan - 1, cellSize);
        }
      }

      // Cross-shadow: where this cell's strands tuck UNDER the perpendicular cell at the seam
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(x, y + cellSize - 1, cellSize, 1);
      ctx.fillRect(x + cellSize - 1, y, 1, cellSize);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  // Lower repeat → larger weave cells → visible at camera distance.
  t.repeat.set(1, 1);
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 4;
  return t;
}

// High-contrast carbon weave: pure white strands, pure black gaps, sharp edges.
// Linear color space so the shader gets the values raw, no sRGB linearization eating contrast.
function buildCarbonAlbedo() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 1024, 1024);

  const cellSize = 96;
  const strands = 4;
  const strandSpan = cellSize / strands;
  const strandThick = 7; // ~30% of strand slot — clear lines on black, not solid white

  for (let y = 0; y < 1024; y += cellSize) {
    for (let x = 0; x < 1024; x += cellSize) {
      const row = Math.floor(y / cellSize);
      const col = Math.floor(x / cellSize);
      const horizontal = (row + col) % 2 === 0;

      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < strands; i++) {
        if (horizontal) {
          const sy = y + i * strandSpan + (strandSpan - strandThick) / 2;
          ctx.fillRect(x + 2, sy, cellSize - 4, strandThick);
        } else {
          const sx = x + i * strandSpan + (strandSpan - strandThick) / 2;
          ctx.fillRect(sx, y + 2, strandThick, cellSize - 4);
        }
      }
    }
  }

  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 1);
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 4;
  // Linear (no sRGB conversion) so 1.0 = 1.0 in the shader, contrast preserved.
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

// Roughness variation: strand centers polished, edges duller — anisotropic-ish glints.
function buildCarbonRoughness() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#5a5a5a";
  ctx.fillRect(0, 0, 256, 256);
  const cellSize = 16;
  const strands = 4;
  const strandSpan = cellSize / strands;
  for (let y = 0; y < 256; y += cellSize) {
    for (let x = 0; x < 256; x += cellSize) {
      const row = Math.floor(y / cellSize);
      const col = Math.floor(x / cellSize);
      const horizontal = (row + col) % 2 === 0;
      for (let i = 0; i < strands; i++) {
        if (horizontal) {
          const sy = y + i * strandSpan;
          const grad = ctx.createLinearGradient(0, sy, 0, sy + strandSpan);
          grad.addColorStop(0, "#7a7a7a");
          grad.addColorStop(0.5, "#3a3a3a");
          grad.addColorStop(1, "#7a7a7a");
          ctx.fillStyle = grad;
          ctx.fillRect(x, sy, cellSize, strandSpan);
        } else {
          const sx = x + i * strandSpan;
          const grad = ctx.createLinearGradient(sx, 0, sx + strandSpan, 0);
          grad.addColorStop(0, "#7a7a7a");
          grad.addColorStop(0.5, "#3a3a3a");
          grad.addColorStop(1, "#7a7a7a");
          ctx.fillStyle = grad;
          ctx.fillRect(sx, y, strandSpan, cellSize);
        }
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 1);
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 4;
  return t;
}

function Robot({ state }: { state: AgentState }) {
  const { scene: loadedScene } = useGLTF(ROBOT_URL);
  // useGLTF caches the same scene object. Each Agent needs its own clone,
  // otherwise multiple canvases fight over one Three.js object.
  const scene = useMemo(() => loadedScene.clone(true), [loadedScene]);
  const wrapperRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const headPivotRef = useRef<THREE.Object3D | null>(null);
  const torsoRef = useRef<THREE.Object3D | null>(null);
  const torsoRestRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const armRefs = useRef<{
    leftArm: THREE.Object3D | null;
    rightArm: THREE.Object3D | null;
    leftElbow: THREE.Object3D | null;
    rightElbow: THREE.Object3D | null;
  }>({ leftArm: null, rightArm: null, leftElbow: null, rightElbow: null });
  const faceMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const facePlaneOwner = useRef<THREE.Mesh | null>(null);
  const headMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);

  const faceCanvas = useMemo(buildFaceCanvas, []);
  const faceTexture = useMemo(() => {
    const t = new THREE.CanvasTexture(faceCanvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true;
    return t;
  }, [faceCanvas]);
  // Initial render so the canvas isn't empty before the first useFrame tick.
  useEffect(() => {
    drawFace(faceCanvas, "idle", 0);
    faceTexture.needsUpdate = true;
  }, [faceCanvas, faceTexture]);
  const carbonNormal = useMemo(buildCarbonNormal, []);
  const carbonRoughness = useMemo(buildCarbonRoughness, []);
  const carbonAlbedo = useMemo(buildCarbonAlbedo, []);

  useEffect(() => {
    const findFirstPivot = (names: string[]): THREE.Object3D | null => {
      let found: THREE.Object3D | null = null;
      scene.traverse((o) => {
        if (!found && names.includes(o.name)) found = o;
      });
      return found as THREE.Object3D | null;
    };

    // Find the head subtree first so we can split materials by region.
    const headPivot = findFirstPivot(["head", "Head", "neck", "Neck"]);
    headPivotRef.current = headPivot;

    const headMeshSet = new Set<THREE.Object3D>();
    if (headPivot) {
      headPivot.traverse((o: any) => {
        if (o.isMesh) headMeshSet.add(o);
      });
    }

    // Glassy black for the head/face. We do NOT put the face on this material's
    // emissiveMap because the head's UVs are unknown — dots would land in random places.
    // Eyes are rendered via the face plane below.
    const glassyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#050506"),
      metalness: 0.4,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      reflectivity: 1,
    });
    headMaterialRef.current = glassyMat;
    // Premium carbon-fiber for body, arms, joints — physical material with clearcoat for that
    // wet polished sheen + anisotropic-feeling weave from the basket normal map.
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      metalness: 0.0,
      roughness: 0.55,
      // No clearcoat — kills the wet gloss that was washing out the weave detail.
    });

    // Triplanar projection — bypasses the GLB's UV mapping and samples the carbon texture from
    // world-space coords. Every surface gets uniform weave regardless of how the body was unwrapped.
    bodyMat.onBeforeCompile = (shader) => {
      shader.uniforms.uCarbonAlbedo = { value: carbonAlbedo };
      shader.uniforms.uCarbonNormal = { value: carbonNormal };
      shader.uniforms.uCarbonRoughness = { value: carbonRoughness };
      shader.uniforms.uTriplanarScale = { value: 2.0 };

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
           varying vec3 vLocalPosCarbon;
           varying vec3 vLocalNormalCarbon;`
        )
        .replace(
          "#include <fog_vertex>",
          `#include <fog_vertex>
           // LOCAL position so the weave is locked to the mesh — moves with the body, not the world.
           vLocalPosCarbon = transformed;
           vLocalNormalCarbon = normalize(objectNormal);`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           varying vec3 vLocalPosCarbon;
           varying vec3 vLocalNormalCarbon;
           uniform sampler2D uCarbonAlbedo;
           uniform sampler2D uCarbonNormal;
           uniform sampler2D uCarbonRoughness;
           uniform float uTriplanarScale;
           vec4 triplanarSample(sampler2D tex, vec3 p, vec3 blend) {
             vec4 cx = texture2D(tex, p.yz);
             vec4 cy = texture2D(tex, p.xz);
             vec4 cz = texture2D(tex, p.xy);
             return cx * blend.x + cy * blend.y + cz * blend.z;
           }`
        )
        .replace(
          "#include <map_fragment>",
          `vec3 carbonBlend = abs(vLocalNormalCarbon);
           carbonBlend = pow(carbonBlend, vec3(4.0));
           carbonBlend /= max(dot(carbonBlend, vec3(1.0)), 0.0001);
           vec3 carbonP = vLocalPosCarbon * uTriplanarScale;
           vec4 carbonCol = triplanarSample(uCarbonAlbedo, carbonP, carbonBlend);
           // Strand pixels → dark grey highlights, gap pixels → pure black.
           float weave = step(0.5, carbonCol.r);
           diffuseColor.rgb = mix(vec3(0.005), vec3(0.30), weave);`
        )
        .replace(
          "#include <roughnessmap_fragment>",
          `float roughnessFactor = roughness;
           vec3 carbonRoughBlend = abs(vLocalNormalCarbon);
           carbonRoughBlend = pow(carbonRoughBlend, vec3(4.0));
           carbonRoughBlend /= max(dot(carbonRoughBlend, vec3(1.0)), 0.0001);
           vec3 carbonRoughP = vLocalPosCarbon * uTriplanarScale;
           float carbonR = triplanarSample(uCarbonRoughness, carbonRoughP, carbonRoughBlend).g;
           roughnessFactor *= carbonR + 0.3;`
        )
        // Triplanar NORMAL perturbation — gives the weave real bumps so light catches strands.
        .replace(
          "#include <normal_fragment_maps>",
          `vec3 carbonNormalBlend = abs(vLocalNormalCarbon);
           carbonNormalBlend = pow(carbonNormalBlend, vec3(4.0));
           carbonNormalBlend /= max(dot(carbonNormalBlend, vec3(1.0)), 0.0001);
           vec3 carbonNormalP = vLocalPosCarbon * uTriplanarScale;
           vec3 nx = texture2D(uCarbonNormal, carbonNormalP.yz).xyz * 2.0 - 1.0;
           vec3 ny = texture2D(uCarbonNormal, carbonNormalP.xz).xyz * 2.0 - 1.0;
           vec3 nz = texture2D(uCarbonNormal, carbonNormalP.xy).xyz * 2.0 - 1.0;
           // Blend each axis-aligned tangent-space normal into world space, weighted by face direction.
           vec3 carbonN = normalize(
             nx.xyz * carbonNormalBlend.x +
             ny.xyz * carbonNormalBlend.y +
             nz.xyz * carbonNormalBlend.z
           );
           // Combine with the base shading normal so we keep curvature lighting on top of weave bumps.
           normal = normalize(normal + carbonN * 2.4);`
        );
    };

    scene.traverse((o: any) => {
      if (o.isMesh) {
        o.material = headMeshSet.has(o) ? glassyMat : bodyMat;
        o.castShadow = false;
        o.receiveShadow = false;
      }
    });

    // Find arm and elbow pivots; pose them in an "arms-up" stance like the Morph reference.
    const armPivots: {
      leftArm: THREE.Object3D | null;
      rightArm: THREE.Object3D | null;
      leftElbow: THREE.Object3D | null;
      rightElbow: THREE.Object3D | null;
    } = {
      leftArm: null,
      rightArm: null,
      leftElbow: null,
      rightElbow: null,
    };
    scene.traverse((o) => {
      const n = o.name;
      if (n === "arm") armPivots.leftArm = o;
      if (n === "arm.001" || n === "arm_1") armPivots.rightArm = o;
      if (n === "elbow") armPivots.leftElbow = o;
      if (n === "elbow.001" || n === "elbow_1") armPivots.rightElbow = o;
    });
    const { leftArm, rightArm, leftElbow, rightElbow } = armPivots;
    armRefs.current = { leftArm, rightArm, leftElbow, rightElbow };
    // Capture rest rotations so sway is relative.
    const r = (o: THREE.Object3D | null) =>
      o ? { x: o.rotation.x, y: o.rotation.y, z: o.rotation.z } : null;
    const restRot = {
      leftArm: r(leftArm),
      rightArm: r(rightArm),
      leftElbow: r(leftElbow),
      rightElbow: r(rightElbow),
    };
    (armRefs.current as any).rest = restRot;

    // Pose offsets relative to rest. Apply same offsets to both arms — the rig already
    // stores them in mirrored positions, so identical offsets produce a symmetric pose.
    const POSE = { armX: -0.55, armZ: 0.45, elbowX: -1.0 };
    (armRefs.current as any).pose = POSE;
    if (leftArm && restRot.leftArm) {
      leftArm.rotation.x = restRot.leftArm.x + POSE.armX;
      leftArm.rotation.z = restRot.leftArm.z + POSE.armZ;
    }
    if (rightArm && restRot.rightArm) {
      rightArm.rotation.x = restRot.rightArm.x + POSE.armX;
      rightArm.rotation.z = restRot.rightArm.z + POSE.armZ;
    }
    if (leftElbow && restRot.leftElbow) {
      leftElbow.rotation.x = restRot.leftElbow.x + POSE.elbowX;
    }
    if (rightElbow && restRot.rightElbow) {
      rightElbow.rotation.x = restRot.rightElbow.x + POSE.elbowX;
    }

    // Torso pivot — rotates the upper body so it leans naturally with the head.
    const torso = findFirstPivot(["torso", "Torso", "chest", "Chest", "spine", "Spine", "upper_body", "UpperBody", "Bot", "body"]);
    torsoRef.current = torso;
    torsoRestRef.current = r(torso);
    console.log("[Robot] torso pivot:", torso ? (torso as any).name : "(none found)");

    // Compute bbox of the whole scene, then center + scale via the inner group.
    const inner = innerRef.current;
    if (inner) {
      // Reset before measure
      inner.position.set(0, 0, 0);
      inner.scale.setScalar(1);
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const targetHeight = 2.8;
      const scale = targetHeight / size.y;
      inner.scale.setScalar(scale);
      inner.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    }

    // Face plane: compact overlay that sits on the black visor. The eyes are code-drawn,
    // so Blender edits won't affect them.
    const planeWidth = 0.64;
    const planeHeight = planeWidth * (384 / 1024);
    const faceMat = new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    faceMatRef.current = faceMat;
    const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, planeHeight), faceMat);
    facePlane.name = "FacePlane";
    facePlane.renderOrder = 999;
    facePlaneOwner.current = facePlane;

    // Face plane is transform-synced to the head in useFrame.
    facePlane.visible = true;
    if (wrapperRef.current) {
      wrapperRef.current.add(facePlane);
    } else {
      scene.add(facePlane);
    }

    (window as any).__robotScene = scene;
    (window as any).__robotPivots = {
      head: headPivot?.name ?? null,
      torso: torsoRef.current ? (torsoRef.current as any).name : null,
      arms: { leftArm: leftArm?.name, rightArm: rightArm?.name, leftElbow: leftElbow?.name, rightElbow: rightElbow?.name },
    };
  }, [scene, faceTexture, carbonNormal, carbonRoughness, carbonAlbedo]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetYaw.current = nx * 0.55;
      targetPitch.current = ny * 0.35;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useFrame((_state, delta) => {
    const t = performance.now() / 1000;
    const lerp = Math.min(1, delta * 5);

    if (wrapperRef.current) {
      wrapperRef.current.position.y = Math.sin(t * 1.05) * 0.07;
      wrapperRef.current.rotation.z = Math.sin(t * 0.6) * 0.012;
    }

    let yaw = targetYaw.current;
    let pitch = targetPitch.current;
    if (state === "thinking") {
      yaw = Math.sin(t * 1.4) * 0.45;
      pitch = -0.05;
    } else if (state === "excited") {
      yaw = Math.sin(t * 6) * 0.18;
      pitch = -0.1;
    } else if (state === "confused") {
      yaw = -0.3;
      pitch = 0.12;
    }
    if (headPivotRef.current) {
      const h = headPivotRef.current;
      h.rotation.y += (yaw - h.rotation.y) * lerp;
      h.rotation.x += (pitch - h.rotation.x) * lerp;
    }

    // Upper torso follows the head — partial rotation, slower lerp, so it feels like a natural lean.
    if (torsoRef.current && torsoRestRef.current) {
      const tBone = torsoRef.current;
      const rest = torsoRestRef.current;
      const torsoLerp = Math.min(1, delta * 3.5);
      tBone.rotation.y += (rest.y + yaw * 0.45 - tBone.rotation.y) * torsoLerp;
      tBone.rotation.x += (rest.x + pitch * 0.25 - tBone.rotation.x) * torsoLerp;
    }

    // Sway around the arms-up pose. Final rotation = rest + pose offset + small sin oscillation.
    const arms = armRefs.current as any;
    const rest = arms.rest;
    const pose = arms.pose;
    if (rest && pose) {
      const sZ = Math.sin(t * 0.7) * 0.08;
      const sX = Math.sin(t * 0.55 + 0.7) * 0.06;
      const sY = Math.sin(t * 0.65 + 1.4) * 0.08;
      if (arms.leftArm && rest.leftArm) {
        arms.leftArm.rotation.x = rest.leftArm.x + pose.armX + sX;
        arms.leftArm.rotation.z = rest.leftArm.z + pose.armZ + sZ;
        arms.leftArm.rotation.y = rest.leftArm.y - sY;
      }
      if (arms.rightArm && rest.rightArm) {
        arms.rightArm.rotation.x = rest.rightArm.x + pose.armX + sX;
        arms.rightArm.rotation.z = rest.rightArm.z + pose.armZ + sZ;
        arms.rightArm.rotation.y = rest.rightArm.y + sY;
      }
      const eFlex = Math.sin(t * 1.0) * 0.1;
      if (arms.leftElbow && rest.leftElbow) {
        arms.leftElbow.rotation.x = rest.leftElbow.x + pose.elbowX + eFlex;
      }
      if (arms.rightElbow && rest.rightElbow) {
        arms.rightElbow.rotation.x = rest.rightElbow.x + pose.elbowX + eFlex;
      }
    }

    // Sync face plane to the head transform. The LEDs are a runtime canvas texture,
    // but they should behave like they are printed onto the visor.
    const fp = facePlaneOwner.current;
    if (fp && headPivotRef.current && wrapperRef.current) {
      if (fp.parent !== wrapperRef.current) wrapperRef.current.add(fp);
      const head = headPivotRef.current;
      head.updateWorldMatrix(true, false);
      const headPos = new THREE.Vector3();
      const headQuat = new THREE.Quaternion();
      head.getWorldPosition(headPos);
      head.getWorldQuaternion(headQuat);
      // Head pivot is at the base of the head. Offset in head space, then rotate
      // by the head quaternion so the face follows yaw/pitch naturally.
      const worldTarget = headPos
        .clone()
        .add(new THREE.Vector3(0, 0.29, 0.2).applyQuaternion(headQuat));
      wrapperRef.current.updateWorldMatrix(true, false);
      const localTarget = wrapperRef.current.worldToLocal(worldTarget.clone());
      fp.position.copy(localTarget);

      const wrapperQuat = new THREE.Quaternion();
      wrapperRef.current.getWorldQuaternion(wrapperQuat);
      fp.quaternion.copy(wrapperQuat.invert().multiply(headQuat));
    }

    // Redraw the face canvas for the current state every frame so the LED expression updates.
    drawFace(faceCanvas, state, t);
    faceTexture.needsUpdate = true;

    const mat = faceMatRef.current;
    if (mat) {
      let target = 1.0;
      if (state === "typing") target = 0.55 + Math.sin(t * 7) * 0.08;
      else if (state === "thinking") target = 0.35 + Math.abs(Math.sin(t * 3.5)) * 0.65;
      else if (state === "answering") target = 1.15 + Math.sin(t * 12) * 0.25;
      else if (state === "excited") target = 1.45 + Math.sin(t * 18) * 0.3;
      else if (state === "confused") target = 0.3;
      mat.opacity += (target - mat.opacity) * Math.min(1, delta * 10);
    }
  });

  return (
    <group ref={wrapperRef}>
      <group ref={innerRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

interface Props {
  state: AgentState;
  className?: string;
}

export function Agent({ state, className = "" }: Props) {
  return (
    <div className={className || "relative"} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0.9, 3.6], fov: 24 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ pointerEvents: "none" }}
      >
        <CameraTarget />
        {/* Subtle environment so the carbon catches form, but dim enough that the visor doesn't pick up bright spots. */}
        <Environment preset="warehouse" environmentIntensity={0.35} />
        <ambientLight intensity={0.12} />
        {/* Key spotlight is now BEHIND the bot (negative Z) — gives a rim/edge light, no direct face glare. */}
        <spotLight
          position={[0.8, 4, -3.2]}
          angle={0.55}
          penumbra={0.7}
          intensity={90}
          color="#ffffff"
          decay={1.8}
          target-position={[0, 0.6, 0]}
        />
        {/* Cool rim light wrapping from behind-left for shoulder edges. */}
        <pointLight position={[-2.6, 1.4, -2.4]} intensity={8} color="#7faaff" />
        {/* Warm fill from the front but LOW so it doesn't flash on the visor. */}
        <pointLight position={[2.6, 0.4, 2.0]} intensity={1.6} color="#ffd0a0" />
        {/* Hard grazing light from the side — catches the carbon weave bumps and makes the pattern pop. */}
        <directionalLight position={[-3, 0.6, 0.8]} intensity={2.4} color="#ffffff" />
        <Suspense fallback={null}>
          <Robot state={state} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CameraTarget() {
  useFrame((s) => {
    s.camera.lookAt(0, 0.85, 0);
  });
  return null;
}
