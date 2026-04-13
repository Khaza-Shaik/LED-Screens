import { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, Sphere, GradientTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import { MapPin, BarChart3, ChevronRight, Shield, Zap, Globe } from 'lucide-react';
import * as THREE from 'three';

// --- 3D Components ---
function BillboardModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  return (
    <group position={[0, -1, 0]}>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[4, 2.5, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2, 0.11]}>
        <planeGeometry args={[3.8, 2.3]} />
        <MeshDistortMaterial color="#00f2ff" speed={2} distort={0.1} radius={1}>
          <GradientTexture stops={[0, 0.5, 1]} colors={['#00f2ff', '#7000ff', '#00f2ff']} />
        </MeshDistortMaterial>
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#7000ff" transparent opacity={0.15} emissive="#7000ff" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Scene() {
  const particlePositions = useMemo(
    () =>
      Array.from({ length: 10 }, () => [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number]),
    [],
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
      <pointLight position={[-10, 5, 5]} intensity={1} color="#7000ff" />
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <BillboardModel />
        </Float>
        {particlePositions.map((position, i) => (
          <Sphere key={i} args={[0.05, 8, 8]} position={position}>
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} transparent opacity={0.4} />
          </Sphere>
        ))}
      </Suspense>
      <fog attach="fog" args={['#050505', 5, 20]} />
    </>
  );
}

const BillboardGrid = () => {
  const [billboards, setBillboards] = useState([]);
  useEffect(() => {
    fetch('/api/billboards').then(res => res.json()).then(data => setBillboards(data)).catch(err => console.error(err));
  }, []);
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-bold mb-4">Premium Global Locations</h2>
          <p className="text-zinc-600 max-w-xl">Access high-traffic digital billboards in the world's most iconic hotspots.</p>
        </div>
        <button className="flex items-center gap-2 text-primary hover:underline font-medium">
          View all locations <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {billboards.length > 0 ? billboards.map((bb: any) => (
          <motion.div key={bb.id} whileHover={{ y: -10 }} className="glass-card rounded-3xl overflow-hidden group">
            <div className="aspect-video relative overflow-hidden bg-zinc-900">
               <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
               <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-primary">
                  <MapPin size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{bb.location}</span>
               </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${bb.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {bb.status}
                </span>
                <span className="text-primary font-bold">{bb.price}</span>
              </div>
              <p className="text-sm text-zinc-600 mb-6">Estimated {bb.impressions} eyes per cycle.</p>
              <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">
                Select Billboard
              </button>
            </div>
          </motion.div>
        )) : <div className="col-span-3 py-20 text-center text-zinc-500 italic">Syncing with global network...</div>}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen app-bg text-zinc-900">
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
            <Scene />
          </Canvas>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pointer-events-none pb-32">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-tight">
                THE FUTURE OF <br /><span className="neon-text">ADVERTISING</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 mb-10 leading-relaxed max-w-lg pointer-events-auto">
                Deploy your brand to premium digital billboards globally in seconds. 
              </p>
              <div className="pointer-events-auto">
                <button className="px-8 py-4 glass text-zinc-900 rounded-full font-bold hover:bg-white/10 transition-all">
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="relative z-20 glass py-8 border-t border-white/5 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Globe size={20} /></div>
              <div><p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Global Reach</p><p className="text-sm md:text-lg font-bold">50+ Major Cities</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary"><Zap size={20} /></div>
              <div><p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Deployment</p><p className="text-sm md:text-lg font-bold">Real-time (60s)</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl text-accent"><Shield size={20} /></div>
              <div><p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Verification</p><p className="text-sm md:text-lg font-bold">PoA Compliance</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><BarChart3 size={20} /></div>
              <div><p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Analytics</p><p className="text-sm md:text-lg font-bold">Live ROI Tracking</p></div>
            </div>
          </div>
        </div>
      </section>
      <BillboardGrid />
    </div>
  );
}
