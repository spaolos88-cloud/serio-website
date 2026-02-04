import { useState, useMemo, useEffect } from 'react';
import { Activity, ArrowRight, RefreshCcw, BrainCircuit, Fingerprint, Zap, Scale, Ear, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { getSampledDiagnostic, deriveIdentity } from '../data/sonicDiagnosticPool';
import { FULL_QUESTION_POOL } from '../data/questions';

const AssessmentPage = () => {
    const navigate = useNavigate();
    const { setListenerPreference, setDiagnosticResult, diagnosticResult, addToComparison } = useComparison();
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
            <div className="min-h-[80vh] flex items-center justify-center p-8">
                <div className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 p-12 rounded-sm shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Fingerprint className="w-32 h-32 text-custom-gold" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-2">
                            <div className="text-custom-gold font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <Activity className="w-4 h-4 animate-pulse" />
                                Neural Link Pre-Check
                            </div>
                            <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">NEURAL DIAGNOSTIC PROTOCOL</h1>
                        </div>

                        <p className="text-textDim leading-relaxed font-sans border-l-2 border-custom-gold/20 pl-6">
                            This is the comprehensive behavioral assessment. We will pull a randomized subset from our
                            <span className="text-white font-bold"> {FULL_QUESTION_POOL.length}-question logic core</span> to map your
                            psychoacoustic markers: Musicality, Analytical Depth, and Stability.
                            <br /><br />
                            The resulting profile will permanently calibrate the Serio AI Audit engine for your ears.
                        </p>

                        <div className="pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="group px-8 py-4 bg-custom-gold text-bg font-mono font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                            >
                                INITIALIZE SEQUENCE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
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
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-xl mb-12">
                    <div className="flex justify-between text-[10px] font-mono text-textDim uppercase tracking-widest mb-2">
                        <span>Calibration Step {step} of {questions.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-custom-gold transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="max-w-xl w-full text-center space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4">
                        <span className="text-[10px] font-mono text-custom-gold/40 uppercase tracking-widest">{question.cluster} Module</span>
                        <h2 className="text-2xl md:text-3xl font-display font-medium text-white leading-tight">
                            "{question.text}"
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <button
                            onClick={() => handleAnswer(question.id, true)}
                            className="p-8 bg-white/5 border border-white/10 hover:border-custom-gold hover:bg-custom-gold/5 transition-all group rounded-sm relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,215,0,0.1)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 animate-shine" />
                            <span className="block text-2xl font-bold text-white mb-2 group-hover:text-custom-gold relative z-10 font-display tracking-widest">YES</span>
                            <span className="text-[10px] font-mono text-textDim uppercase tracking-widest opacity-50 group-hover:opacity-100 italic relative z-10 flex items-center justify-center gap-2">
                                Affirmative <span className="hidden md:inline px-1.5 py-0.5 border border-custom-gold/30 rounded text-[8px] text-custom-gold bg-custom-gold/10">[Y]</span>
                            </span>
                        </button>
                        <button
                            onClick={() => handleAnswer(question.id, false)}
                            className="p-8 bg-white/5 border border-white/10 hover:border-red-500 hover:bg-red-500/5 transition-all group rounded-sm relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,68,68,0.1)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 animate-shine" />
                            <span className="block text-2xl font-bold text-white mb-2 group-hover:text-red-500 relative z-10 font-display tracking-widest">NO</span>
                            <span className="text-[10px] font-mono text-textDim uppercase tracking-widest opacity-50 group-hover:opacity-100 italic relative z-10 flex items-center justify-center gap-2">
                                Negative <span className="hidden md:inline px-1.5 py-0.5 border border-red-500/30 rounded text-[8px] text-red-500 bg-red-500/10">[N]</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render Loading/Analysis
    if (step === questions.length + 1) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-custom-gold/10 rounded-full"></div>
                    <div className="absolute inset-0 border-t-4 border-custom-gold rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit className="w-12 h-12 text-custom-gold animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-widest">Cross-Referencing Clusters</h3>
                    <p className="text-xs font-mono text-textDim animate-pulse italic">Aggregating {FULL_QUESTION_POOL.length} Psychoacoustic Data Points...</p>
                </div>
            </div>
        );
    }

    // Render Result
    if (step === questions.length + 2 && diagnosticResult) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-8 animate-in zoom-in-95 duration-1000">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Identity Card */}
                    <div className="lg:col-span-12 bg-[#0a0a0a] border border-custom-gold/50 p-10 rounded-sm shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            {diagnosticResult.primaryIdentity === 'MUSICAL' ? <Ear className="w-48 h-48" /> :
                                diagnosticResult.primaryIdentity === 'ANALYTICAL' ? <Activity className="w-48 h-48" /> :
                                    <Scale className="w-48 h-48" />}
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="px-3 py-1 bg-custom-gold/10 border border-custom-gold/30 text-custom-gold font-mono text-[10px] uppercase tracking-widest rounded-full">
                                        Identity Lock Confirmed
                                    </span>
                                    <div className="space-y-1">
                                        <h3 className="text-textDim font-mono text-xs uppercase tracking-[0.2em]">Primary Profile:</h3>
                                        <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter">
                                            {diagnosticResult.primaryIdentity === 'MUSICAL' ? 'The Naturalist' :
                                                diagnosticResult.primaryIdentity === 'ANALYTICAL' ? 'The Truth-Seeker' :
                                                    'The Stabilizer'}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 border border-white/5 rounded-sm font-sans text-lg text-textDim leading-relaxed italic border-l-4 border-l-custom-gold">
                                    "{diagnosticResult.report}"
                                </div>

                                {/* Recommended Gear Injection */}
                                {recommendations.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <h4 className="text-xs font-mono text-custom-gold uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Zap className="w-4 h-4" /> AI Hardware Recommendations
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {recommendations.map(item => (
                                                <div key={item.id} className="group relative bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden hover:bg-white/[0.05] transition-all">
                                                    <div className="h-32 bg-black/50 relative">
                                                        {item.image_url ?
                                                            <img src={item.image_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" /> :
                                                            <div className="w-full h-full flex items-center justify-center text-textDim/20"><Activity /></div>
                                                        }
                                                        {item.verified && <div className="absolute top-2 right-2 p-1 bg-cyan/20 text-cyan rounded-full"><ShieldCheck className="w-3 h-3" /></div>}
                                                    </div>
                                                    <div className="p-4">
                                                        <h5 className="font-display font-bold text-white text-sm truncate">{item.name}</h5>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[9px] font-mono text-textDim uppercase">{item.brandId}</span>
                                                            <button
                                                                onClick={() => { addToComparison(item.id); navigate('/compare'); }}
                                                                className="text-[9px] font-mono text-custom-gold hover:underline uppercase tracking-wider"
                                                            >
                                                                + Compare
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate('/archive')}
                                        className="p-6 bg-white/5 border border-white/10 hover:border-custom-gold transition-all rounded-sm text-left group"
                                    >
                                        <Zap className="w-5 h-5 text-custom-gold mb-4 group-hover:animate-pulse" />
                                        <span className="block font-bold text-white mb-1">Audit Assets</span>
                                        <span className="text-[9px] font-mono text-textDim uppercase tracking-widest">Return to Archive</span>
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="p-6 bg-white/5 border border-white/10 hover:border-white/30 transition-all rounded-sm text-left group"
                                    >
                                        <RefreshCcw className="w-5 h-5 text-textDim mb-4 group-hover:rotate-180 transition-transform duration-700" />
                                        <span className="block font-bold text-white mb-1">Recalibrate</span>
                                        <span className="text-[9px] font-mono text-textDim uppercase tracking-widest">Purge Neural Hash</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 bg-white/2 p-8 border border-white/5 rounded-sm">
                                <h4 className="text-xs font-mono text-custom-gold uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Signal Metrics Breakdown
                                </h4>
                                <div className="space-y-5">
                                    {[
                                        { label: 'Musicality (M+)', val: diagnosticResult.signals.musical, max: 40, color: 'bg-pink-500' },
                                        { label: 'Analytical (A+)', val: diagnosticResult.signals.analytical, max: 40, color: 'bg-cyan-500' },
                                        { label: 'Stability (S+)', val: diagnosticResult.signals.stability, max: 40, color: 'bg-green-500' },
                                        { label: 'Reference (R+)', val: diagnosticResult.signals.reference, max: 30, color: 'bg-blue-500' },
                                        { label: 'Volume Dep (V+)', val: diagnosticResult.signals.volume, max: 20, color: 'bg-yellow-500' },
                                        { label: 'Stimulation (C+)', val: diagnosticResult.signals.consumer, max: 20, color: 'bg-purple-500' },
                                        { label: 'Safety/Fatigue (F+)', val: diagnosticResult.signals.fatigue, max: 20, color: 'bg-red-500' },
                                    ].map(s => (
                                        <div key={s.label} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                                                <span className="text-textDim">{s.label}</span>
                                                <span className="text-white">{s.val.toFixed(1)}</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full opacity-80 ${s.color}`}
                                                    style={{ width: `${Math.min(100, (s.val / s.max) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[9px] font-mono text-textDim uppercase tracking-widest italic">
                                    <ShieldCheck className="w-3 h-3 text-custom-gold" /> AI engine calibrated to primary identity signals.
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
