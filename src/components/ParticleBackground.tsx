import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        renderer: THREE.WebGLRenderer, 
        particles: THREE.Points,
        clock: THREE.Clock;
    
    // Clean up function to handle component unmount
    const cleanup = () => {
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', onWindowResize);
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background
      containerRef.current?.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      const geometry = new THREE.BufferGeometry();
      const numParticles = 50000;
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        positions[i * 3] = (Math.random() * 2 - 1) * 5;
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * 3;
        positions[i * 3 + 2] = Math.random() * 2 - 1;

        colors[i * 3] = 0.5 + 0.5 * Math.sin(positions[i * 3] * 2);
        colors[i * 3 + 1] = 0.2 + 0.5 * Math.cos(positions[i * 3 + 1] * 2);
        colors[i * 3 + 2] = 1.0;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0.0 } },
        vertexShader: `
          uniform float time;
          varying vec3 vColor;
          void main() {
            vec3 newPosition = position;
            newPosition.y += sin(newPosition.x * 2.0 + time) * 0.2;
            vColor = color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            gl_PointSize = 2.5;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0);
          }
        `,
        vertexColors: true,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    const onWindowResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      if (!particles?.material || !renderer || !scene || !camera) {
        cancelAnimationFrame(animationId);
        return;
      }
      
      (particles.material as THREE.ShaderMaterial).uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    // Initialize and start animation
    init();
    animate();
    window.addEventListener('resize', onWindowResize);

    // Clean up on component unmount
    return cleanup;
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: -1,
        background: 'black'
      }} 
    />
  );
} 