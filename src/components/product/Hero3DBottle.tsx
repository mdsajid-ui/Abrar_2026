"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Image from "next/image";
import { assetPath } from "@/lib/assets";

/**
 * Procedural ultra-crisp label canvas:
 * Generates an authentic high-resolution label texture matching the physical
 * Kendrapara Packaged Drinking Water 500ml bottle.
 */
function createHeroLabelCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Background - pristine pure white label
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer safety margin & elegant red border
  ctx.strokeStyle = "#d2382f";
  ctx.lineWidth = 14;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  // Top header banner (solid brand red)
  ctx.fillStyle = "#d2382f";
  ctx.fillRect(28, 28, canvas.width - 56, 48);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PURE • BALANCED MINERALS • KENDRAPARA", 512, 60);

  // Brand Logo Mark 'Z' Badge
  ctx.fillStyle = "#d2382f";
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(160, 115, 84, 84, 18);
  } else {
    ctx.rect(160, 115, 84, 84);
  }
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 60px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Z", 202, 157);

  // Brand Name Typography
  ctx.fillStyle = "#0f1b2d";
  ctx.font = "bold 74px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("ippyfeed", 256, 172);

  ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#d2382f";
  ctx.letterSpacing = "2px";
  ctx.fillText("MORE BETTER YUMMY", 260, 200);

  // Kendrapara Location Anchor
  ctx.textAlign = "center";
  ctx.fillStyle = "#d2382f";
  ctx.font = "bold 32px system-ui, sans-serif";
  ctx.fillText("— KENDRAPARA —", 512, 265);

  // Product Description
  ctx.font = "bold 64px Georgia, 'Times New Roman', serif";
  ctx.fillStyle = "#d2382f";
  ctx.fillText("PACKAGED", 512, 335);
  ctx.fillStyle = "#0f1b2d";
  ctx.font = "bold 52px Georgia, 'Times New Roman', serif";
  ctx.fillText("DRINKING WATER", 512, 395);

  // Water Drop Emblem & Mascot Disc
  ctx.fillStyle = "#eef8fb";
  ctx.beginPath();
  ctx.arc(512, 515, 96, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#bce4f2";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Water drop shape inside disc
  ctx.fillStyle = "#1f8fb3";
  ctx.beginPath();
  ctx.moveTo(512, 450);
  ctx.bezierCurveTo(490, 490, 470, 520, 470, 540);
  ctx.arc(512, 540, 42, Math.PI, 0, true);
  ctx.bezierCurveTo(554, 520, 534, 490, 512, 450);
  ctx.fill();

  // White highlight on water drop
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.beginPath();
  ctx.ellipse(500, 530, 10, 18, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Feature Badges Row
  const badges = ["Pure & Safe", "Added Minerals", "UV Treated", "Eco-Friendly PET"];
  ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#0f1b2d";
  badges.forEach((b, i) => {
    const x = 160 + i * 235;
    ctx.fillText(b, x, 660);
  });

  // Mineral Declaration Table
  ctx.fillStyle = "#f4f9fc";
  ctx.fillRect(80, 700, 864, 175);
  ctx.strokeStyle = "#d6e9f2";
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 700, 864, 175);

  ctx.fillStyle = "#d2382f";
  ctx.font = "bold 24px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("NUTRITIONAL INFORMATION (Typical Values per 100ml):", 110, 740);

  ctx.fillStyle = "#2a3a50";
  ctx.font = "21px system-ui, sans-serif";
  ctx.fillText("Sodium Bicarbonate: 0.5 mg   •   Magnesium Sulphate: 0.2 mg", 110, 785);
  ctx.fillText("Potassium Bicarbonate: 0.1 mg   •   Pack Volume: 500 ml", 110, 825);
  ctx.fillStyle = "#d2382f";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillText("MAXIMUM RETAIL PRICE (MRP): ₹10.00 (INCL. OF ALL TAXES)", 110, 860);

  // Footer Information
  ctx.textAlign = "center";
  ctx.fillStyle = "#5b6b80";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillText("Manufactured by M/S S.R. Groups • Sold by Constant Abrar Co., Kendrapara", 512, 925);
  ctx.font = "19px system-ui, sans-serif";
  ctx.fillText("Order Hotline: +91 8637213741 • 100% Recyclable Food Grade Bottle", 512, 960);

  return canvas;
}

