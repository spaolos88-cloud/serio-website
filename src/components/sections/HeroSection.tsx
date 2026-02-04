import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ShieldCheck, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 contrast-125 saturate-0" />
                <div className="absolute inset-0 bg-custom-gold/5 mix-blend-overlay" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-custom-gold/10 border border-custom-gold/20 text-custom-gold text-xs font-mono mb-6 tracking-widest uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-custom-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-custom-gold"></span>
                        </span>
                        System Status: Nominal
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 leading-tight tracking-tight">
                        SONIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-custom-gold to-white text-glow">LAB</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-textDim max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        The Ultimate Reference for the Audiophile Community.
                        <br />
                        <span className="text-custom-gold/60 font-mono text-base mt-2 block">
                            // REFERENCE • TOOL • GUIDE
                        </span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/compare" className="group relative px-8 py-4 bg-custom-gold/10 hover:bg-custom-gold/20 border border-custom-gold/30 text-custom-gold rounded-none overflow-hidden transition-all duration-300 w-full sm:w-auto">
                            <div className="absolute inset-0 w-1 bg-custom-gold/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                            <span className="relative z-10 font-mono font-bold tracking-wider flex items-center gap-2 justify-center">
                                <Activity className="w-5 h-5" />
                                INITIATE ANALYSIS
                            </span>
                        </Link>

                        <Link to="/archive" className="px-8 py-4 bg-surface/50 hover:bg-surface border border-white/10 text-white hover:text-custom-gold rounded-none transition-all duration-300 backdrop-blur-sm w-full sm:w-auto font-mono tracking-wider flex items-center gap-2 justify-center">
                            <ShieldCheck className="w-5 h-5" />
                            ACCESS DATABASE
                        </Link>
                    </div>
                </motion.div>

                {/* Stats / Decorators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-8"
                >
                    {[
                        { label: 'ARCHIVED UNITS', value: '17,420', icon: Zap },
                        { label: 'DATA INTEGRITY', value: '98.4%', icon: ShieldCheck },
                        { label: 'IMAGE DATA', value: '4.2 TB', icon: Activity },
                        { label: 'LAST UPDATE', value: '2026.02.04', icon: Activity },
                    ].map((stat, i) => (
                        <div key={i} className="text-center group cursor-default">
                            <div className="text-3xl font-mono font-bold text-white group-hover:text-custom-gold transition-colors text-glow">{stat.value}</div>
                            <div className="text-[10px] text-textDim uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                                <stat.icon className="w-3 h-3 text-custom-gold/50" />
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyan/50"
            >
                <ChevronDown className="w-8 h-8" />
            </motion.div>

            {/* Grid Floor */}
            <div className="absolute bottom-0 w-full h-[50%] bg-[linear-gradient(to_top,#FFD70010_1px,transparent_1px),linear-gradient(to_right,#FFD70010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none transform perspective-[1000px] rotate-x-60 origin-bottom" />
        </div>
    );
};

export default HeroSection;
