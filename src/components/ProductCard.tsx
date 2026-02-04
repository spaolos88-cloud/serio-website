import React, { useRef } from 'react';
import { ShieldCheck, BarChart3, AlertCircle, Eye, ArrowLeftRight, Activity } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import GlassCard from './ui/GlassCard';
// @ts-ignore
import { calculateModelSignals } from '../data/sonicDiagnosticPool';

interface Product {
    id: string;
    name: string;
    description?: string;
    verified?: boolean;
    image_url?: string;
    original_price?: string;
    release_year?: string;
    category?: string;
    score?: number;
    // Allow flexible properties for the visualizer
    [key: string]: any;
}

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
    onCompare?: (e: React.MouseEvent) => void;
    className?: string; // Allow external className overrides
}

const ProductCard = React.memo(({ product, onClick, onCompare, className = '' }: ProductCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
    const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXRel = e.clientX - rect.left;
        const mouseYRel = e.clientY - rect.top;
        const xPct = (mouseXRel / width) - 0.5;
        const yPct = (mouseYRel / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Calculate signals for visualizer
    const signals = calculateModelSignals ? calculateModelSignals(product) : { M: 50, A: 50, S: 50, R: 50, V: 50 };
    const chartKeys = ['M', 'A', 'S', 'R', 'V'];
    const chartColors: Record<string, string> = {
        M: 'bg-rose-400', A: 'bg-cyan', S: 'bg-green-400', R: 'bg-purple-400', V: 'bg-orange-400'
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
            }}
            className={`h-full ${className}`}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative h-full"
            >
                <GlassCard
                    onClick={onClick}
                    className="group flex flex-col h-full min-h-[340px] relative overflow-hidden bg-black/40 border-white/10 hover:border-cyan/30 transition-colors"
                >
                    {/* Holographic Shine */}
                    <motion.div
                        style={{
                            background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.1) 0%, transparent 60%)`,
                        }}
                        className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                    />

                    {/* Image Section */}
                    <div className="relative aspect-square w-full overflow-hidden bg-surfaceHighlight/30 border-b border-white/5 group-hover:border-cyan/20 transition-colors" style={{ transform: "translateZ(20px)" }}>
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                                <BarChart3 className="w-16 h-16 text-textDim/10 group-hover:text-cyan/50 transition-colors duration-500" />
                            </div>
                        )}

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />

                        {/* 3D Floating Badges */}
                        <motion.div
                            style={{ transform: "translateZ(30px)" }}
                            className="absolute top-3 right-3 flex flex-col items-end gap-2"
                        >
                            {product.verified && (
                                <div className="flex items-center gap-1.5 bg-cyan/10 backdrop-blur-md px-2 py-1 rounded-sm border border-cyan/30 text-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Verified</span>
                                    <ShieldCheck className="w-3 h-3" />
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            style={{ transform: "translateZ(40px)" }}
                            className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30"
                        >
                            <button className="p-3 bg-black/80 border border-white/20 rounded-full hover:bg-cyan hover:border-cyan hover:text-black hover:scale-110 transition-all shadow-xl backdrop-blur-sm" title="View Details">
                                <Eye className="w-5 h-5" />
                            </button>
                            {onCompare && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onCompare(e); }}
                                    className="p-3 bg-black/80 border border-white/20 rounded-full hover:bg-custom-gold hover:border-custom-gold hover:text-black hover:scale-110 transition-all shadow-xl backdrop-blur-sm"
                                    title="Add to Compare"
                                >
                                    <ArrowLeftRight className="w-5 h-5" />
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-grow flex flex-col relative bg-gradient-to-b from-white/[0.02] to-transparent" style={{ transform: "translateZ(10px)" }}>
                        {/* Mini Visualizer - Spans top of content */}
                        <div className="flex items-end gap-1 h-5 mb-3 opacity-30 group-hover:opacity-100 transition-opacity duration-500 border-b border-white/5 pb-2">
                            {chartKeys.map((k) => (
                                <div key={k} className="flex-1 h-full bg-white/5 rounded-sm relative overflow-hidden flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${(signals as any)[k]}%` }}
                                        transition={{ duration: 1, type: "spring" }}
                                        className={`w-full ${chartColors[k]} opacity-80`}
                                    />
                                </div>
                            ))}
                            <Activity className="w-3 h-3 text-textDim ml-1 mb-1" />
                        </div>

                        <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-display font-bold text-lg text-white leading-tight group-hover:text-cyan transition-colors line-clamp-2">
                                {product.name}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[9px] font-mono text-cyan/70 bg-cyan/5 px-1.5 py-0.5 rounded border border-cyan/10">
                                {product.category || 'DEVICE'}
                            </span>
                            {product.score && (
                                <span className="text-[9px] font-mono text-custom-gold/70 bg-custom-gold/5 px-1.5 py-0.5 rounded border border-custom-gold/10">
                                    SCR: {product.score}
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-textDim line-clamp-2 font-mono leading-relaxed opacity-50 group-hover:opacity-100 transition-opacity">
                            {product.description || "No proprietary signal data available."}
                        </p>

                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-textDim">
                                ID: {product.id?.split('-').pop()?.toUpperCase() || 'UNK'}
                            </span>

                            {!product.verified && (
                                <span className="flex items-center gap-1.5 text-[9px] text-white/20 font-mono" title="Unverified Source">
                                    <AlertCircle className="w-3 h-3" />
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Decorative Edges */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/10 group-hover:border-cyan/50 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/10 group-hover:border-custom-gold/50 transition-colors" />
                </GlassCard>
            </motion.div>
        </motion.div>
    );
});

export default ProductCard;
