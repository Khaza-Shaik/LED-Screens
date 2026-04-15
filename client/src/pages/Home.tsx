import { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
    <group position={[3.5, -0.5, -1]} rotation={[0, -0.2, 0]}>
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

interface Billboard {
  id: string | number;
  location: string;
  status: string;
  price: string;
  impressions: string;
  image?: string;
}

const fallbackBillboards: Billboard[] = [
  { id: 1, location: "Times Square, NYC", status: "Active", price: "$5,000/hr", impressions: "1.5M", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1920&q=80" },
  { id: 2, location: "Shibuya Crossing, Tokyo", status: "Active", price: "$4,200/hr", impressions: "2.1M", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80" },
  { id: 3, location: "Piccadilly Circus, London", status: "High Demand", price: "$6,100/hr", impressions: "1.8M", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80" }
];

const BillboardGrid = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/billboards')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setBillboards(data.length ? data : fallbackBillboards);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch billboards, using fallback data:", err);
        setBillboards(fallbackBillboards);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Global Locations</span></h2>
            <p className="text-zinc-400 max-w-xl text-lg">Access high-traffic digital billboards in the world's most iconic hotspots.</p>
          </motion.div>
        </div>
        <Link to="/locations">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-2 text-primary hover:text-white font-medium transition-colors cursor-pointer">
            View all inventory <ChevronRight size={18} />
          </motion.div>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
           <div className="col-span-3 py-32 flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="text-zinc-500 font-medium tracking-wide animate-pulse">Syncing satellite up-links...</p>
           </div>
        ) : (
          billboards.map((bb, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={bb.id} 
              whileHover={{ y: -8 }} 
              className="glass-card rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500 flex flex-col"
            >
              <div className="h-64 relative overflow-hidden bg-black">
                 <img src={bb.image || "/billboard-placeholder.png"} alt={bb.location} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:mix-blend-normal group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-background/40 to-transparent" />
                 <div className="absolute top-4 right-4 z-20">
                   <div className="w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Zap size={14} className="text-primary" />
                   </div>
                 </div>
                 <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
                    <div className="p-2 glass rounded-lg text-primary">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-bold tracking-wider text-white drop-shadow-md">{bb.location}</span>
                 </div>
              </div>
              <div className="p-6 relative z-10 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${bb.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(0,242,255,0.2)]'}`}>
                    {bb.status}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Floor Price</p>
                    <span className="text-white font-bold tracking-tight text-xl">{bb.price}</span>
                  </div>
                </div>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                
                <div className="flex justify-between items-center mb-8">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Est. Reach</span>
                      <span className="text-zinc-300 font-medium">{bb.impressions} eyes</span>
                   </div>
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a14] bg-zinc-800 flex items-center justify-center overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?img=${idx * 3 + i + 10}`} alt="Advertiser" className="w-full h-full object-cover" />
                         </div>
                      ))}
                   </div>
                </div>
                
                <Link to="/launch-campaign" className="mt-auto w-full py-4 rounded-xl glass border border-white/5 font-bold text-white hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-300 group/btn block text-center">
                  <span className="flex items-center justify-center gap-2">
                    Deploy Campaign <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen app-bg text-white selection:bg-primary/30 selection:text-white">
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
            <Scene />
          </Canvas>
          <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-background to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-[#0a0a14] to-transparent pointer-events-none" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pointer-events-none pb-32">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                 System Online - v2.0
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-[1.1] drop-shadow-2xl">
                THE FUTURE OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary neon-text animate-pulse">ADVERTISING</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl pointer-events-auto">
                Programmatically deploy your brand to premium digital billboards globally. Zero friction, total control, real-time ROI.
              </p>
              <div className="pointer-events-auto flex flex-col sm:flex-row gap-4">
                <Link to="/launch-campaign" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105">
                  Launch Campaign <Zap size={18} className="fill-black" />
                </Link>
                <Link to="/locations" className="px-8 py-4 glass border border-white/10 text-white rounded-full font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2 hover:scale-105">
                  View Inventory <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="relative z-20 glass py-8 border-y border-white/5 pointer-events-auto mt-auto backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, color: 'text-primary', bg: 'bg-primary/10', title: 'Global Reach', value: '50+ Major Cities' },
              { icon: Zap, color: 'text-secondary', bg: 'bg-secondary/10', title: 'Deployment', value: 'Real-time (60s)' },
              { icon: Shield, color: 'text-zinc-300', bg: 'bg-white/10', title: 'Verification', value: 'PoA Compliance' },
              { icon: BarChart3, color: 'text-accent', bg: 'bg-accent/10', title: 'Analytics', value: 'Live ROI Tracking' }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-4 group">
                <div className={`p-4 ${stat.bg} rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}><stat.icon size={24} /></div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">{stat.title}</p>
                  <p className="text-sm md:text-lg font-bold text-white group-hover:text-primary transition-colors">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <div className="relative bg-[#0a0a14] z-10 w-full py-12">
        <BillboardGrid />
      </div>
    </div>
  );
}