export function Hero3DBottle({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let animationFrameId: number;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 560;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // 3. Cinematic Studio Lighting
    // Ambient soft pearl light
    const ambientLight = new THREE.AmbientLight(0xf2f8fc, 1.4);
    scene.add(ambientLight);

    // Key Light (Main soft white light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    // Vivid Aqua Rim Light (creates crystalline highlights on bottle outline)
    const rimLightAqua = new THREE.DirectionalLight(0x7ee0f7, 3.2);
    rimLightAqua.position.set(-6, 3, -4);
    scene.add(rimLightAqua);

    // Secondary Warm Rim Light (simulates natural light contrast)
    const rimLightWarm = new THREE.DirectionalLight(0xfff6ea, 1.5);
    rimLightWarm.position.set(4, -4, -3);
    scene.add(rimLightWarm);

    // Soft Front Fill Light
    const fillLight = new THREE.DirectionalLight(0xe8f5fb, 1.2);
    fillLight.position.set(0, -2, 5);
    scene.add(fillLight);

    // 4. Bottle Assembly Group
    const masterGroup = new THREE.Group();
    const bottleGroup = new THREE.Group();
    masterGroup.add(bottleGroup);

    // Materials: Ultra-clear PET plastic
    const petMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf3f9fc,
      transparent: true,
      opacity: 0.42,
      roughness: 0.04,
      metalness: 0.05,
      transmission: 0.94,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      specularIntensity: 1.2,
      specularColor: new THREE.Color(0xffffff),
    });

    // Material: Pure Mineral Water interior
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8fe2f7,
      transparent: true,
      opacity: 0.58,
      roughness: 0.02,
      transmission: 0.88,
      ior: 1.333,
      clearcoat: 0.8,
      clearcoatRoughness: 0.02,
    });

    // A. Main Bottle Body (500ml sleek profile)
    const bodyGeometry = new THREE.CylinderGeometry(0.86, 0.86, 2.5, 64);
    const bodyMesh = new THREE.Mesh(bodyGeometry, petMaterial);
    bodyMesh.position.y = 0;
    bottleGroup.add(bodyMesh);

    // B. Base Dome with Petaloid Stiffening Indent
    const baseGeo = new THREE.SphereGeometry(0.86, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, petMaterial);
    baseMesh.position.y = -1.25;
    baseMesh.scale.set(1, 0.38, 1);
    bottleGroup.add(baseMesh);

    // Base Rim Accent Ring
    const baseRingGeo = new THREE.TorusGeometry(0.82, 0.035, 16, 64);
    const baseRing = new THREE.Mesh(baseRingGeo, petMaterial);
    baseRing.position.y = -1.24;
    baseRing.rotation.x = Math.PI / 2;
    bottleGroup.add(baseRing);

    // C. Ergonomic Waist Grip Rings (authentic tactile bottle grooves)
    for (let r = 0; r < 3; r++) {
      const waistRingGeo = new THREE.TorusGeometry(0.855, 0.022, 16, 64);
      const waistRing = new THREE.Mesh(waistRingGeo, petMaterial);
      waistRing.position.y = -0.7 - r * 0.18;
      waistRing.rotation.x = Math.PI / 2;
      bottleGroup.add(waistRing);
    }

    // D. Shoulder Taper
    const shoulderGeo = new THREE.CylinderGeometry(0.42, 0.86, 0.85, 64);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, petMaterial);
    shoulderMesh.position.y = 1.65;
    bottleGroup.add(shoulderMesh);

    // E. Neck & Thread Collar
    const neckGeo = new THREE.CylinderGeometry(0.36, 0.42, 0.45, 64);
    const neckMesh = new THREE.Mesh(neckGeo, petMaterial);
    neckMesh.position.y = 2.25;
    bottleGroup.add(neckMesh);

    // Thread Ridges
    for (let th = 0; th < 2; th++) {
      const threadRingGeo = new THREE.TorusGeometry(0.365, 0.018, 12, 48);
      const threadRing = new THREE.Mesh(threadRingGeo, petMaterial);
      threadRing.position.y = 2.3 + th * 0.09;
      threadRing.rotation.x = Math.PI / 2;
      bottleGroup.add(threadRing);
    }

    // F. Tamper-Evident White Cap with micro-knurling
    const capGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.42, 48);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.08,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 2.65;
    bottleGroup.add(capMesh);

    // Cap Breakaway Security Ring
    const capRingGeo = new THREE.CylinderGeometry(0.375, 0.375, 0.08, 48);
    const capRingMat = new THREE.MeshStandardMaterial({
      color: 0xebf2f5,
      roughness: 0.35,
    });
    const capRing = new THREE.Mesh(capRingGeo, capRingMat);
    capRing.position.y = 2.4;
    bottleGroup.add(capRing);

    // G. Inner Water Volume
    const innerWaterGeo = new THREE.CylinderGeometry(0.83, 0.83, 2.45, 64);
    const innerWater = new THREE.Mesh(innerWaterGeo, waterMaterial);
    innerWater.position.y = -0.02;
    bottleGroup.add(innerWater);

    // Core Mineral Water Glow (internal point light)
    const corePointLight = new THREE.PointLight(0xa5ecff, 1.4, 6);
    corePointLight.position.set(0, 0.2, 0.2);
    bottleGroup.add(corePointLight);

    // H. Wrap-Around 3D Label
    const labelCanvas = createHeroLabelCanvas();
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.wrapS = THREE.RepeatWrapping;
    labelTexture.generateMipmaps = true;
    labelTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const labelGeo = new THREE.CylinderGeometry(0.875, 0.875, 1.45, 64, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.32,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 0.12;
    bottleGroup.add(labelMesh);

    // 5. Dynamic Transparent Water Splashes & Fluid Ribbons
    // Fluid Ribbon 1: Sweeping helical water ribbon orbiting the lower body
    const ribbonSpline1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, -1.5, 0.7),
      new THREE.Vector3(0.1, -1.2, 1.4),
      new THREE.Vector3(1.4, -0.6, 0.4),
      new THREE.Vector3(0.9, 0.3, -1.1),
      new THREE.Vector3(-0.8, 1.0, -0.8),
      new THREE.Vector3(-1.2, 1.7, 0.5),
    ]);
    const ribbonGeo1 = new THREE.TubeGeometry(ribbonSpline1, 96, 0.08, 16, false);
    const ribbonMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9f1fd,
      transparent: true,
      opacity: 0.75,
      roughness: 0.02,
      transmission: 0.92,
      ior: 1.34,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });
    const ribbonMesh1 = new THREE.Mesh(ribbonGeo1, ribbonMat);
    masterGroup.add(ribbonMesh1);

    // Fluid Ribbon 2: Secondary fluid crown curve near shoulder
    const ribbonSpline2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.1, 0.6, 0.8),
      new THREE.Vector3(0.5, 1.4, 1.1),
      new THREE.Vector3(-0.9, 2.0, 0.5),
      new THREE.Vector3(-0.3, 2.6, -0.7),
    ]);
    const ribbonGeo2 = new THREE.TubeGeometry(ribbonSpline2, 64, 0.055, 16, false);
    const ribbonMesh2 = new THREE.Mesh(ribbonGeo2, ribbonMat);
    masterGroup.add(ribbonMesh2);

    // 6. Floating Mineral Droplets System
    const dropletCount = 20;
    const droplets: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      radius: number;
      orbitSpeed: number;
      phase: number;
    }[] = [];

    const dropletGeo = new THREE.SphereGeometry(1, 24, 24);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xdff5fc,
      transparent: true,
      opacity: 0.8,
      roughness: 0.02,
      transmission: 0.94,
      ior: 1.333,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    for (let i = 0; i < dropletCount; i++) {
      const dropMesh = new THREE.Mesh(dropletGeo, dropletMat);
      const scale = 0.04 + Math.random() * 0.075;
      dropMesh.scale.set(scale, scale, scale);

      const angle = (i / dropletCount) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 1.35 + Math.random() * 1.1;
      const y = -1.6 + Math.random() * 3.8;

      const baseX = Math.cos(angle) * dist;
      const baseZ = Math.sin(angle) * dist;

      dropMesh.position.set(baseX, y, baseZ);
      masterGroup.add(dropMesh);

      droplets.push({
        mesh: dropMesh,
        baseX,
        baseY: y,
        baseZ,
        radius: dist,
        orbitSpeed: (0.15 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 7. Base Contact Shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, "rgba(15, 27, 45, 0.28)");
      grad.addColorStop(0.4, "rgba(15, 27, 45, 0.12)");
      grad.addColorStop(1, "rgba(15, 27, 45, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.35;
    scene.add(shadowMesh);

    // Initial positioning of master scene
    masterGroup.position.set(0.1, 0, 0);
    masterGroup.rotation.y = 0.35;
    scene.add(masterGroup);

    setIsLoaded(true);

    // 8. Interactive Parallax & Mouse Controls
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    let isUserInteracting = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let manualRotY = 0.35;
    let manualRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetParallaxX = Math.max(-1, Math.min(1, normX));
      targetParallaxY = Math.max(-1, Math.min(1, normY));
    };

    const handleMouseDown = (e: MouseEvent) => {
      isUserInteracting = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };

    const handleMouseDrag = (e: MouseEvent) => {
      if (!isUserInteracting) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      manualRotY += deltaX * 0.008;
      manualRotX = Math.max(-0.35, Math.min(0.35, manualRotX + deltaY * 0.005));
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };

    const handleMouseUp = () => {
      isUserInteracting = false;
    };

    // Touch listeners
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isUserInteracting = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isUserInteracting || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      const deltaY = e.touches[0].clientY - dragStartY;
      manualRotY += deltaX * 0.008;
      manualRotX = Math.max(-0.35, Math.min(0.35, manualRotX + deltaY * 0.005));
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isUserInteracting = false;
    };

    const dom = renderer.domElement;
    window.addEventListener("mousemove", handleMouseMove);
    dom.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseDrag);
    window.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // 9. Resize Listener
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 560;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth parallax interpolation (lerp)
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

      // Gentle levitation (floating sine-wave)
      const levitation = Math.sin(elapsed * 1.6) * 0.12;
      bottleGroup.position.y = levitation;

      // Contact shadow sync (expands and softens as bottle rises)
      const shadowFactor = 1 + levitation * 0.6;
      shadowMesh.scale.set(shadowFactor, shadowFactor, 1);
      shadowMat.opacity = 0.7 - levitation * 0.35;

      // Ambient slow auto-rotation (if user is not actively dragging)
      if (!isUserInteracting) {
        manualRotY += 0.0035;
      }

      // Apply rotation + parallax tilt to masterGroup
      masterGroup.rotation.y = manualRotY + currentParallaxX * 0.35;
      masterGroup.rotation.x = manualRotX + currentParallaxY * 0.18;
      masterGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.02 - currentParallaxX * 0.04;

      // Animate fluid ribbons
      ribbonMesh1.rotation.y = elapsed * 0.35;
      ribbonMesh1.position.y = Math.sin(elapsed * 1.8 + 1) * 0.08;
      ribbonMesh2.rotation.y = -elapsed * 0.28;
      ribbonMesh2.position.y = Math.cos(elapsed * 1.5) * 0.06;

      // Animate orbiting droplets
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        const theta = elapsed * d.orbitSpeed + d.phase;
        d.mesh.position.x = Math.cos(theta) * d.radius;
        d.mesh.position.z = Math.sin(theta) * d.radius;
        d.mesh.position.y = d.baseY + Math.sin(elapsed * 2.2 + d.phase) * 0.14;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      dom.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      bodyGeometry.dispose();
      baseGeo.dispose();
      baseRingGeo.dispose();
      shoulderGeo.dispose();
      neckGeo.dispose();
      capGeo.dispose();
      capRingGeo.dispose();
      innerWaterGeo.dispose();
      labelGeo.dispose();
      ribbonGeo1.dispose();
      ribbonGeo2.dispose();
      dropletGeo.dispose();
      shadowGeo.dispose();

      petMaterial.dispose();
      waterMaterial.dispose();
      capMat.dispose();
      capRingMat.dispose();
      labelMat.dispose();
      labelTexture.dispose();
      ribbonMat.dispose();
      dropletMat.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();

      renderer.dispose();
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
    };
  }, []);

  // WebGL Fallback if device or browser cannot render 3D canvas
  if (!webglSupported) {
    return (
      <div className={`hero-3d-fallback ${className}`}>
        <div className="hero-fallback-glow" />
        <div className="hero-fallback-stage">
          <Image
            src={assetPath("/images/zippyfeed-500ml-label-photo.png")}
            alt="Zippyfeed Kendrapara Packaged Drinking Water 500ml Bottle"
            width={380}
            height={520}
            priority
            style={{ objectFit: "contain", filter: "drop-shadow(0 24px 38px rgba(15, 27, 45, 0.22))" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`hero-3d-stage ${className} ${isLoaded ? "hero-3d-loaded" : ""}`}
      aria-label="Interactive 3D Zippyfeed water bottle with fluid water ribbons and floating droplets. Click or drag to rotate."
      style={{
        width: "100%",
        height: "100%",
        minHeight: "520px",
        position: "relative",
        cursor: "grab",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    />
  );
}
