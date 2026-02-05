import { useState, useMemo, useEffect } from 'react';
import { Activity, ArrowRight, RefreshCcw, BrainCircuit, Fingerprint, Zap, Scale, Ear, ShieldCheck, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { getSampledDiagnostic, deriveIdentity } from '../data/sonicDiagnosticPool';

const AssessmentPage = () => {
    const navigate = useNavigate();
    const { setListenerPreference, setDiagnosticResult, diagnosticResult, addModel } = useComparison();
    const [step, setStep] = useState(0); // 0 = Intro, 1-N = Questions, N+1 = Loading, N+2 = Result
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const [sessionKey, setSessionKey] = useState(0); // Force re-render of questions on retry
    const [recommendations, setRecommendations] = useState<any[]>([]);

    // Sample 25 questions for a comprehensive yet manageable session
    const questions = useMemo(() => getSampledDiagnostic(24), [sessionKey]);

    // Recommendation Engine
    useEffect(() => {
        if (step === questions.length + 2 && diagnosticResult) {
            const fetchRecommendations = async () => {
                try {
                    const res = await fetch('/data/model-index.json');
                    const data = await res.json();

                    // Simple Similarity Algorithm based on Identity
                    const profile = diagnosticResult.primaryIdentity;
                    const keywords = {
                        'MUSICAL': ['paper', 'soft dome', 'alnico', 'tube', 'natural', 'warm'],
                        'ANALYTICAL': ['monitor', 'metal', 'beryllium', 'studio', 'reference', 'thx'],
                        'BALANCED': ['polypropylene', 'kevlar', 'carbon', 'linear', 'dynamic']
                    };

                    const targets = keywords[profile as keyof typeof keywords] || [];

                    const scored = data
                        .filter((p: any) => p.category === 'SPEAKER' || p.category === 'Amplifiers')
                        .map((p: any) => {
                            let score = 0;
                            const text = (p.name + p.brandId).toLowerCase();
                            targets.forEach(k => {
                                if (text.includes(k)) score += 10;
                            });
                            // Bonus for verified items
                            if (p.verified) score += 20;
                            // Randomize slightly to vary results
                            score += Math.random() * 5;
                            return { ...p, score };
                        })
                        .sort((a: any, b: any) => b.score - a.score)
                        .slice(0, 3);

                    setRecommendations(scored);

                } catch (e) {
                    console.error("Failed to load recommendations", e);
                }
            };
            fetchRecommendations();
        }
    }, [step, diagnosticResult, questions.length]);

    const handleAnswer = (questionId: string, value: boolean) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            startAnalysis();
        }
    };

    const handleRetry = () => {
        setSessionKey(prev => prev + 1);
        setAnswers({});
        setStep(0);
        setRecommendations([]);
    };

    // ... (Keyboard navigation effects remain the same) 
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (step >= 1 && step <= questions.length) {
                if (e.key === 'ArrowLeft' || e.key === 'y' || e.key === 'Y') {
                    handleAnswer(questions[step - 1].id, true);
                } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
                    handleAnswer(questions[step - 1].id, false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, questions]);


    const startAnalysis = async () => {
        setStep(questions.length + 1);
        // Emulate complex neural processing
        await new Promise(r => setTimeout(r, 4000));

        const result = deriveIdentity(answers);
        setDiagnosticResult(result);
        setListenerPreference(result.primaryIdentity);
        setStep(questions.length + 2);
    };

    // Render Intro
    if (step === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-8 relative overflow-hidden">
                {/* Background Decorator */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef8b56b5141e?q=80&w=2670&auto=format&fit=crop')] opacity-10 blur-sm grayscale pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"></div>

                <div className="max-w-3xl w-full bg-surface/80 backdrop-blur-xl border border-white/10 p-12 rounded-sm shadow-[0_0_100px_rgba(255,215,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Fingerprint className="w-40 h-40 text-custom-gold" />
                    </div>

                    <div className="relative z-10 space-y-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-custom-gold/10 border border-custom-gold/20 text-custom-gold font-mono text-[10px] uppercase tracking-[0.4em] rounded-sm">
                                <Activity className="w-3 h-3 animate-pulse" />
                                Sequence: Diagnostic_Init
                            </div>
                            <h1 className="text-5xl font-display font-black text-white tracking-widest uppercase leading-none">
                                NEURAL <span className="text-glow text-custom-gold">PROTOCOL</span>
                            </h1>
                        </div>

                        <div className="space-y-6">
                            <p className="text-textDim text-lg leading-relaxed font-sans border-l-3 border-custom-gold/30 pl-8 max-w-2xl opacity-90 italic">
                                "Objectivity is the only path to the truth. This protocol bypasses bias to map your inherent psychoacoustic signature."
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-textDim/60 uppercase tracking-[0.2em] border-t border-white/5 pt-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-custom-gold rounded-full"></div>
                                    Behavioral Mapping
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-custom-gold rounded-full"></div>
                                    Archival Correlation
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-custom-gold rounded-full"></div>
                                    Signal Desensitization
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-custom-gold rounded-full"></div>
                                    Identity Hash Lock
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex items-center gap-6">
                            <button
                                onClick={() => setStep(1)}
                                className="group relative px-10 py-5 bg-custom-gold hover:bg-white text-bg font-mono font-black text-sm tracking-[0.3em] uppercase rounded-none transition-all flex items-center gap-4 shadow-[0_20px_40px_rgba(255,215,0,0.15)] active:scale-[0.98]"
                            >
                                START SCAN <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <span className="text-[10px] font-mono text-textDim uppercase tracking-widest animate-pulse">
                                [Awaiting Authorization]
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render Questions
    if (step >= 1 && step <= questions.length) {
        const question = questions[step - 1];
        const progress = (step / questions.length) * 100;

        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="w-full max-w-2xl mb-16 relative">
                    <div className="flex justify-between items-end text-[10px] font-mono text-textDim uppercase tracking-[0.3em] mb-4">
                        <div className="space-y-1">
                            <span className="text-custom-gold/50 block">Module: {question.cluster}</span>
                            <span>Calibration Sequence {step}/{questions.length}</span>
                        </div>
                        <span className="text-white font-bold">{Math.round(progress)}% SECURE</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-none overflow-hidden border border-white/5 relative">
                        <div className="h-full bg-custom-gold transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,215,0,0.5)]" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between opacity-20">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="w-px h-3 bg-white"></div>
                        ))}
                    </div>
                </div>

                <div className="max-w-2xl w-full text-center space-y-16 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-6 px-8">
                        <div className="w-px h-12 bg-gradient-to-b from-transparent to-custom-gold mx-auto opacity-30"></div>
                        <h2 className="text-3xl md:text-5xl font-display font-medium text-white leading-[1.1] tracking-tight italic">
                            "{question.text}"
                        </h2>
                        <div className="w-px h-12 bg-gradient-to-t from-transparent to-custom-gold mx-auto opacity-30"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 max-w-lg mx-auto w-full">
                        <button
                            onClick={() => handleAnswer(question.id, true)}
                            className="group relative h-32 bg-white/[0.02] border border-white/10 hover:border-custom-gold/50 hover:bg-custom-gold/[0.03] transition-all rounded-sm flex flex-col items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 group-hover:border-custom-gold/50 transition-colors"></div>
                            <span className="text-3xl font-display font-black text-white group-hover:text-custom-gold transition-all tracking-[0.2em]">YES</span>
                            <span className="text-[9px] font-mono text-textDim uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100">Positive_Response</span>
                            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-custom-gold/20">[KEY_Y]</div>
                        </button>

                        <button
                            onClick={() => handleAnswer(question.id, false)}
                            className="group relative h-32 bg-white/[0.02] border border-white/10 hover:border-red-500/50 hover:bg-red-500/[0.03] transition-all rounded-sm flex flex-col items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-red-500/50 transition-colors"></div>
                            <span className="text-3xl font-display font-black text-white group-hover:text-red-500 transition-all tracking-[0.2em]">NO</span>
                            <span className="text-[9px] font-mono text-textDim uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100">Negative_Response</span>
                            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-red-500/20">[KEY_N]</div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render Loading/Analysis
    if (step === questions.length + 1) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-1000 relative">
                {/* Scientific Scan Lines */}
                <div className="absolute inset-x-0 h-px bg-custom-gold/20 animate-scan-y top-1/4"></div>
                <div className="absolute inset-x-0 h-px bg-custom-gold/20 animate-scan-y top-3/4 delay-700"></div>

                <div className="relative w-48 h-48">
                    <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                        <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                        <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-custom-gold animate-dash" strokeDasharray="502" strokeDashoffset="502" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit className="w-16 h-16 text-custom-gold animate-pulse" />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-[0.4em]">NEURAL_HASHING</h3>
                    <div className="flex flex-col gap-1 items-center">
                        <p className="text-[10px] font-mono text-custom-gold animate-pulse uppercase tracking-widest">Aggregating Behavioral Clusters...</p>
                        <p className="text-[8px] font-mono text-textDim opacity-50 uppercase tracking-widest">Cross-referencing Serio_Lab_Archive.db</p>
                    </div>
                </div>
            </div>
        );
    }

    // Render Result
    if (step === questions.length + 2 && diagnosticResult) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-8 animate-in zoom-in-95 duration-1000 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516281703302-3e74ead14ec2?q=80&w=2670&auto=format&fit=crop')] opacity-5 blur-2xl pointer-events-none grayscale"></div>

                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                    {/* Identity Card */}
                    <div className="lg:col-span-12 bg-surface/90 backdrop-blur-xl border border-custom-gold/30 p-12 rounded-none shadow-[0_0_80px_rgba(255,215,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
                        {/* Decorative Large Icon */}
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            {diagnosticResult.primaryIdentity === 'MUSICAL' ? <Ear className="w-64 h-64 text-custom-gold" /> :
                                diagnosticResult.primaryIdentity === 'ANALYTICAL' ? <Activity className="w-64 h-64 text-custom-gold" /> :
                                    <Scale className="w-64 h-64 text-custom-gold" />}
                        </div>

                        {/* Top Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-custom-gold/50 to-transparent"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-custom-gold" />
                                        <span className="text-[10px] font-mono text-custom-gold uppercase tracking-[0.5em] font-bold">Identity_Confirmed</span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-textDim font-mono text-xs uppercase tracking-[0.4em] border-l-2 border-custom-gold/20 pl-4 py-1">Personnel Classification:</h3>
                                        <h2 className="text-6xl font-display font-black text-white uppercase tracking-tighter leading-none mt-2">
                                            {diagnosticResult.primaryIdentity === 'MUSICAL' ? 'The Naturalist' :
                                                diagnosticResult.primaryIdentity === 'ANALYTICAL' ? 'The Truth-Seeker' :
                                                    'The Stabilizer'}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-8 bg-black/40 border border-white/5 rounded-none font-sans text-xl text-textDim leading-relaxed italic border-l-4 border-l-custom-gold shadow-2xl">
                                    <span className="text-custom-gold text-4xl font-serif absolute -top-4 -left-2 opacity-20">"</span>
                                    {diagnosticResult.report}
                                    <span className="text-custom-gold text-4xl font-serif absolute -bottom-8 -right-2 opacity-20">"</span>
                                </div>

                                {/* Recommended Gear Injection */}
                                {recommendations.length > 0 && (
                                    <div className="space-y-6 pt-8 border-t border-white/5">
                                        <h4 className="text-xs font-mono text-custom-gold uppercase tracking-[0.4em] flex items-center gap-2 font-bold">
                                            <Zap className="w-4 h-4" /> Lab-Authorized Hardware
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {recommendations.map(item => (
                                                <div key={item.id} className="group relative bg-white/[0.02] border border-white/5 rounded-none overflow-hidden hover:border-custom-gold/30 transition-all shadow-xl">
                                                    <div className="h-32 bg-black/50 relative overflow-hidden">
                                                        {item.image_url ?
                                                            <img src={item.image_url} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110" /> :
                                                            <div className="w-full h-full flex items-center justify-center text-textDim/20"><Activity /></div>
                                                        }
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                                        {item.verified && (
                                                            <div className="absolute top-2 right-2 p-1 bg-custom-gold/20 text-custom-gold rounded-full border border-custom-gold/30">
                                                                <ShieldCheck className="w-3 h-3 shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4 bg-surface/50">
                                                        <h5 className="font-display font-bold text-white text-xs truncate uppercase tracking-wider">{item.name}</h5>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[8px] font-mono text-textDim uppercase tracking-widest">{item.brandId}</span>
                                                            <button
                                                                onClick={() => { addModel(item.id); navigate('/compare'); }}
                                                                className="text-[8px] font-mono text-custom-gold hover:text-white uppercase tracking-[0.2em] transition-colors"
                                                            >
                                                                + Deploy
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                    <button
                                        onClick={() => navigate('/archive')}
                                        className="p-8 bg-white/[0.02] border border-white/10 hover:border-custom-gold/50 hover:bg-custom-gold/[0.02] transition-all rounded-none text-left group flex flex-col items-center justify-center gap-2"
                                    >
                                        <Layers className="w-6 h-6 text-custom-gold mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="block font-black text-white text-xs uppercase tracking-[0.2em]">Archival Access</span>
                                        <span className="text-[8px] font-mono text-textDim uppercase tracking-widest opacity-50">Return_to_Catalog</span>
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="p-8 bg-white/[0.02] border border-white/10 hover:border-white/40 transition-all rounded-none text-left group flex flex-col items-center justify-center gap-2"
                                    >
                                        <RefreshCcw className="w-6 h-6 text-textDim mb-2 group-hover:rotate-180 transition-transform duration-1000" />
                                        <span className="block font-black text-white text-xs uppercase tracking-[0.2em]">Recalibrate</span>
                                        <span className="text-[8px] font-mono text-textDim uppercase tracking-widest opacity-50">Purge_Neural_Cache</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8 bg-black/40 p-10 border border-white/5 rounded-none shadow-inner">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <h4 className="text-[10px] font-mono text-custom-gold uppercase tracking-[0.4em] font-black flex items-center gap-3">
                                        <Activity className="w-4 h-4" /> Diagnostic_Signals
                                    </h4>
                                    <span className="text-[9px] font-mono text-textDim uppercase tracking-widest opacity-50">Rel: 98.4%</span>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Musicality (M+)', val: diagnosticResult.signals.musical, max: 40, color: 'bg-custom-gold' },
                                        { label: 'Analytical (A+)', val: diagnosticResult.signals.analytical, max: 40, color: 'bg-cyan-500' },
                                        { label: 'Stability (S+)', val: diagnosticResult.signals.stability, max: 40, color: 'bg-green-500' },
                                        { label: 'Reference (R+)', val: diagnosticResult.signals.reference, max: 30, color: 'bg-blue-500' },
                                        { label: 'Volume Dep (V+)', val: diagnosticResult.signals.volume, max: 20, color: 'bg-yellow-500' },
                                        { label: 'Stimulation (C+)', val: diagnosticResult.signals.consumer, max: 20, color: 'bg-purple-500' },
                                        { label: 'Fatigue/Safety (F+)', val: diagnosticResult.signals.fatigue, max: 20, color: 'bg-red-500' },
                                    ].map(s => (
                                        <div key={s.label} className="space-y-2 group">
                                            <div className="flex justify-between text-[9px] font-mono uppercase tracking-[0.3em]">
                                                <span className="text-textDim group-hover:text-white transition-colors">{s.label}</span>
                                                <span className="text-white font-bold">{((s.val / s.max) * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-none overflow-hidden border border-white/5 p-[1px]">
                                                <div
                                                    className={`h-full ${s.color} transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(255,215,0,0.3)]`}
                                                    style={{ width: `${Math.min(100, (s.val / s.max) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <div className="flex items-start gap-4 p-4 bg-custom-gold/[0.03] border border-custom-gold/10">
                                        <div className="p-2 bg-custom-gold/10 rounded-full">
                                            <ShieldCheck className="w-4 h-4 text-custom-gold shadow-glow" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-mono text-white leading-tight uppercase tracking-widest font-bold">Neural Engine Verified</p>
                                            <p className="text-[9px] font-mono text-textDim leading-relaxed uppercase tracking-wider">Calibration complete. AI Audit engine adjusted to Personnel Classification mapping.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

export default AssessmentPage;
