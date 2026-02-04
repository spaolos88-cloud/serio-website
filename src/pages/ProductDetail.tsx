import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ShieldCheck, Activity, AlertTriangle, Layers,
    Search as SearchIcon, Maximize2, ChevronDown, ChevronUp,
    Copy, Check, Plus, BrainCircuit, Key, Settings, Zap,
    Fingerprint, ShieldAlert
} from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { fetchGeminiAnalysis, fetchOpenAIAnalysis } from '../services/serioAI';
import { SonicSignalSync } from '../components/ui/SonicSignalSync';

interface ModelDetail {
    id: string;
    brandId: string;
    name: string;
    category: string;
    sub_category?: string;
    url: string;
    image_url?: string;
    description: string;
    specifications: string;
    serio_taxonomy?: {
        absolute_score: number;
        performance_class: string;
        tuning_profile: string;
    };
    verified?: boolean;
    tags?: string[];
    original_price?: string;
    release_year?: string;
    technical_intel?: {
        graph_descriptions: string[];
        visual_analysis: string;
    };
}

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [model, setModel] = useState<ModelDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toggleModel, isInComparison, selectedModels, listenerPreference, diagnosticResult } = useComparison();
    const [notesExpanded, setNotesExpanded] = useState(false);
    const [copiedSpec, setCopiedSpec] = useState<string | null>(null);
    const [showCompareModal, setShowCompareModal] = useState(false);

    // AI Audit State
    const [auditing, setAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<any | null>(null);
    const [aiProvider, setAiProvider] = useState<'GEMINI' | 'OPENAI' | 'SIMULATED'>(
        import.meta.env.VITE_OPENAI_API_KEY ? 'OPENAI' : 'SIMULATED'
    );
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || '');
    const [showAiSettings, setShowAiSettings] = useState(false);
    const [auditStep, setAuditStep] = useState(0);

    const auditSteps = [
        'ESTABLISHING UPLINK...',
        'DECODING NOMENCLATURE...',
        'RECONSTRUCTING TOPOLOGY...',
        'VIRTUAL ACOUSTIC SCAN...',
        'GENERATING REPORT...'
    ];

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        fetch('/data/model-index.json')
            .then(res => res.json())
            .then(indexData => {
                const indexEntry = indexData.find((m: any) => m.id === id);
                if (!indexEntry) throw new Error("Model not found in Global Index");

                return fetch(`/data/catalog/${indexEntry.brandId}.json`)
                    .then(res => {
                        if (!res.ok) throw new Error(`Catalog not found: ${indexEntry.brandId}`);
                        return res.json();
                    })
                    .then(catalog => {
                        if (!Array.isArray(catalog)) throw new Error(`catalog.find is not a function`);
                        const fullModel = catalog.find((m: any) => m.id === id);
                        if (!fullModel) throw new Error(`Model details missing from Catalog: ${id}`);
                        return fullModel;
                    });
            })
            .then(fullModel => {
                setModel(fullModel);
                setLoading(false);
            })
            .catch(err => {
                console.error('ProductDetail Error:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    // Audit Step Cycling
    useEffect(() => {
        if (auditing) {
            const interval = setInterval(() => {
                setAuditStep(prev => (prev + 1) % auditSteps.length);
            }, 1000 * (2 / auditSteps.length)); // Cycle through all steps in 2 seconds
            return () => clearInterval(interval);
        }
    }, [auditing, auditSteps.length]);

    const handleAudit = async () => {
        if (!model) return;
        setAuditing(true);
        setAuditResult(null);

        try {
            const aiProducts = [{
                ...model,
                engineering_notes: model.description
            } as any];

            if (aiProvider === 'GEMINI' && apiKey) {
                const results = await fetchGeminiAnalysis(apiKey, aiProducts, listenerPreference || 'BALANCED', diagnosticResult);
                setAuditResult(results[model.id]);
            } else if (aiProvider === 'OPENAI' && apiKey) {
                const results = await fetchOpenAIAnalysis(apiKey, aiProducts, listenerPreference || 'BALANCED', diagnosticResult);
                setAuditResult(results[model.id]);
            } else {
                // SIMULATED / FALLBACK
                await new Promise(r => setTimeout(r, 2000));

                // Heuristic analysis for fallback
                const text = `${model.name} ${model.specifications || ''} ${model.description || ''}`.toLowerCase();
                let score = 75;
                if (text.includes("beryllium") || text.includes("boron")) score += 10;
                if (text.includes("ribbon") || text.includes("dome")) score += 5;

                setAuditResult({
                    match: Math.min(score, 99),
                    verdict: `Analytical audit suggests ${model.name} is a high-performance transducer with characteristic driver integration.`,
                    technicalHighlights: ["Driver Phase Alignment", "Beryllium/Titanium Material Signature", "Cabinet Resonance Management"],
                    frequencyAnalysis: "Measured response indicates a linear profile with specific excitement in the upper air frequencies.",
                    engineeringInsights: "Advanced topology detected in the crossover network using high-purity components.",
                    strengthsForProtocol: [
                        listenerPreference === 'ANALYTICAL' ? "High transient speed" : "Organic harmonic decay",
                        "Stable magnetic flux density"
                    ],
                    weaknessesForProtocol: ["Complexity of the crossover may require robust amplification"],
                    recommendedFor: listenerPreference === 'ANALYTICAL' ? "Critical Monitoring & Mixing" : "Hi-Fi Listening & Jazz",
                    classAssignment: score > 85 ? "Class S" : "Class A",
                    signalMatch: {
                        "M": listenerPreference === 'MUSICAL' ? 92 : 65,
                        "A": listenerPreference === 'ANALYTICAL' ? 95 : 70,
                        "S": 88,
                        "R": 82,
                        "V": 75,
                        "C": 60,
                        "F": 90
                    }
                });
            }
        } catch (e) {
            console.error("Audit Failed", e);
        } finally {
            setAuditing(false);
        }
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSpec(key);
        setTimeout(() => setCopiedSpec(null), 2000);
    };

    const handleToggleCompare = () => {
        if (!model) return;
        const willAdd = !isInComparison(model.id);
        toggleModel(model.id);
        if (willAdd) {
            setShowCompareModal(true);
        }
    };

    const formatSpecValue = (val: string) => {
        return val
            .replace(/\uFFFD/g, 'Ω')
            .replace(/\b(ohm|ohms)\b/gi, 'Ω')
            .replace(/ï½|A8/g, 'Ω');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-2 border-custom-gold/30 border-t-custom-gold rounded-full animate-spin mb-6"></div>
                    <div className="font-mono text-xs text-custom-gold tracking-[0.3em] uppercase animate-pulse">Initializing Lab Environment...</div>
                </div>
            </div>
        );
    }

    if (error || !model) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-amber-500 p-4">
                <AlertTriangle className="w-16 h-16 mb-6 opacity-80" />
                <h2 className="text-3xl font-display font-bold mb-2 tracking-widest text-custom-gold">SIGNAL LOST</h2>
                <p className="font-mono opacity-60 mb-8 border border-custom-goldDim bg-custom-goldDim/10 px-4 py-2 rounded">{error || 'Unknown Error'}</p>
                <button
                    onClick={() => navigate('/archive')}
                    className="px-6 py-3 bg-surfaceHighlight border border-white/10 rounded hover:bg-white/5 text-white transition-colors font-mono text-sm tracking-wider"
                >
                    RETURN TO ARCHIVE
                </button>
            </div>
        );
    }

    const specsList = model.specifications
        ? model.specifications.split('|').map(s => {
            const parts = s.split(':');
            return {
                key: parts[0]?.trim() || 'Spec',
                value: formatSpecValue(parts.slice(1).join(':').trim() || '')
            };
        }).filter(s => s.value)
        : [];

    return (
        <div className="min-h-screen pb-20 bg-bg text-text selection:bg-custom-gold/30 selection:text-custom-gold">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-custom-gold/5 rounded-full blur-[120px] mix-blend-screen opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
            </div>

            {/* Sticky Tech Header */}
            <div className="sticky top-[64px] z-30 bg-bg/80 backdrop-blur-xl border-b border-white/5 py-2 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-textDim hover:text-custom-gold transition-colors text-[10px] font-mono tracking-[0.2em] group uppercase"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline">Back to Archive</span>
                        <span className="md:hidden">Back</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-[9px] text-textDim font-mono uppercase tracking-widest">System Ref</span>
                            <span className="text-xs font-mono text-custom-gold">{model.id.toUpperCase()}</span>
                        </div>

                        {isInComparison(model.id) && (
                            <button
                                onClick={() => navigate('/archive')}
                                className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-sm text-[10px] font-bold font-mono transition-all uppercase tracking-widest bg-cyan/10 border border-cyan/30 text-cyan hover:bg-cyan/20 shadow-[0_0_10px_rgba(0,255,255,0.1)] group/add"
                            >
                                <SearchIcon className="w-3 h-3" />
                                Add Contender
                            </button>
                        )}

                        <button
                            onClick={handleToggleCompare}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-[10px] font-bold font-mono transition-all uppercase tracking-widest border ${isInComparison(model.id)
                                ? 'bg-custom-gold text-bg border-custom-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                                : 'bg-surfaceHighlight/50 border-white/10 text-textDim hover:border-custom-gold hover:text-custom-gold hover:bg-surfaceHighlight'
                                }`}
                        >
                            <Activity className="w-3 h-3" />
                            {isInComparison(model.id) ? 'Active' : 'Compare'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 pt-12">

                {/* Left Column: Visuals */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Main Image Viewport */}
                    <div className="relative aspect-square bg-[#050505] rounded-sm overflow-hidden border border-white/10 shadow-2xl group">

                        {/* Technical Overlays - Viewfinder Style */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-custom-gold/50 z-20"></div>
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-custom-gold/50 z-20"></div>
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-custom-gold/50 z-20"></div>
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-custom-gold/50 z-20"></div>

                        {/* Center Crosshair */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none z-20">
                            <div className="w-full h-px bg-custom-gold"></div>
                            <div className="h-full w-px bg-custom-gold absolute"></div>
                        </div>

                        {/* Image Status Label */}
                        <div className="absolute top-6 left-6 z-20 flex flex-col gap-1">
                            {model.verified ? (
                                <div className="flex items-center gap-2 px-2 py-0.5 bg-custom-gold/10 border border-custom-gold/30 backdrop-blur-sm">
                                    <ShieldCheck className="w-3 h-3 text-custom-gold" />
                                    <span className="text-[9px] font-bold tracking-[0.2em] text-custom-gold uppercase">Verified Data</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-2 py-0.5 bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <AlertTriangle className="w-3 h-3 text-textDim" />
                                    <span className="text-[9px] font-bold tracking-[0.2em] text-textDim uppercase">Unverified</span>
                                </div>
                            )}
                        </div>

                        {/* The Image Itself */}
                        {model.image_url ? (
                            <div className="w-full h-full relative cursor-zoom-in">
                                <img
                                    src={model.image_url}
                                    alt={model.name}
                                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Subtle noise overlay for texture */}
                                <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                                {/* Vignette */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)] pointer-events-none"></div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-textDim/20 bg-noise/5">
                                <Layers className="w-24 h-24 mb-4 opacity-10" />
                                <span className="font-mono text-xs tracking-widest opacity-50 uppercase">Visual Archive Missing</span>
                            </div>
                        )}

                        <div className="absolute bottom-4 right-4 text-[9px] font-mono text-textDim/50 tracking-widest z-20">
                            SRC: AUDIO-DATABASE
                        </div>
                    </div>

                    {/* VFD Style Score Display */}
                    {model.serio_taxonomy && (
                        <div className="vfd-display p-6 rounded-sm border border-white/10 overflow-hidden">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-custom-gold/70 uppercase tracking-[0.2em] mb-1">Performance Index</span>
                                    <span className="text-[9px] text-textDim uppercase tracking-wider font-mono">Serio Labs Analysis</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-mono font-medium text-custom-gold text-glow-gold tracking-tighter">
                                        {/* Score is already on 1-10 scale */}
                                        {Math.min(Math.max(model.serio_taxonomy.absolute_score, 1), 9.9).toFixed(1)}
                                    </span>
                                    <span className="text-xs text-custom-gold/50 font-mono mb-1">/10.0</span>
                                </div>
                            </div>

                            {/* Digital Bar Graph */}
                            <div className="relative h-2 bg-white/5 rounded-sm overflow-hidden mb-4">
                                <div
                                    className="h-full bg-custom-gold shadow-[0_0_10px_rgba(255,215,0,0.5)] relative"
                                    style={{ width: `${Math.min(model.serio_taxonomy.absolute_score * 10, 99)}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50"></div>
                                </div>
                                {/* Grid overlay for the bar */}
                                <div className="absolute inset-0 flex justify-between">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-px h-full bg-[#050505]"></div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-dashed border-white/10">
                                <span className="text-textDim">Class Classification</span>
                                <span className="text-custom-gold font-bold bg-custom-gold/10 px-2 py-0.5 rounded border border-custom-gold/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                                    {model.serio_taxonomy.performance_class}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* AI Product Audit Selection Card */}
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-sm overflow-hidden p-6 relative group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="font-display font-bold text-white text-lg">Engineering Audit</h3>
                        </div>

                        {!auditResult && !auditing ? (
                            <button
                                onClick={handleAudit}
                                className="w-full py-4 bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 text-cyan font-mono text-sm tracking-[0.2em] uppercase transition-all rounded-sm flex items-center justify-center gap-3 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                            >
                                <Activity className="w-4 h-4 animate-pulse" />
                                Initialize Audit
                            </button>
                        ) : auditing ? (
                            <div className="space-y-4">
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-2 border-cyan/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-t-2 border-cyan rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BrainCircuit className="w-6 h-6 text-cyan animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-mono text-cyan tracking-widest text-center animate-pulse">
                                        {auditSteps[auditStep]}
                                    </div>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-cyan transition-all duration-300"
                                        style={{ width: `${(auditStep + 1) * (100 / auditSteps.length)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <div className="flex items-center justify-between text-[10px] font-mono text-cyan uppercase tracking-widest border-b border-cyan/20 pb-2">
                                    <span>Audit Report Compete</span>
                                    <Check className="w-3 h-3" />
                                </div>
                                {auditResult?.technicalHighlights && (
                                    <ul className="space-y-2">
                                        {auditResult.technicalHighlights.slice(0, 3).map((h: string, i: number) => (
                                            <li key={i} className="text-[11px] text-text flex items-start gap-2 leading-tight">
                                                <div className="w-1 h-1 bg-cyan rounded-full mt-1.5 shrink-0"></div>
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button
                                    onClick={() => setAuditResult(null)}
                                    className="text-[10px] font-mono text-textDim hover:text-cyan transition-colors uppercase tracking-widest underline underline-offset-4"
                                >
                                    Re-run Diagnostic
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setShowAiSettings(true)}
                            className="absolute top-4 right-4 text-textDim hover:text-white transition-colors p-1"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Column: Information Data Deck */}
                <div className="lg:col-span-7">

                    {/* Header Block */}
                    <div className="mb-10 relative">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-custom-gold/20 rounded-full hidden md:block"></div>

                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-custom-gold font-mono text-sm tracking-[0.3em] uppercase">{model.brandId}</h2>
                            <div className="w-12 h-px bg-custom-gold/30"></div>
                            <span className="text-textDim text-xs font-mono uppercase tracking-wider">{model.category}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 tracking-tighter uppercase mb-4 text-engraved leading-[0.9]">
                            {model.name}
                        </h1>

                        <div className="flex flex-wrap gap-2 text-xs font-mono text-textDim mt-4">
                            {model.release_year && (
                                <span className="bg-white/5 px-3 py-1 border border-white/5 rounded-full uppercase tracking-wider text-white/80">
                                    {model.release_year}
                                </span>
                            )}
                            {model.original_price && (
                                <span className="bg-white/5 px-3 py-1 border border-white/5 rounded-full uppercase tracking-wider text-white/80">
                                    {model.original_price}
                                </span>
                            )}
                            {model.tags?.map(t => (
                                <span key={t} className="text-custom-gold/60 border border-custom-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* User Analysis / Compliance - Sticky when generated */}
                    {auditResult && (
                        <div className="mb-10 p-6 bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-sm animate-in zoom-in duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Fingerprint className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-display font-bold text-white uppercase tracking-wider">Biological Match</h3>
                                </div>
                                <div className="text-2xl font-mono text-purple-400 font-bold border-l-2 border-purple-500/30 pl-4">
                                    {auditResult.match}%
                                </div>
                            </div>

                            <p className="text-sm text-textDim font-sans italic leading-relaxed mb-6 border-l-2 border-white/5 pl-4">
                                "{auditResult.verdict}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[10px] font-mono text-purple-400/70 border-b border-purple-500/10 block pb-1 uppercase tracking-widest mb-3">Protocol Strengths</span>
                                        <div className="space-y-2">
                                            {auditResult.strengthsForProtocol?.map((s: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-textDim">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-green-500/50" />
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-purple-400/70 border-b border-purple-500/10 block pb-1 uppercase tracking-widest mb-3">Efficiency Trade-offs</span>
                                        <div className="space-y-2">
                                            {auditResult.weaknessesForProtocol?.map((w: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-textDim">
                                                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500/50 mt-0.5" />
                                                    {w}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/20 p-4 border border-white/5 rounded-sm">
                                    <span className="text-[10px] font-mono text-cyan/70 border-b border-cyan/10 block pb-1 uppercase tracking-widest mb-4">Signal Sync Map</span>
                                    {auditResult.signalMatch ? (
                                        <SonicSignalSync signals={auditResult.signalMatch} />
                                    ) : (
                                        <div className="h-full flex items-center justify-center italic text-[10px] text-textDim/30 font-mono">
                                            Calculating alignment...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-textDim uppercase">Ideal Recommended For:</span>
                                    <span className="text-xs font-display text-custom-gold tracking-wide">{auditResult.recommendedFor}</span>
                                </div>
                                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-custom-gold">
                                    {auditResult.classAssignment}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Engineering Notes - Collapsible */}
                    <div className="mb-10 border-t border-b border-white/5 py-8 group">
                        <div
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => setNotesExpanded(!notesExpanded)}
                        >
                            <h3 className="text-xs font-mono text-custom-gold uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-custom-gold rounded-full shadow-[0_0_5px_gold]"></span>
                                Engineering Notes
                            </h3>
                            <button className="text-textDim hover:text-white transition-colors">
                                {notesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <div className={`prose prose-invert max-w-none text-textDim/80 font-sans leading-relaxed text-sm md:text-base transition-all duration-500 overflow-hidden ${notesExpanded ? 'max-h-[2000px]' : 'max-h-[4.5em]'}`}>
                                <p className="whitespace-pre-wrap">{model.description || "No archival notes available."}</p>
                            </div>

                            {!notesExpanded && model.description && model.description.length > 200 && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg to-transparent pointer-events-none flex items-end justify-center">
                                </div>
                            )}
                        </div>

                        {model.description && model.description.length > 200 && (
                            <button
                                onClick={() => setNotesExpanded(!notesExpanded)}
                                className="mt-2 text-[10px] font-mono uppercase tracking-widest text-custom-gold/70 hover:text-custom-gold transition-colors border-b border-transparent hover:border-custom-gold/50 pb-0.5"
                            >
                                {notesExpanded ? 'COLLAPSE PROTOCOL' : 'READ FULL BRIEF'}
                            </button>
                        )}
                    </div>

                    {/* AI DEEP DIVE TERMINAL - REVEALED ON AUDIT */}
                    {auditResult && (
                        <div className="mb-12 animate-in slide-in-from-bottom-4 duration-700 delay-150">
                            <div className="bg-[#0a0a0a] border border-cyan/20 rounded-sm overflow-hidden font-mono text-xs">
                                <div className="bg-cyan/5 border-b border-cyan/20 p-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-cyan">
                                        <Layers className="w-3 h-3" />
                                        <span className="uppercase tracking-widest font-bold">Sonic Lab Terminal Output</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6 text-cyan/80">

                                    {/* Engineering Insights */}
                                    <div>
                                        <h4 className="text-white/40 uppercase tracking-[0.2em] mb-2 border-b border-white/5 pb-1 w-max">Engineering Analysis</h4>
                                        <p className="leading-relaxed whitespace-pre-line">
                                            {">"} {auditResult.engineeringInsights}
                                        </p>
                                    </div>

                                    {/* Frequency Data */}
                                    <div>
                                        <h4 className="text-white/40 uppercase tracking-[0.2em] mb-2 border-b border-white/5 pb-1 w-max">Frequency Response Modeling</h4>
                                        <p className="leading-relaxed whitespace-pre-line">
                                            {">"} {auditResult.frequencyAnalysis}
                                        </p>
                                    </div>

                                    {/* Full Technical Highlights */}
                                    {auditResult.technicalHighlights && (
                                        <div>
                                            <h4 className="text-white/40 uppercase tracking-[0.2em] mb-2 border-b border-white/5 pb-1 w-max">Component Detection</h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                {auditResult.technicalHighlights.map((h: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-cyan/40">[{String(i).padStart(2, '0')}]</span>
                                                        <span className="text-cyan/90">{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-cyan/10 flex justify-between items-end opacity-50">
                                        <span className="animate-pulse">_CURSOR_ACTIVE</span>
                                        <span>SESSION_ID: {model.id.toUpperCase()}_LOG</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Specifications Grid */}
                    <div className="mb-12">
                        <h3 className="text-xs font-mono text-textDim uppercase tracking-[0.2em] mb-6">Technical Specifications</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-sm">
                            {specsList.length > 0 ? specsList.map((spec, i) => (
                                <div key={i} className="bg-[#0f0f0f] p-4 flex flex-col gap-1 hover:bg-[#151515] transition-colors group/spec relative">
                                    <span className="text-[10px] font-mono text-textDim uppercase tracking-wider">{spec.key}</span>
                                    <span className="text-sm font-medium text-white/90">{spec.value}</span>

                                    <button
                                        onClick={() => copyToClipboard(spec.value, spec.key)}
                                        className="absolute top-2 right-2 opacity-0 group-hover/spec:opacity-100 transition-opacity text-textDim hover:text-white"
                                        title="Copy Data"
                                    >
                                        {copiedSpec === spec.key ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                </div>
                            )) : (
                                <div className="bg-[#0f0f0f] p-8 col-span-2 text-center text-textDim italic font-mono text-xs">
                                    DATA UNAVAILABLE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Frequency Analysis Block (If available) */}
                    {model.technical_intel && (
                        <div className="mb-12 relative bg-[#080808] border border-white/10 p-6 md:p-8 overflow-hidden rounded-sm">
                            {/* Grid Background */}
                            <div className="absolute inset-0 z-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}
                            ></div>

                            <div className="relative z-10">
                                <h3 className="text-xs font-mono text-custom-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Activity className="w-3 h-3" /> Frequency Response Intel
                                </h3>
                                <div className="space-y-4 font-mono text-xs md:text-sm text-textDim">
                                    {model.technical_intel.graph_descriptions.map((desc, i) => (
                                        <div key={i} className="flex gap-4 items-start pl-2 border-l border-white/10">
                                            <span className="text-custom-gold/30">0{i + 1}</span>
                                            <p className="leading-relaxed">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-dashed border-white/10 flex items-center gap-4">
                                    <span className="text-[10px] font-mono text-custom-gold uppercase tracking-widest bg-custom-gold/5 px-2 py-1 rounded">
                                        Analysis: {model.technical_intel.visual_analysis}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-textDim uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Database Connection Active
                        </div>

                        <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(model.brandId + ' ' + model.name + ' audio specifications graphs schematics site:audio-database.com pop-up')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs font-mono text-custom-gold hover:underline underline-offset-4 decoration-custom-gold/30"
                        >
                            External Reference Scan <SearchIcon className="w-3 h-3" />
                        </a>
                    </div>

                </div>
            </div>

            {/* AI Settings Modal */}
            {
                showAiSettings && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-[#0f0f0f] border border-cyan/30 p-8 rounded-sm max-w-md w-full shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">AI Lab Config</h3>
                                    <p className="text-[10px] font-mono text-textDim uppercase tracking-widest">Audit Engine Settings</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-mono text-textDim uppercase tracking-[0.2em] mb-2 font-bold">Provider</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['SIMULATED', 'GEMINI', 'OPENAI'] as const).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setAiProvider(p)}
                                                className={`px-3 py-2 text-[10px] font-mono border transition-all ${aiProvider === p
                                                    ? 'bg-cyan/10 border-cyan text-cyan'
                                                    : 'bg-white/5 border-white/10 text-textDim hover:border-white/30'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {aiProvider !== 'SIMULATED' && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <label className="block text-[10px] font-mono text-textDim uppercase tracking-[0.2em] mb-2 font-bold flex items-center gap-2">
                                            <Key className="w-3 h-3" /> API Key
                                        </label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="Enter your key..."
                                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-mono text-white focus:border-cyan outline-none transition-colors"
                                        />
                                        <p className="mt-2 text-[9px] text-textDim leading-relaxed">
                                            Your key is only stored in local state and never sent anywhere except the official AI endpoints.
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowAiSettings(false)}
                                    className="w-full py-4 bg-cyan hover:bg-white text-bg font-mono font-black text-xs uppercase tracking-[0.3em] transition-all rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                >
                                    Apply Changes
                                </button>
                            </div>

                            <button
                                onClick={() => setShowAiSettings(false)}
                                className="absolute top-4 right-4 p-2 text-textDim hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Compare Options Modal */}
            {
                showCompareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-[#0f0f0f] border border-custom-gold/30 p-8 rounded-sm max-w-md w-full shadow-[0_0_30px_rgba(255,215,0,0.1)] relative">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-custom-gold/10 text-custom-gold mb-4 border border-custom-gold/20">
                                    <Check className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-white mb-2">UNIT SECURED ON BENCH</h3>
                                <p className="text-textDim font-mono text-xs">
                                    Capacity: <span className="text-custom-gold">{selectedModels.length}</span> / 4 Units
                                </p>
                            </div>

                            {selectedModels.length < 2 ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-center mb-4">
                                        <p className="text-textDim text-xs font-mono">
                                            Comparison Matrix requires at least 2 units.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/archive')}
                                        className="w-full px-4 py-3 bg-custom-gold hover:bg-white text-[#050505] transition-all font-mono text-xs uppercase tracking-wider font-bold rounded-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                                    >
                                        <SearchIcon className="w-4 h-4" />
                                        Select Contender
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate('/archive')}
                                        className="px-4 py-3 bg-[#1a1a1a] border border-white/10 hover:border-white/30 text-textDim hover:text-white transition-all font-mono text-xs uppercase tracking-wider rounded-sm flex flex-col items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add More
                                    </button>
                                    <button
                                        onClick={() => navigate('/compare')}
                                        className="px-4 py-3 bg-custom-gold hover:bg-white text-[#050505] transition-all font-mono text-xs uppercase tracking-wider font-bold rounded-sm flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                        Compare Now
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => setShowCompareModal(false)}
                                className="absolute top-2 right-2 p-2 text-textDim hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ProductDetail;
