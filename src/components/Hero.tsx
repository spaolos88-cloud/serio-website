import { motion } from 'framer-motion';
import { Activity, Music, Waves } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden px-6 md:px-12">
            {/* Dynamic Background Elements */}
            <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-purple/5 rounded-full blur-[100px] animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-8 h-[1px] bg-cyan/50"></span>
                        <span className="text-xs font-mono text-cyan uppercase tracking-[0.4em]">Audio Post-Production</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-8">
                        PRECISION <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-white">SONIC</span> <br />
                        ENGINEERING
                    </h1>

                    <p className="text-lg text-textDim max-w-lg mb-12 leading-relaxed">
                        Delivering high-fidelity sound design and expert mixing to elevate your digital storytelling. Truth in frequency, discipline in amplitude.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 bg-cyan text-bg font-mono font-bold uppercase tracking-widest rounded hover:bg-white transition-all transform hover:-translate-y-1 shadow-neon-cyan">
                            Start Session
                        </button>
                        <button className="px-8 py-4 border border-white/10 text-white font-mono uppercase tracking-widest rounded hover:bg-white/5 transition-all">
                            Watch Reel
                        </button>
                    </div>

                    <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
                        <div className="space-y-1">
                            <span className="text-2xl font-display font-bold text-white">24-BIT</span>
                            <p className="text-[10px] font-mono text-textDim uppercase tracking-widest">Hi-Fi Standard</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-2xl font-display font-bold text-white">Dolby</span>
                            <p className="text-[10px] font-mono text-textDim uppercase tracking-widest">Atmos Ready</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-2xl font-display font-bold text-white">400+</span>
                            <p className="text-[10px] font-mono text-textDim uppercase tracking-widest">Projects Done</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="vfd-display p-8 rounded-2xl border border-cyan/20 aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-50"></div>

                        {/* Visualizer Simulation */}
                        <div className="flex items-end gap-1 h-32">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [40, 100, 60, 120, 80] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1 + (i * 0.1),
                                        ease: "easeInOut"
                                    }}
                                    className="w-4 bg-gradient-to-t from-cyan/20 to-cyan rounded-t-sm"
                                />
                            ))}
                        </div>

                        {/* Overlays */}
                        <div className="absolute top-8 left-8 p-3 border-l border-t border-white/10">
                            <Activity className="w-6 h-6 text-cyan/40" />
                        </div>
                        <div className="absolute bottom-8 right-8 p-3 border-r border-b border-white/10">
                            <Waves className="w-6 h-6 text-cyan/40" />
                        </div>
                    </div>

                    {/* Floating UI Card */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute -bottom-6 -left-10 glass p-6 rounded-xl border border-white/10 shadow-2xl max-w-[200px]"
                    >
                        <Music className="text-cyan mb-3" />
                        <h4 className="text-xs font-display font-bold text-white mb-1">Signal Monitor</h4>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-cyan"></div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
