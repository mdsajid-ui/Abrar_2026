"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Procedural label canvas generator:
 * Draws the high-res Zippyfeed label with red banner, logo mascot, minerals and branding
 * to apply directly as a cylinder texture in Three.js.
 */
function createBottleLabelCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Background - pristine white label
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border & Accent Lines
  ctx.strokeStyle = "#d2382f";
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Top header ribbon
  ctx.fillStyle = "#d2382f";
  ctx.fillRect(30, 30, canvas.width - 60, 40);

  // Zippyfeed Logo Banner
  // Logo Mark 'Z'
  ctx.fillStyle = "#d2382f";
  ctx.beginPath();
  ctx.roundRect(160, 110, 80, 80, 16);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Z", 200, 150);

  // Brand Name
  ctx.fillStyle = "#0f1b2d";
  ctx.font = "bold 68px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ippyfeed", 250, 158);

  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillStyle = "#d2382f";
  ctx.fillText("MORE BETTER YUMMY", 255, 185);

  // Kendrapara Packaged Drinking Water
  ctx.textAlign = "center";
  ctx.fillStyle = "#d2382f";
  ctx.font = "bold 32px system-ui, sans-serif";
  ctx.fillText("— KENDRAPARA —", 512, 250);

  ctx.font = "bold 60px Georgia, serif";
  ctx.fillText("PACKAGED", 512, 315);
  ctx.fillStyle = "#0f1b2d";
  ctx.font = "bold 48px Georgia, serif";
  ctx.fillText("DRINKING WATER", 512, 375);

  // Center mascot illustration
  ctx.fillStyle = "#eef8fb";
  ctx.beginPath();
  ctx.arc(512, 510, 110, 0, Math.PI * 2);
  ctx.fill();

  // Water splashes / Mascot placeholder representation
  ctx.fillStyle = "#d2382f";
  ctx.font = "bold 34px system-ui, sans-serif";
  ctx.fillText("ZIPPYFEED CAFÉ", 512, 505);
  ctx.font = "24px system-ui, sans-serif";
  ctx.fillStyle = "#1f8fb3";
  ctx.fillText("Pure Mineral Hydration", 512, 540);

  // 4 icons row
  const icons = ["Pure & Safe", "Natural Minerals", "Healthy Hydration", "Refreshing Taste"];
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.fillStyle = "#0f1b2d";
  icons.forEach((ic, idx) => {
    const x = 150 + idx * 240;
    ctx.fillText(ic, x, 670);
  });

  // Table of minerals
  ctx.fillStyle = "#f5f8fa";
  ctx.fillRect(80, 720, 864, 160);
  ctx.strokeStyle = "#e3e8ee";
  ctx.lineWidth = 4;
  ctx.strokeRect(80, 720, 864, 160);

  ctx.fillStyle = "#d2382f";
  ctx.font = "bold 24px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("NUTRITIONAL INFORMATION (Typical Values):", 110, 760);

  ctx.fillStyle = "#0f1b2d";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText("Sodium Bicarbonate: 0.5 mg   •   Magnesium Sulphate: 0.2 mg", 110, 805);
  ctx.fillText("Potassium Bicarbonate: 0.1 mg   •   MRP: ₹10 (incl. of all taxes)", 110, 845);

  // Footer / Contact
  ctx.textAlign = "center";
  ctx.fillStyle = "#5b6b80";
  ctx.font = "bold 24px system-ui, sans-serif";
  ctx.fillText("Call/WhatsApp: +91 8637213741   •   Email: abrar@storzen.io", 512, 930);
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillText("Sold by Constant Abrar Co.   •   Net Quantity: 500ml", 512, 965);

  return canvas;
}

export function Bottle3DViewer({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x9fd8ea, 1.5);
    dirLight2.position.set(-5, -2, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.8, 50);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // 3. 3D Model Construction (Procedural 500ml PET water bottle)
    const bottleGroup = new THREE.Group();

    // A. Transparent PET Bottle Body
    const petMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8f5f8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Main Cylinder Body
    const bodyGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.6, 64);
    const bodyMesh = new THREE.Mesh(bodyGeo, petMaterial);
    bottleGroup.add(bodyMesh);

    // Bottom Base Dome
    const baseGeo = new THREE.SphereGeometry(0.85, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, petMaterial);
    baseMesh.position.y = -1.3;
    baseMesh.scale.set(1, 0.4, 1);
    bottleGroup.add(baseMesh);

    // Shoulder Taper
    const shoulderGeo = new THREE.CylinderGeometry(0.4, 0.85, 0.8, 64);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, petMaterial);
    shoulderMesh.position.y = 1.7;
    bottleGroup.add(shoulderMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.45, 64);
    const neckMesh = new THREE.Mesh(neckGeo, petMaterial);
    neckMesh.position.y = 2.3;
    bottleGroup.add(neckMesh);

    // White Cap
    const capGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.4, 48);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 2.65;
    bottleGroup.add(capMesh);

    // B. Inner Water Volume
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x9be0f0,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      transmission: 0.7,
      ior: 1.333,
    });
    const waterGeo = new THREE.CylinderGeometry(0.82, 0.82, 2.5, 64);
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -0.05;
    bottleGroup.add(waterMesh);

    // C. 3D Wrap-Around Product Label with Brand Logo & Info
    const labelCanvas = createBottleLabelCanvas();
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.wrapS = THREE.RepeatWrapping;
    labelTexture.repeat.set(1, 1);

    const labelGeo = new THREE.CylinderGeometry(0.865, 0.865, 1.45, 64, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 0.05;
    bottleGroup.add(labelMesh);

    // Center and tilt slightly
    bottleGroup.position.y = -0.3;
    bottleGroup.rotation.y = 0.5;
    scene.add(bottleGroup);

    setLoading(false);

    // 4. Mouse & Touch Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      bottleGroup.rotation.y += deltaX * 0.01;
      bottleGroup.rotation.x = Math.max(-0.4, Math.min(0.4, bottleGroup.rotation.x + deltaY * 0.005));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      bottleGroup.rotation.y += deltaX * 0.01;
      bottleGroup.rotation.x = Math.max(-0.4, Math.min(0.4, bottleGroup.rotation.x + deltaY * 0.005));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };
    const onTouchEnd = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 5. Resize listener
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 6. Animation loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        bottleGroup.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <div className={`bottle-3d-wrap ${className}`} style={{ position: "relative", width: "100%", height: "460px" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          background: "radial-gradient(circle at 50% 50%, #ffffff 0%, #ebf5f8 100%)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          border: "1px solid var(--c-line)",
        }}
      />
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div className="spinner" />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "14px",
          right: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <span className="badge badge-aqua" style={{ pointerEvents: "auto", fontSize: "0.75rem" }}>
          🔄 3D Interactive: Click & Drag to Rotate
        </span>
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className="btn btn-outline btn-sm"
          style={{
            pointerEvents: "auto",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
            padding: "4px 10px",
            minHeight: "32px",
            fontSize: "0.75rem",
          }}
        >
          {autoRotate ? "Pause Spin" : "Auto Spin"}
        </button>
      </div>
    </div>
  );
}
