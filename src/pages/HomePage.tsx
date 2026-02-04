import { ArrowRight, Layers, BarChart3, Activity, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import GlassCard from '../components/ui/GlassCard';

const HomePage = () => {
    return (
        <div className="flex flex-col">
            <HeroSection />

            {/* Modules Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <Link to="/archive" className="block h-full">
                        <GlassCard className="h-full p-8 group transition-all duration-500 hover:-translate-y-1 hover:border-custom-gold/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]" hoverEffect={true}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-custom-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-custom-gold/10 transition-colors"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/50 p-4 rounded-sm mb-6 w-fit text-custom-gold border border-custom-gold/20 group-hover:border-custom-gold/50 transition-all shadow-xl backdrop-blur-sm">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-display font-bold text-white mb-3 group-hover:tracking-wider transition-all duration-500 uppercase">Definitive Catalog</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-6 font-mono opacity-80 max-w-md">Access the comprehensive library of technical archival proof and diagnostic protocols.</p>

                                <div className="mt-auto flex items-center gap-2 text-custom-gold text-xs font-mono font-bold tracking-widest uppercase bg-custom-gold/5 w-fit px-3 py-2 rounded-sm border border-custom-gold/10 group-hover:bg-custom-gold/10 group-hover:border-custom-gold/30 transition-all">
                                    Initialize Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link to="/compare" className="block h-full">
                        <GlassCard className="h-full p-8 group transition-all duration-500 hover:-translate-y-1 hover:border-custom-gold/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]" hoverEffect={true}>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/50 p-4 rounded-sm mb-6 w-fit text-custom-gold border border-custom-gold/20 group-hover:border-custom-gold/50">
                                    <BarChart3 className="w-6 h-6 text-custom-gold" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-custom-gold transition-colors uppercase">Direct A/B Analysis</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-4 font-mono opacity-60">Spectral analysis and specification benchmarking tool for unit differentiation.</p>
                                <div className="mt-auto flex items-center gap-2 text-custom-gold text-xs font-mono font-bold tracking-widest uppercase bg-custom-gold/5 w-fit px-3 py-2 rounded-sm border border-custom-gold/10 group-hover:bg-custom-gold/10 group-hover:border-custom-gold/30 transition-all">
                                    Compare Units <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link to="/assessment" className="block h-full">
                        <GlassCard className="h-full p-8 group transition-all duration-500 hover:-translate-y-1 hover:border-custom-gold/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]" hoverEffect={true}>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/50 p-4 rounded-sm mb-6 w-fit text-custom-gold border border-custom-gold/20 group-hover:border-custom-gold/50">
                                    <Activity className="w-6 h-6 text-custom-gold" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-custom-gold transition-colors uppercase">Neural Diagnostics</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-4 font-mono opacity-60">Behavioral assessment protocols for listening identity classification.</p>
                                <div className="mt-auto flex items-center gap-2 text-custom-gold text-xs font-mono font-bold tracking-widest uppercase bg-custom-gold/5 w-fit px-3 py-2 rounded-sm border border-custom-gold/10 group-hover:bg-custom-gold/10 group-hover:border-custom-gold/30 transition-all">
                                    Run Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link to="/guides" className="block h-full">
                        <GlassCard className="h-full p-8 group transition-all duration-500 hover:-translate-y-1 hover:border-white/30" hoverEffect={true}>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/50 p-4 rounded-sm mb-6 w-fit text-textDim border border-white/5">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-3 uppercase">Lab Manuals</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-4 font-mono opacity-60">Technical documentation, whitepapers, and grading methodologies.</p>
                                <div className="mt-auto flex items-center gap-2 text-white/50 text-xs font-mono font-bold tracking-widest uppercase bg-white/5 w-fit px-3 py-2 rounded-sm border border-white/10 group-hover:bg-white/10 transition-all">
                                    Access Library <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
