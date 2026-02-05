import { ArrowRight, Layers, BarChart3, Activity, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import GlassCard from '../components/ui/GlassCard';



const HomePage = () => {
    return (
        <div className="flex flex-col">
            <HeroSection />

            <div className="max-w-7xl mx-auto px-4 py-20 w-full relative">
                <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
                    <div>
                        <h2 className="text-sm font-mono text-custom-gold uppercase tracking-[0.5em] mb-1">Mission Control</h2>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">System Access Nodes</h1>
                    </div>
                    <div className="text-[10px] font-mono text-textDim uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        Authorized Personnel Only
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <Link to="/archive" className="block h-full group">
                        <GlassCard className="h-full p-8 border-white/10 bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(255,215,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500" hoverEffect={false}>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/80 p-4 rounded-sm mb-6 w-fit text-custom-gold border border-custom-gold/20 group-hover:border-custom-gold/60 transition-all shadow-2xl backdrop-blur-md">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-display font-black text-white mb-4 group-hover:text-glow transition-all duration-500 uppercase tracking-tighter">Definitive Catalog</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-8 font-sans opacity-70 max-w-md border-l border-white/10 pl-6">Access the comprehensive library of technical archival proof and diagnostic protocols.</p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-custom-gold text-[10px] font-mono font-bold tracking-[0.2em] uppercase bg-custom-gold/10 px-4 py-2 rounded-sm border border-custom-gold/20 group-hover:bg-custom-gold/20 transition-all">
                                        Initialize Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                    <span className="text-[9px] font-mono text-custom-gold/30 uppercase tracking-[0.3em]">SECURE_LINK.v2</span>
                                </div>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link to="/compare" className="block h-full group">
                        <GlassCard className="h-full p-8 border-white/10 bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-all duration-500" hoverEffect={false}>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/80 p-4 rounded-sm mb-6 w-fit text-custom-gold border border-custom-gold/20 group-hover:border-custom-gold/60 transition-all shadow-2xl backdrop-blur-md">
                                    <BarChart3 className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-display font-black text-white mb-4 group-hover:text-glow transition-all duration-500 uppercase tracking-tighter">Direct A/B Analysis</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-8 font-sans opacity-70 max-w-md border-l border-white/10 pl-6">Spectral analysis and specification benchmarking tool for unit differentiation.</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-custom-gold text-[10px] font-mono font-bold tracking-[0.2em] uppercase bg-custom-gold/10 px-4 py-2 rounded-sm border border-custom-gold/20 group-hover:bg-custom-gold/20 transition-all">
                                        Compare Units <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                    <span className="text-[9px] font-mono text-custom-gold/30 uppercase tracking-[0.3em]">BENCHMARK_TOOL</span>
                                </div>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link to="/assessment" className="block h-full group">
                        <GlassCard className="h-full p-8 border-white/10 bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-all duration-500" hoverEffect={false}>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/80 p-4 rounded-sm mb-6 w-fit text-custom-gold border border-custom-gold/20 group-hover:border-custom-gold/60 transition-all shadow-2xl backdrop-blur-md">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-display font-black text-white mb-4 group-hover:text-glow transition-all duration-500 uppercase tracking-tighter">Neural Diagnostics</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-8 font-sans opacity-70 max-w-md border-l border-white/10 pl-6">Behavioral assessment protocols for listening identity classification.</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-custom-gold text-[10px] font-mono font-bold tracking-[0.2em] uppercase bg-custom-gold/10 px-4 py-2 rounded-sm border border-custom-gold/20 group-hover:bg-custom-gold/20 transition-all">
                                        Run Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                    <span className="text-[9px] font-mono text-custom-gold/30 uppercase tracking-[0.3em]">IDENTITY_SCAN</span>
                                </div>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link to="/guides" className="block h-full group">
                        <GlassCard className="h-full p-8 border-white/10 bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-all duration-500" hoverEffect={false}>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="bg-bg/80 p-4 rounded-sm mb-6 w-fit text-textDim border border-white/10 group-hover:border-white/40 group-hover:text-white transition-all shadow-2xl backdrop-blur-md">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-display font-black text-white mb-4 uppercase tracking-tighter">Lab Manuals</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-8 font-sans opacity-70 max-w-md border-l border-white/10 pl-6">Technical documentation, whitepapers, and grading methodologies.</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white/50 text-[10px] font-mono font-bold tracking-[0.2em] uppercase bg-white/5 px-4 py-2 rounded-sm border border-white/10 group-hover:bg-white/10 transition-all">
                                        Access Library <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                    <span className="text-[9px] font-mono text-white/10 uppercase tracking-[0.3em]">KB_VERSION.04</span>
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
