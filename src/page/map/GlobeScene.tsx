'use client';

import {useEffect, useRef, useState, type RefObject} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import type {Marker} from '@/lib/map/coordinates';
import s from '@/style/page/map/map.module.css';

export interface GlobeHandle {
  focus: (marker: Marker) => void;
  zoom: (direction: number) => void;
  reset: () => void;
}

interface Props {
  controlRef: RefObject<GlobeHandle | null>;
  markers: Marker[];
  selected: Marker | null;
  done: string[];
  textured: boolean;
  onSelect: (marker: Marker) => void;
}

function position(marker: Pick<Marker, 'lat' | 'lon'>) {
  const lat = THREE.MathUtils.degToRad(marker.lat);
  const lon = THREE.MathUtils.degToRad(marker.lon);
  return new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
}

export default function GlobeScene({controlRef, markers, selected, done, textured, onSelect}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const refresh = useRef<(() => void) | null>(null);
  const gesture = useRef<{x: number; y: number; pointerId: number; markerId: string | null; moved: boolean} | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    gesture.current = null;
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, powerPreference: 'high-performance'});
    } catch {
      requestAnimationFrame(() => setFailed(true));
      return;
    }
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    container.prepend(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .01, 100);
    camera.position.set(0, 0, 4);
    const geometry = new THREE.SphereGeometry(1, 160, 112);
    const material = new THREE.MeshStandardMaterial({color: 0xdddddd, roughness: 1});
    const moon = new THREE.Mesh(geometry, material);
    // SphereGeometry puts longitude zero on +X; game coordinates put it on +Z.
    moon.rotation.y = -Math.PI / 2;
    scene.add(moon);
    scene.add(new THREE.AmbientLight(0xffffff, .55));
    const sun = new THREE.DirectionalLight(0xffffff, 2.3);
    scene.add(sun);
    const controls = new OrbitControls(camera, container);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = .09;
    controls.zoomSpeed = .9;
    controls.minDistance = window.matchMedia('(pointer: coarse)').matches ? 1.24 : 1.12;
    controls.touches = {ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE};
    controls.listenToKeyEvents(container);
    let fitDistance = 4;
    let frame = 0;
    let disposed = false;
    let flight: {from: THREE.Vector3; to: THREE.Vector3; start: number} | null = null;
    const projected = new THREE.Vector3();
    const lightOffset = new THREE.Vector3(-.58, .42, .7);
    const markerPosition = new THREE.Vector3();
    const textures: THREE.Texture[] = [];

    function draw(now: number) {
      frame = 0;
      if (disposed) return;
      if (flight) {
        const progress = Math.min(1, (now - flight.start) / 650);
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        const from = flight.from.clone().normalize();
        const to = flight.to.clone().normalize();
        const turn = new THREE.Quaternion().setFromUnitVectors(from, to);
        const partial = new THREE.Quaternion().slerp(turn, eased);
        camera.position.copy(from.applyQuaternion(partial).multiplyScalar(THREE.MathUtils.lerp(flight.from.length(), flight.to.length(), eased)));
        if (progress === 1) flight = null;
      }
      const changed = controls.update();
      camera.updateMatrixWorld();
      controls.rotateSpeed = Math.max(.12, Math.min(1, (camera.position.length() - 1) / (fitDistance - 1)));
      sun.position.copy(lightOffset).applyQuaternion(camera.quaternion);
      renderer.render(scene, camera);
      const width = container!.clientWidth;
      const height = container!.clientHeight;
      labels.current?.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
        markerPosition.copy(position({lat: Number(button.dataset.lat), lon: Number(button.dataset.lon)}));
        // A surface point is visible only when its outward normal faces the eye.
        const visible = markerPosition.dot(camera.position) > 1.002;
        projected.copy(markerPosition).project(camera);
        const inView = visible && Math.abs(projected.x) < 1.03 && Math.abs(projected.y) < 1.03;
        button.hidden = !inView;
        if (inView) button.style.transform = `translate(${(projected.x + 1) * width / 2}px,${(1 - projected.y) * height / 2}px) translate(-50%,-50%)`;
      });
      if (changed || flight) schedule();
    }
    function schedule() {
      if (!frame && !disposed) frame = requestAnimationFrame(draw);
    }
    function resize() {
      const width = container!.clientWidth || 1;
      const height = container!.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      const halfVertical = THREE.MathUtils.degToRad(16);
      fitDistance = 1.18 / Math.sin(Math.min(halfVertical, Math.atan(camera.aspect * Math.tan(halfVertical))));
      controls.maxDistance = fitDistance * 1.35;
      if (!controlRef.current) camera.position.setLength(fitDistance);
      else camera.position.setLength(Math.min(camera.position.length(), controls.maxDistance));
      schedule();
    }
    function fly(to: THREE.Vector3) {
      // Discard remaining drag momentum before a programmatic camera flight.
      const damping = controls.enableDamping;
      controls.enableDamping = false;
      controls.update();
      controls.enableDamping = damping;
      flight = {from: camera.position.clone(), to, start: performance.now()};
      schedule();
    }
    const interrupt = () => {flight = null;};
    controls.addEventListener('start', interrupt);
    controls.addEventListener('change', schedule);
    resize();
    controlRef.current = {
      focus: marker => fly(position(marker).multiplyScalar(camera.position.length())),
      zoom: direction => fly(camera.position.clone().setLength(THREE.MathUtils.clamp(camera.position.length() * (direction > 0 ? .8 : 1.25), controls.minDistance, controls.maxDistance))),
      reset: () => fly(new THREE.Vector3(0, 0, fitDistance)),
    };
    refresh.current = schedule;
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    if (textured) {
      const loader = new THREE.TextureLoader();
      for (const kind of ['albedo', 'normal'] as const) {
        loader.load(`/api/local-media/reference-map-${kind}`, texture => {
          if (disposed) {texture.dispose(); return;}
          textures.push(texture);
          if (kind === 'albedo') {texture.colorSpace = THREE.SRGBColorSpace; material.map = texture;}
          else {material.normalMap = texture; material.normalScale.set(.85, .85);}
          material.needsUpdate = true;
          schedule();
        });
      }
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener('start', interrupt);
      controls.removeEventListener('change', schedule);
      controls.dispose();
      textures.forEach(texture => texture.dispose());
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
      controlRef.current = null;
      refresh.current = null;
    };
  }, [controlRef, textured]);

  useEffect(() => {refresh.current?.();}, [markers, selected, done]);
  useEffect(() => {
    if (selected) controlRef.current?.focus(selected);
  }, [selected, controlRef]);

  return <div ref={host} className={s.globeScene} tabIndex={0} role="group" aria-label="Drag to rotate the Moon, scroll or pinch to zoom"
    onPointerDownCapture={event => {
      if (gesture.current) {gesture.current.moved = true; return;}
      if (event.button !== 0 || !event.isPrimary) return;
      const button = (event.target as Element).closest<HTMLButtonElement>('button[data-marker-id]');
      gesture.current = {x: event.clientX, y: event.clientY, pointerId: event.pointerId, markerId: button?.dataset.markerId ?? null, moved: false};
    }}
    onPointerMoveCapture={event => {
      const start = gesture.current;
      if (start && event.pointerId === start.pointerId && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) start.moved = true;
    }}
    onPointerUpCapture={event => {
      const start = gesture.current;
      if (!start || event.pointerId !== start.pointerId) return;
      gesture.current = null;
      // OrbitControls captures on the container, so pointerup/click no longer
      // target the original button. Resolve the saved target before it releases.
      if (start.moved || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) return;
      const marker = markers.find(item => item.id === start.markerId);
      if (marker) onSelect(marker);
    }}
    onPointerCancelCapture={() => {gesture.current = null;}}>
    {failed && <p className={s.globeError}>3D rendering is unavailable in this browser. Switch to Flat map to explore all locations.</p>}
    <div ref={labels} className={s.globeLabels}>{markers.map(marker => <button key={marker.id} type="button" hidden data-marker-id={marker.id} data-lat={marker.lat} data-lon={marker.lon} data-kind={marker.kind} data-visited={done.includes(marker.id)}
      aria-label={`${marker.name}, ${marker.coordinate}, ${marker.kind}`} aria-pressed={selected?.id === marker.id}
      title={`${marker.name} · ${marker.coordinate}`} onClick={event => {if (event.detail === 0) onSelect(marker);}}>
      <span className={s.globeIcon} style={textured?{backgroundImage:`url(/api/local-media/reference-map-${marker.kind === 'Flags' ? 'flag' : marker.kind === 'Stations' ? 'station' : 'site'})`}:undefined}>{textured?null:marker.kind === 'Flags' ? '⚑' : marker.kind === 'Stations' ? '⌂' : '◇'}</span>
    </button>)}</div>
  </div>;
}
