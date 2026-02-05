import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Activity, Waves, Settings2, ChevronDown, Database, Tag, ShieldCheck, Scale, Ear, BarChart3, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchGeminiAnalysis, fetchOpenAIAnalysis, type AnalysisResult } from '../services/serioAI';
import { Typewriter } from '../components/ui/Typewriter';
import { FrequencyCurve } from '../components/ui/FrequencyCurve';
import { SonicSignalSync } from '../components/ui/SonicSignalSync';
import { useComparison } from '../context/ComparisonContext';

interface SearchModel {
    id: string;
    name: string;
    brandId: string;
    category: string;
    sub_category?: string;
    score?: number;
    class?: string;
    tags?: string[];
}

interface ModelDetail {
    id: string;
    name: string;
    brandId: string;
    specifications?: string;
    engineering_notes?: string;
    description?: string;
    technical_intel?: {
        graph_descriptions: string[];
        visual_analysis: string;
    };
    // Added for type safety
    category: string;
    sub_category?: string;
    tags?: string[];
}

// Data extraction helpers
const extractSpecValue = (text: string): number => {
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
};

const getBestSpecIndex = (specs: (string | undefined)[], type: 'HIGH' | 'LOW' = 'HIGH'): number => {
    let bestIdx = -1;
    let bestVal = type === 'HIGH' ? -Infinity : Infinity;

    specs.forEach((spec, idx) => {
        if (!spec) return;
        const val = extractSpecValue(spec);
        if (val === 0) return;

        if (type === 'HIGH') {
            if (val > bestVal) { bestVal = val; bestIdx = idx; }
        } else {
            if (val < bestVal) { bestVal = val; bestIdx = idx; }
        }
    });
    return bestIdx;
};

// Helper: Parse Full Specs with Assessment
const parseFullSpecs = (specStr: string | undefined): string[] => {
    if (!specStr) return ["Standard Configuration"];

    const specs = specStr.split('|').map(s => s.trim());
    const highlights: string[] = [];

    // Frequency Response
    const freq = specs.find(s => s.toLowerCase().includes('frequency') || s.toLowerCase().includes('hz'));
    if (freq) {
        let status = '';
        const lower = parseInt(freq.match(/(\d+)\s*Hz/i)?.[1] || '999');
        const upper = parseInt(freq.match(/(\d+)\s*kHz/i)?.[1] || '0');

        // Adjusted Thresholds:
        // GOOD: Deep bass (<45Hz) OR extended highs (>25kHz)
        // BAD: No deep bass (>60Hz) AND rolled off highs (<18kHz)
        if (lower <= 45 || upper >= 25) status = ':::GOOD';
        else if (lower >= 60 && upper <= 18) status = ':::BAD';

        // Safety check: Don't mark as BAD if it's just standard (e.g. 50Hz-20kHz)
        if (status === ':::BAD' && (lower < 60 || upper > 18)) status = '';

        highlights.push(`${freq}${status}`);
    }

    // Impedance
    const imp = specs.find(s => s.toLowerCase().includes('impedance') || s.includes('Ω'));
    if (imp) {
        let status = '';
        if (imp.includes('8') || imp.includes('6')) status = ':::GOOD';
        else if (imp.includes('4') || imp.includes('2')) status = ':::BAD';
        highlights.push(`${imp}${status}`);
    }

    // Sensitivity / SPL
    const sens = specs.find(s => s.toLowerCase().includes('pressure') || s.toLowerCase().includes('sensitivity') || s.includes('dB'));
    if (sens) {
        let status = '';
        const val = parseFloat(sens.match(/(\d+\.?\d*)/)?.[0] || '0');
        if (val >= 90) status = ':::GOOD';
        else if (val <= 84) status = ':::BAD';
        highlights.push(`${sens}${status}`);
    }

    // Weight
    const weight = specs.find(s => s.toLowerCase().includes('weight'));
    if (weight) {
        let status = '';
        const kg = parseFloat(weight.match(/(\d+\.?\d*)/)?.[0] || '0');
        if (kg >= 25) status = ':::GOOD';
        else if (kg <= 5) status = ':::BAD';
        highlights.push(`${weight}${status}`);
    } else {
        highlights.push("Weight: Data Unavailable:::BAD");
    }

    return highlights.length > 0 ? highlights : ["Specs Unavailable"];
};

const ComparePage = () => {
    const {
        selectedModels,
        removeModel,
        listenerPreference,
        setListenerPreference,
        diagnosticResult,
        aiProvider,
        setAiProvider,
        apiKey,
        setApiKey
    } = useComparison();
    const navigate = useNavigate();
    const [db, setDb] = useState<SearchModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult | null>>({});
    const [fullDetails, setFullDetails] = useState<Record<string, ModelDetail>>({});
    const [showAiSettings, setShowAiSettings] = useState(false);

    // Loading Message State (must be at top before any returns)
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const loadingMessages: string[] = [
        'INITIALIZING NEURAL LINK...',
        'PARSING ACOUSTIC SIGNATURES...',
        'ANALYZING FREQUENCY RESPONSE...',
        'CROSS-REFERENCING DATABASE...',
        'COMPUTING SONIC PROFILES...',
        'FINALIZING ASSESSMENT...'
    ];

    // Accordion State
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'verdict': true,
        'telemetry': true,
        'specs': true
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Internal Component: Collapsible Section
    const CollapsibleSection = ({
        id,
        title,
        icon: Icon,
        children,
        hasData,
        isAnalyzing
    }: {
        id: string;
        title: string;
        icon: any;
        children: React.ReactNode;
        hasData: boolean;
        isAnalyzing: boolean;
    }) => {
        const isOpen = expandedSections[id];

        // If analyzing or no data, show as "Bookmark/Separator" style (Collapsed)
        // If hasData, it becomes interactive

        return (
            <div className={`group border-b border-white/5 transition-all duration-500 ${!hasData && !isAnalyzing ? 'opacity-50 grayscale' : ''}`}>
                <div
                    onClick={() => (hasData || isAnalyzing) && toggleSection(id)}
                    className={`
                        grid grid-cols-[200px_1fr] 
                        ${(hasData || isAnalyzing) ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}
                        transition-colors
                    `}
                >
                    {/* Header Column */}
                    <div className="p-6 flex items-center justify-between border-r border-white/5">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-textDim">
                            {isAnalyzing ? <Activity className="w-3 h-3 text-cyan animate-pulse" /> : <Icon className={`w-3 h-3 ${isOpen && hasData ? 'text-custom-gold' : 'text-textDim'}`} />}
                            <span className={isOpen && hasData ? 'text-white' : ''}>{title}</span>
                        </div>
                        {hasData && (
                            <ChevronDown className={`w-3 h-3 text-textDim transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        )}
                    </div>

                    {/* Preview / Spacer Column */}
                    <div className="p-6 flex items-center">
                        {!hasData && !isAnalyzing ? (
                            <div className="h-1 w-full bg-repeating-linear-gradient-45 from-transparent via-white/5 to-transparent bg-[length:10px_10px] opacity-20" />
                        ) : !isOpen ? (
                            <span className="text-[10px] font-mono text-textDim/40 tracking-widest uppercase">
                                {isAnalyzing ? 'SCANNING DATA STREAMS...' : 'CLICK TO EXPAND ANALYSIS'}
                            </span>
                        ) : null}
                    </div>
                </div>
                {/* Content Accordion */}
                <div
                    className={`grid transition-all duration-500 ease-in-out ${isOpen && (hasData || isAnalyzing) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                    style={{ gridTemplateColumns: `200px repeat(${comparisonItems.length}, 1fr) ${comparisonItems.length < 4 ? '120px' : ''}` }}
                >
                    {/* Sidebar Spacer to align grid */}
                    <div className="border-r border-white/5 bg-black/20"></div>

                    {/* Content Grid (Spans the dynamic columns) */}
                    {children}

                    {/* Placeholder for Narrow Add-Unit Column to maintain borders */}
                    {comparisonItems.length < 4 && (
                        <div className="border-l border-white/5 bg-white/2"></div>
                    )}
                </div>
            </div>
        );
    };
    const comparisonItems: SearchModel[] = db.filter(m => selectedModels.includes(m.id));

    // Helper: Touch-Of-God Heuristic Algorithm (Normalised to 10.0 Scale)
    const generateSerioVerdict = (model: ModelDetail, pref: string | null) => {
        let baseScore = 7.5; // Base score out of 10
        const keywords: string[] = [];
        let rationale = "";

        // If details aren't fully loaded, use description or default text to avoid crash
        const text = `${model.name} ${model.specifications || ''} ${model.engineering_notes || ''} ${model.description || ''}`.toLowerCase();

        // 1. DECODE NOMENCLATURE & IDENTITY
        const isMonitor = model.name.includes("M ") || model.name.includes("-M") || (model.name.includes("M") && !model.name.includes("Mk"));
        const isNatural = model.name.includes("NS");
        const isAnalyticalMat = text.includes("beryllium") || text.includes("boron") || text.includes("titanium") || text.includes("ribbon");
        const isMusicalMat = text.includes("paper") || text.includes("pulp") || text.includes("alnico") || text.includes("soft dome");

        const inherentIdentity = (isMonitor || isAnalyticalMat) ? 'ANALYTICAL' :
            (isNatural || isMusicalMat) ? 'MUSICAL' : 'BALANCED';

        if (model.name.includes("NS")) { keywords.push("NS: Natural Sound"); if (pref === 'MUSICAL') baseScore += 1.0; }
        if (isMonitor) { keywords.push("M: Monitor Grade"); if (pref === 'ANALYTICAL') baseScore += 1.5; }
        if (model.name.includes("DS")) { keywords.push("DS: Diatone System"); if (pref === 'ANALYTICAL') baseScore += 0.5; }
        if (model.name.includes("EX")) { keywords.push("EX: Extended Range"); if (pref === 'BALANCED') baseScore += 1.0; }
        if (model.name.includes("Pro")) { keywords.push("Pro: Studio Use"); if (pref === 'ANALYTICAL') baseScore += 1.0; }

        // 2. MATERIAL ANALYSIS
        if (text.includes("beryllium")) { keywords.push("Beryllium"); if (pref === 'ANALYTICAL') baseScore += 1.5; }
        if (text.includes("titanium")) { keywords.push("Titanium"); if (pref === 'ANALYTICAL') baseScore += 1.0; }
        if (text.includes("boron")) { keywords.push("Boronized"); if (pref === 'ANALYTICAL') baseScore += 1.2; }
        if (text.includes("paper") || text.includes("pulp")) { keywords.push("Paper Cone"); if (pref === 'MUSICAL') baseScore += 1.5; }
        if (text.includes("alnico")) { keywords.push("Alnico Magnet"); if (pref === 'MUSICAL') baseScore += 1.2; }
        if (text.includes("polypropylene")) { keywords.push("Polypropylene"); if (pref === 'BALANCED') baseScore += 1.0; }
        if (text.includes("soft dome")) { keywords.push("Soft Dome"); if (pref === 'MUSICAL') baseScore += 1.0; }

        // 3. IDENTITY CLASH PENALTY (CRITICAL FIX)
        if (inherentIdentity === 'ANALYTICAL' && pref === 'MUSICAL') {
            baseScore -= 3.0; // Major penalty for fatigue risk
            rationale = "Synergy Check: CRITICAL FAILURE. Analytical monitor signature detected in Musical Protocol. High risk of listening fatigue due to material stiffness.";
        } else if (inherentIdentity === 'MUSICAL' && pref === 'ANALYTICAL') {
            baseScore -= 2.0; // Penalty for resolution blur
            rationale = "Synergy Check: FAILED. Musical/Organic signature lacks the necessary transient speed for Analytical Monitoring. Details may be obscured.";
        } else if (pref === 'ANALYTICAL' && !isAnalyticalMat && !isMonitor) {
            baseScore -= 1.0;
            rationale = "Synergy Check: WEAK. Standard materials lack the precision required for Truth-Seeker standards.";
        } else if (pref === 'MUSICAL' && !isMusicalMat && !isNatural) {
            baseScore -= 1.0;
            rationale = "Synergy Check: MARGINAL. Technical presentation may feel 'sterile' or 'dry' for Musical Protocol.";
        }

        // 4. GENERATE FINAL RATIONALE (If not set by Clash)
        if (!rationale) {
            if (pref === 'ANALYTICAL') {
                rationale = "Synergy Check: OPTIMAL. Perfect Protocol Alignment. High-resolution materials ensure absolute signal transparency.";
            } else if (pref === 'MUSICAL') {
                rationale = "Synergy Check: OPTIMAL. Harmonic richness detected. Organic materials align perfectly with fatigue-free listening protocols.";
            } else {
                rationale = "Synergy Check: STABLE. Balanced presentation across the frequency spectrum.";
            }
        }

        const finalScore = Math.min(Math.max(baseScore, 3.5), 9.9);

        return {
            match: finalScore,
            verdict: rationale,
            keywords: keywords.slice(0, 3),
            technicalHighlights: parseFullSpecs(model.specifications),
            frequencyAnalysis: `Identity: ${inherentIdentity} | Protocol: ${pref}`,
            engineeringInsights: "Robust engineering detected in the crossover and driver integration.",
            strengthsForProtocol: [
                pref === 'ANALYTICAL' ? "High resolution detail" : pref === 'MUSICAL' ? "Organic harmonics" : "Even distribution",
                "Stable acoustic phase"
            ],
            recommendedFor: pref === 'ANALYTICAL' ? "Critical monitoring" : pref === 'MUSICAL' ? "Hi-Fi listening" : "Multi-genre versatility",
            inherentIdentity,
            targetMarket: (keywords.some(k => k.includes("Monitor") || k.includes("Pro"))) ? 'PROFESSIONAL' : 'AUDIOPHILE',
            classAssignment: finalScore > 9.2 ? "Class S" : finalScore > 8.5 ? "Class A+" : finalScore > 7.5 ? "Class A" : "Class B",
            signalMatch: {
                "M": inherentIdentity === 'MUSICAL' ? 95 : (inherentIdentity === 'ANALYTICAL' ? 40 : 70),
                "A": inherentIdentity === 'ANALYTICAL' ? 95 : (inherentIdentity === 'MUSICAL' ? 40 : 70),
                "S": 85,
                "R": 80,
                "V": 75,
                "C": 70,
                "F": 95
            }
        };
    };

    // PRODUCT DATA ENRICHMENT FUNCTION
    const enrichProductData = async (productId: string, brand: string): Promise<ModelDetail | null> => {
        try {
            const response = await fetch(`/data/catalog/${brand}.json`);
            if (!response.ok) return null;

            const catalog = await response.json();
            const fullProduct = catalog.find((p: any) => p.id === productId);

            if (!fullProduct) {
                console.warn(`Product ${productId} not found in ${brand} catalog`);
                return null;
            }

            // Map description to engineering_notes if missing to ensure AI receives full text information
            return {
                ...fullProduct,
                engineering_notes: fullProduct.engineering_notes || fullProduct.description || "Data archival pending",
                specifications: fullProduct.specifications || "Specs unavailable",
                technical_intel: fullProduct.technical_intel || {}
            } as ModelDetail;
        } catch (error) {
            console.error(`Failed to enrich product ${productId}:`, error);
            return null;
        }
    };

    // Effect: Load Database
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/data/model-index.json');
                const data = await res.json();
                setDb(data);
            } catch (e) {
                console.error('Failed to load model index:', e);
                setDb([]);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Effect: Initial Heuristic Run (Auto-load)
    useEffect(() => {
        if (!loading && comparisonItems.length > 0) {
            const results: Record<string, any> = {};
            comparisonItems.forEach(item => {
                // Heuristic run uses basic info available in 'db'
                // We mock the 'ModelDetail' shape for the heuristic function
                const mockDetail = { ...item, specifications: "", engineering_notes: "", description: "" } as unknown as ModelDetail;
                results[item.id] = generateSerioVerdict(mockDetail, listenerPreference);
            });
            setAnalysisResults(results);
        }
    }, [loading, comparisonItems.length, listenerPreference]);

    const parseSpecsToMap = (specStr: string | undefined): Record<string, string> => {
        if (!specStr) return {};
        const map: Record<string, string> = {};
        specStr.split('|').forEach(s => {
            const parts = s.split(':');
            if (parts.length >= 2) {
                let value = parts.slice(1).join(':').trim();
                // Sanitize common encoding artifacts for Ohm symbols and high-order characters
                value = value.replace(/\uFFFD/g, 'Ω').replace(/\u00A0/g, ' ').replace(/\u00BD/g, '1/2');
                map[parts[0].trim()] = value;
            }
        });
        return map;
    };

    // Effect: Pre-fetch Enriched Data for all selected models
    useEffect(() => {
        const fetchAllDetails = async () => {
            const newDetails: Record<string, ModelDetail> = { ...fullDetails };
            let changed = false;

            for (const item of comparisonItems) {
                if (!newDetails[item.id]) {
                    const detail = await enrichProductData(item.id, item.brandId);
                    if (detail) {
                        newDetails[item.id] = detail;
                        changed = true;
                    }
                }
            }

            if (changed) {
                setFullDetails(newDetails);
            }
        };

        if (comparisonItems.length > 0) {
            fetchAllDetails();
        }
    }, [comparisonItems]);

    // Effect: Cycle through loading messages during analysis
    useEffect(() => {
        if (analyzing) {
            const interval = setInterval(() => {
                setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [analyzing, loadingMessages.length]);

    const runAiAnalysis = async () => {
        if (!apiKey && aiProvider !== 'SIMULATED') {
            alert('No API key configured. Deep Scan requires real AI.');
            return;
        }

        setAnalyzing(true);
        setLoadingMessageIndex(0);

        try {
            // STEP 1: ENRICH ALL PRODUCTS WITH COMPLETE DATA
            const enrichedProducts = await Promise.all(
                comparisonItems.map(item => enrichProductData(item.id, item.brandId))
            );

            // Filter out failed enrichments
            const validProducts = enrichedProducts.filter((p): p is ModelDetail => p !== null);

            if (validProducts.length === 0) {
                // If enrichment fails, fallback to basic data from context
                const fallbackData = comparisonItems.map(item => ({
                    ...item,
                    engineering_notes: "Deep enrichment failed. Basic archival data used.",
                    specifications: ""
                } as unknown as ModelDetail));

                const results = aiProvider === 'OPENAI'
                    ? await fetchOpenAIAnalysis(apiKey, fallbackData, listenerPreference || 'BALANCED', diagnosticResult)
                    : await fetchGeminiAnalysis(apiKey, fallbackData, listenerPreference || 'BALANCED', diagnosticResult);
                setAnalysisResults(results);
            } else {
                // STEP 2: SEND ENRICHED DATA TO AI
                const results = aiProvider === 'OPENAI'
                    ? await fetchOpenAIAnalysis(apiKey, validProducts, listenerPreference || 'BALANCED', diagnosticResult)
                    : await fetchGeminiAnalysis(apiKey, validProducts, listenerPreference || 'BALANCED', diagnosticResult);

                setAnalysisResults(results);
            }
        } catch (error) {
            console.error('Deep Scan failed:', error);
            // Simulate fallback if API error
            const deepDiveResults: Record<string, any> = {};
            comparisonItems.forEach(item => {
                const mockDetail = { ...item, specifications: "", engineering_notes: "", description: "" } as unknown as ModelDetail;
                deepDiveResults[item.id] = generateSerioVerdict(mockDetail, listenerPreference);
            });
            setAnalysisResults(deepDiveResults);
        } finally {
            setAnalyzing(false);
        }
    };

    // ============================================================================
    // RENDER LOGIC
    // ============================================================================

    // LOADING STATE
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-t-custom-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="font-mono text-custom-gold animate-pulse tracking-widest">CALIBRATING COMPARATOR...</div>
            </div>
        );
    }

    // PREFERENCE SELECTOR OVERLAY (MUST come before empty check!)
    if (!listenerPreference) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 p-8 bg-gradient-to-b from-bg/50 to-bg">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-mono text-custom-gold uppercase tracking-[0.3em] mb-4">Initialize Protocol</h2>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Select Your Listening Priority</h1>
                        <p className="text-textDim font-mono text-sm max-w-xl mx-auto border-t border-b border-white/5 py-4">
                            The System will adjust the comparison matrix to highlight metrics relevant to your psychoacoustic profile.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                        <button
                            onClick={() => {
                                setListenerPreference('MUSICAL');
                            }}
                            className="group p-8 bg-[#0a0a0a] border border-white/10 hover:border-custom-gold/50 hover:bg-[#111] transition-all duration-300 rounded-sm text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Ear className="w-24 h-24 text-custom-gold" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-custom-gold font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-custom-gold shadow-[0_0_10px_gold]"></span>
                                    The Naturalist
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Musical</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-6">
                                    Prioritizes flow, tone, and anti-tension. Highlights decay and warmth indicators.
                                </p>
                                <span className="text-xs font-mono text-custom-gold/70 group-hover:text-custom-gold flex items-center gap-2">
                                    SELECT PROFILE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                setListenerPreference('ANALYTICAL');
                            }}
                            className="group p-8 bg-[#0a0a0a] border border-white/10 hover:border-cyan/50 hover:bg-[#111] transition-all duration-300 rounded-sm text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Activity className="w-24 h-24 text-cyan" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-cyan font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_cyan]"></span>
                                    The Truth-Seeker
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Analytical</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-6">
                                    Prioritizes detail, separation, and speed. Highlights distortion specs and transient response.
                                </p>
                                <span className="text-xs font-mono text-cyan/70 group-hover:text-cyan flex items-center gap-2">
                                    SELECT PROFILE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                setListenerPreference('BALANCED');
                            }}
                            className="group p-8 bg-[#0a0a0a] border border-white/10 hover:border-green-500/50 hover:bg-[#111] transition-all duration-300 rounded-sm text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Scale className="w-24 h-24 text-green-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-green-500 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_lime]"></span>
                                    The Stabilizer
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Balanced</h3>
                                <p className="text-textDim text-sm leading-relaxed mb-6">
                                    Prioritizes stability and context. Highlights versatility and long-term correctness.
                                </p>
                                <span className="text-xs font-mono text-green-500/70 group-hover:text-green-500 flex items-center gap-2">
                                    SELECT PROFILE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-bg px-4 text-textDim/50 font-mono tracking-widest">OR</span>
                        </div>
                    </div>

                    {/* Automated Evaluation Button */}
                    <div className="px-4">
                        <button
                            onClick={() => navigate('/assessment')}
                            className="group w-full p-6 bg-gradient-to-r from-purple/5 to-cyan/5 border border-purple/20 hover:border-purple/50 hover:from-purple/10 hover:to-cyan/10 transition-all duration-300 rounded-sm text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple/0 via-purple/10 to-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10">
                                <div className="text-purple font-mono text-xs uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                                    <Activity className="w-4 h-4 animate-pulse" />
                                    Automated Diagnostic
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Run Listening Evaluation</h3>
                                <p className="text-textDim text-sm leading-relaxed max-w-2xl mx-auto mb-4">
                                    Initialize diagnostic sequence to determine your optimal listening profile.
                                    This behavioral analysis matches your psychoacoustic preferences with historical hardware classes.
                                </p>
                                <span className="text-xs font-mono text-purple/70 group-hover:text-purple flex items-center justify-center gap-2">
                                    BEGIN ANALYSIS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // EMPTY STATE (after preference is set)
    if (selectedModels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-700">
                <div className="relative group">
                    <div className="absolute inset-0 bg-custom-gold/20 blur-xl rounded-full group-hover:bg-custom-gold/30 transition-all duration-1000"></div>
                    <div className="relative p-8 bg-surfaceHighlight/50 backdrop-blur-md rounded-full border border-custom-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                        <BarChart3 className="w-16 h-16 text-custom-gold" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-3 text-shadow-lg">BENCH IS EMPTY</h1>
                    <p className="text-textDim max-w-md mx-auto font-mono text-sm leading-relaxed border-l-2 border-custom-gold/20 pl-4 py-1 text-left">
                        Select up to 4 units from the Archive to initiate side-by-side harmonic analysis.
                    </p>
                </div>
                <Link
                    to="/archive"
                    className="group flex items-center gap-3 px-8 py-3 bg-[#111] border border-custom-gold/30 hover:border-custom-gold hover:bg-custom-gold/10 text-custom-gold font-mono text-sm rounded-sm transition-all shadow-lg"
                >
                    RETURN TO ARCHIVE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }



    // Global Expand/Collapse
    const expandAll = () => {
        const allKeys = ['verdict', 'specs', 'engineering', 'freq', 'highlights', 'signals'];
        const newState = allKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setExpandedSections(newState);
    };

    const collapseAll = () => {
        setExpandedSections({});
    };

    const getPreferenceColor = (pref: string | null) => {
        if (pref === 'ANALYTICAL') return 'text-cyan border-cyan/30';
        if (pref === 'BALANCED') return 'text-green-500 border-green-500/30';
        return 'text-custom-gold border-custom-gold/30';
    };

    const getPreferenceLabel = (pref: string | null) => {
        if (pref === 'ANALYTICAL') return 'TRUTH-SEEKER MODE';
        if (pref === 'BALANCED') return 'STABILIZER MODE';
        return 'NATURALIST MODE';
    };

    return (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden pb-20">
            {/* LAB BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.05),transparent_70%)]"></div>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,215,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.05) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                ></div>
            </div>

            <div className="container mx-auto px-4 pt-12 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-8 mb-8 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-3 bg-gradient-to-br from-custom-gold/20 to-black border border-custom-gold/40 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                                <div className="w-10 h-10 border-2 border-custom-gold/60 rounded-full flex items-center justify-center relative overflow-hidden">
                                    <Waves className="w-6 h-6 text-custom-gold animate-pulse" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-custom-gold/20 to-transparent"></div>
                                </div>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505] animate-pulse"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white tracking-tight leading-none uppercase">
                                THE <span className="text-custom-gold">SONIC LAB</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2 font-mono text-[10px] tracking-[0.2em] text-custom-gold">
                                <span className="opacity-60 uppercase font-bold tracking-[0.1em]">REFERENCE • TOOL • GUIDE</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={expandAll}
                                className="px-3 py-1.5 text-[10px] font-mono text-textDim border border-white/5 hover:bg-white/5 hover:text-white transition-all rounded-sm uppercase tracking-wider"
                            >
                                Expand All
                            </button>
                            <button
                                onClick={collapseAll}
                                className="px-3 py-1.5 text-[10px] font-mono text-textDim border border-white/5 hover:bg-white/5 hover:text-white transition-all rounded-sm uppercase tracking-wider"
                            >
                                Collapse
                            </button>
                        </div>

                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={runAiAnalysis}
                                disabled={analyzing}
                                className="bg-custom-gold text-black border border-custom-gold px-6 py-2.5 rounded-sm text-[10px] font-bold font-mono tracking-[0.2em] flex items-center gap-2 transition-all hover:bg-white hover:border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 uppercase disabled:cursor-wait"
                            >
                                {analyzing ? (
                                    <>
                                        <Activity className="w-4 h-4 animate-spin" />
                                        Scanning...
                                    </>
                                ) : (
                                    <>
                                        <BrainCircuit className="w-4 h-4" />
                                        Initiate Deep Scan
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 border rounded-sm bg-black/40 flex flex-col gap-0.5 min-w-[120px] border-white/10 ${getPreferenceColor(listenerPreference)}`}>
                                <span className="text-[8px] font-mono tracking-[0.3em] opacity-50 uppercase">Active Protocol</span>
                                <span className="text-[10px] font-bold font-mono tracking-widest truncate">{getPreferenceLabel(listenerPreference)}</span>
                            </div>
                            <button
                                onClick={() => setListenerPreference(null)}
                                className="p-2 text-textDim hover:text-custom-gold hover:bg-custom-gold/10 border border-transparent hover:border-custom-gold/20 rounded transition-all"
                                title="Recalibrate Protocol"
                            >
                                <Waves className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowAiSettings(!showAiSettings)}
                                className={`p-2 transition-all rounded ${showAiSettings ? 'text-custom-gold bg-custom-gold/10 border-custom-gold/20' : 'text-textDim hover:text-custom-gold hover:bg-custom-gold/10 border-transparent'} border`}
                                title="AI Configuration"
                            >
                                <BrainCircuit className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI SETTINGS PANEL */}
                {showAiSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mb-8 p-6 bg-black/40 border border-custom-gold/20 rounded-sm overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-custom-gold uppercase tracking-[0.2em] block">AI Intelligence Core</label>
                                <div className="flex gap-2">
                                    {['SIMULATED', 'GEMINI', 'OPENAI'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setAiProvider(p as any)}
                                            className={`px-4 py-2 text-[10px] font-mono border transition-all ${aiProvider === p ? 'bg-custom-gold/20 border-custom-gold text-custom-gold' : 'border-white/10 text-textDim hover:border-white/20'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-custom-gold uppercase tracking-[0.2em] block">Neural Link Key (API KEY)</label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter encrypted key..."
                                    className="w-full bg-black/60 border border-white/10 px-4 py-2 text-xs font-mono text-cyan placeholder:opacity-20 focus:border-custom-gold/50 outline-none transition-all"
                                />
                                <p className="text-[8px] font-mono text-textDim/50 uppercase tracking-tighter">Keys are persisted locally per Lab Protocol</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Inline Progress Bar for Analysis */}
                {analyzing && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between text-[10px] font-mono text-cyan uppercase tracking-widest mb-2">
                            <span>{loadingMessages[loadingMessageIndex]}</span>
                            <span className="animate-pulse">PROCESSING...</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan w-full animate-progress origin-left"></div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-custom-gold/20 scrollbar-track-transparent">
                    <div className="min-w-[800px] border border-white/10 rounded-sm bg-[#080808]/90 backdrop-blur-md shadow-2xl relative overflow-hidden">

                        {/* Decorative Screws */}
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#333] shadow-[inset_0_1px_1px_black z-20]" />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#333] shadow-[inset_0_1px_1px_black z-20]" />
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#333] shadow-[inset_0_1px_1px_black z-20]" />
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#333] shadow-[inset_0_1px_1px_black z-20]" />

                        {/* Header Row - STICKY */}
                        <div
                            className="grid border-b border-white/20 bg-[#080808]/95 backdrop-blur-xl sticky top-0 z-40 shadow-2xl"
                            style={{ gridTemplateColumns: `200px repeat(${comparisonItems.length}, 1fr) ${comparisonItems.length < 4 ? '120px' : ''}` }}
                        >
                            <div className="p-8 flex flex-col justify-end border-r border-white/10 bg-black/40">
                                <div className="text-[10px] font-mono text-custom-gold/40 tracking-[0.3em] uppercase mb-1 text-right">TELEMETRY</div>
                                <span className="text-xs font-mono font-bold text-white tracking-widest border-b border-custom-gold/30 pb-1 w-fit ml-auto">PARAMETERS</span>
                            </div>

                            {comparisonItems.map(item => (
                                <div key={item.id} className="p-6 border-l border-white/10 relative group transition-all duration-300 hover:bg-white/[0.02]">
                                    {/* Module Decorative Elements */}
                                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-custom-gold/0 to-transparent group-hover:via-custom-gold/40 transition-all duration-500"></div>
                                    <div className="absolute -left-[1px] top-4 bottom-4 w-[1px] bg-white/5"></div>

                                    <button
                                        onClick={() => removeModel(item.id)}
                                        className="absolute top-3 right-3 p-1.5 text-textDim/20 hover:text-red-500 hover:bg-red-500/10 rounded-sm border border-transparent hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                                        title="Eject Module"
                                    >
                                        <Zap className="w-3 h-3" />
                                    </button>

                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_6px_#22d3ee]"></div>
                                                <span className="text-[9px] font-mono text-cyan uppercase tracking-widest font-bold">Standard Configuration</span>
                                            </div>
                                            <div className="text-[9px] font-mono text-custom-gold/60 py-0.5 px-2 bg-custom-gold/5 border border-custom-gold/20 rounded-sm tracking-tighter uppercase whitespace-nowrap">
                                                {item.brandId}
                                            </div>
                                        </div>

                                        <Link to={`/product/${item.id}`} className="block group/title">
                                            <h3 className="font-display font-bold text-xl leading-tight text-white group-hover/title:text-custom-gold transition-colors truncate">
                                                {item.name}
                                            </h3>

                                            {/* Identity & Market Badges */}
                                            {analysisResults[item.id] && (
                                                <div className="flex flex-wrap gap-1 mt-1.5 min-h-[16px]">
                                                    {analysisResults[item.id]?.inherentIdentity && (
                                                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm border leading-none ${analysisResults[item.id]?.inherentIdentity === 'ANALYTICAL'
                                                            ? 'bg-cyan/10 border-cyan/30 text-cyan'
                                                            : analysisResults[item.id]?.inherentIdentity === 'MUSICAL'
                                                                ? 'bg-custom-gold/10 border-custom-gold/30 text-custom-gold'
                                                                : 'bg-white/5 border-white/10 text-white/40'
                                                            }`}>
                                                            {analysisResults[item.id]?.inherentIdentity}
                                                        </span>
                                                    )}
                                                    {analysisResults[item.id]?.targetMarket && (
                                                        <span className="text-[8px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-sm text-textDim italic leading-none">
                                                            {analysisResults[item.id]?.targetMarket}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="text-[9px] font-mono text-textDim/40 tracking-widest uppercase">
                                                    ID: {item.id.split('-').pop()?.toUpperCase()}
                                                </div>
                                                {analysisResults[item.id] && analysisResults[item.id]?.match !== undefined && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-[3px] h-[3px] rounded-full bg-white/20"></div>
                                                        <div className="text-[9px] font-mono text-cyan/70 font-bold italic uppercase">
                                                            LB_GRADE: {((analysisResults[item.id]?.match || 0) <= 10 ? (analysisResults[item.id]?.match || 0) : (analysisResults[item.id]?.match || 0) / 10).toFixed(1)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {/* ADD MORE UNITS BUTTON - Module Style */}
                            {comparisonItems.length < 4 && (
                                <div
                                    className="border-l border-white/10 flex flex-col items-center justify-center bg-white/[0.03] hover:bg-white/[0.07] transition-all group cursor-pointer relative"
                                    onClick={() => navigate('/archive')}
                                >
                                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.02)_5px,rgba(255,255,255,0.02)_10px)]"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-10 h-10 rounded border border-dashed border-white/20 flex items-center justify-center mb-4 group-hover:border-custom-gold group-hover:bg-custom-gold/5 transition-all">
                                            <div className="text-white/20 group-hover:text-custom-gold text-2xl font-light font-mono">+</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-mono text-textDim/40 uppercase tracking-[0.4em] transform rotate-90 origin-center whitespace-nowrap group-hover:text-white transition-colors">Integrate</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Matrix Rows */}
                        <div className="divide-y divide-white/5 bg-brushed-metal">

                            {/* SONIC LAB AI VERDICT ROW - Collapsible */}
                            <CollapsibleSection
                                id="verdict"
                                title="Sonic Lab Grading"
                                icon={BrainCircuit}
                                hasData={Object.keys(analysisResults).length > 0}
                                isAnalyzing={analyzing}
                            >
                                {comparisonItems.map(item => {
                                    const result = analysisResults[item.id];
                                    return (
                                        <div key={item.id} className="p-6 border-l border-white/5 font-mono relative overflow-hidden group min-h-[200px]">
                                            {result ? (
                                                <div className="relative p-4 border border-cyan/20 bg-cyan/5 rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all h-full flex flex-col">
                                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan/50"></div>
                                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan/50"></div>
                                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan/50"></div>
                                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan/50"></div>

                                                    <div className="flex items-center gap-2 justify-between border-b border-cyan/20 pb-2 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-mono text-cyan/50 uppercase tracking-[0.2em] leading-none mb-1">Sonic Lab Scale</span>
                                                                <span className="text-3xl font-display font-black text-white text-shadow-glow leading-none">
                                                                    {((result.match || 0) <= 10 ? (result.match) : result.match / 10).toFixed(1)}
                                                                </span>
                                                            </div>
                                                            <div className="h-8 w-px bg-cyan/20 mx-1"></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-mono text-cyan/50 uppercase tracking-widest mb-1">Status</span>
                                                                <span className="text-[10px] font-mono font-bold text-cyan uppercase tracking-wider">
                                                                    {result.classAssignment || (result.match > 9 ? 'LEGEND' : result.match > 8 ? 'PROTOCOL_S' : 'RELIABLE')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <FrequencyCurve tags={result.keywords} preference={listenerPreference} />
                                                    </div>

                                                    {/* Mini Grade Points */}
                                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                                        {[
                                                            { label: 'MUS', val: result.labGrades?.musical?.score || (result.signalMatch?.M ? result.signalMatch.M / 10 : 0), color: 'text-custom-gold' },
                                                            { label: 'ANA', val: result.labGrades?.analytical?.score || (result.signalMatch?.A ? result.signalMatch.A / 10 : 0), color: 'text-cyan' },
                                                            { label: 'BAL', val: result.labGrades?.balanced?.score || (result.signalMatch?.S ? result.signalMatch.S / 10 : 0), color: 'text-green-500' }
                                                        ].map(g => (
                                                            <div key={g.label} className="bg-white/5 border border-white/5 p-1.5 rounded-sm flex flex-col items-center">
                                                                <span className="text-[7px] font-mono text-textDim uppercase tracking-tighter mb-0.5">{g.label}</span>
                                                                <span className={`text-xs font-mono font-bold ${g.color}`}>{(g.val || 0).toFixed(1)}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="text-[11px] leading-relaxed text-cyan/90 flex-1">
                                                        <Typewriter text={result.verdict} speed={15} />
                                                    </div>

                                                    {/* Mismatch Risk Alert */}
                                                    {result.inherentIdentity && result.inherentIdentity !== listenerPreference && (
                                                        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded-sm">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Zap className="w-3 h-3 text-red-500 animate-pulse" />
                                                                <span className="text-[8px] font-mono text-red-500 uppercase tracking-widest font-bold">BEHAVIORAL MISMATCH DETECTED</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(result.inherentIdentity === 'ANALYTICAL' && listenerPreference === 'MUSICAL') ? (
                                                                    ['FATIGUE_RISK', 'DRY_PRESENTATION', 'UPGRADE_URGE'].map(t => (
                                                                        <span key={t} className="text-[7px] font-mono bg-red-500/20 text-red-400 px-1 py-0.5 rounded-none">{t}</span>
                                                                    ))
                                                                ) : (
                                                                    ['RESOLUTION_BLUR', 'DETAIL_MASKING', 'BOREDOM'].map(t => (
                                                                        <span key={t} className="text-[7px] font-mono bg-red-500/20 text-red-400 px-1 py-0.5 rounded-none">{t}</span>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-cyan/50 italic text-xs animate-pulse">
                                                    <BrainCircuit className="w-3 h-3" /> Awaiting Signal...
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </CollapsibleSection>

                            {/* HARDWARE TELEMETRY ROW (Raw Specs) - Collapsible */}
                            <CollapsibleSection
                                id="telemetry"
                                title="Hardware Telemetry"
                                icon={Settings2}
                                hasData={Object.keys(fullDetails).length > 0}
                                isAnalyzing={false}
                            >
                                {comparisonItems.map(item => {
                                    const detail = fullDetails[item.id];
                                    const specsMap = parseSpecsToMap(detail?.specifications);

                                    return (
                                        <div key={item.id} className="p-6 border-l border-white/5 bg-black/10">
                                            {Object.keys(specsMap).length > 0 ? (
                                                <div className="space-y-4">
                                                    {Object.entries(specsMap).map(([key, value]) => (
                                                        <div key={key} className="border-b border-white/5 pb-2 last:border-0 group/spec">
                                                            <div className="text-[9px] font-mono text-textDim/40 uppercase tracking-widest mb-1 group-hover/spec:text-custom-gold/60 transition-colors">{key}</div>
                                                            <div className="text-xs font-display font-medium text-white group-hover/spec:text-custom-gold transition-colors">{value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-textDim/30 italic text-[10px] animate-pulse">
                                                    <Database className="w-3 h-3" /> INITIALIZING TELEMETRY...
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </CollapsibleSection>

                            {/* Technical Highlights - Collapsible */}
                            <CollapsibleSection
                                id="specs"
                                title="Technical Highlights"
                                icon={Activity}
                                hasData={Object.keys(analysisResults).length > 0}
                                isAnalyzing={analyzing}
                            >
                                {comparisonItems.map((item, colIndex) => {
                                    const result = analysisResults[item.id];
                                    return (
                                        <div key={item.id} className="p-6 border-l border-white/5 relative">
                                            {result?.technicalHighlights ? (
                                                <ul className="space-y-4">
                                                    {result.technicalHighlights.map((h, i) => {
                                                        const [rawText, marker] = h.split(':::');
                                                        // Split label and value (e.g. "Nominal impedance: 6")
                                                        const parts = rawText.split(':');
                                                        const label = parts[0]?.trim();
                                                        let value = parts.slice(1).join(':').trim();

                                                        // Fix encoding/display issues for Impedance
                                                        if (label.toLowerCase().includes('impedance')) {
                                                            // Replace diamond question mark or other artifacts
                                                            value = value.replace(/\uFFFD/g, 'Ω').replace(/\?/g, 'Ω');
                                                            if (!value.includes('Ω') && !value.toLowerCase().includes('ohm')) {
                                                                value += 'Ω';
                                                            }
                                                        }

                                                        let status = marker as 'GOOD' | 'BAD' | undefined;

                                                        // *** SANITY CHECK OVERRIDE ***
                                                        // Ensure valid Hz/kHz ranges are never marked BAD by AI hallucination
                                                        if (label?.toLowerCase().includes('frequency') && status === 'BAD') {
                                                            const low = parseInt(value.match(/(\d+)\s*Hz/i)?.[1] || '999');
                                                            const high = parseInt(value.match(/(\d+)\s*kHz/i)?.[1] || '0');
                                                            // If specs are decent (Bass < 55Hz OR Treble > 22kHz), FORCE UN-BAD
                                                            if (low < 55 || high > 22) {
                                                                status = undefined;
                                                            }
                                                        }
                                                        // Ensure good specs are marked GOOD if AI missed them
                                                        if (label?.toLowerCase().includes('frequency') && !status) {
                                                            const low = parseInt(value.match(/(\d+)\s*Hz/i)?.[1] || '999');
                                                            const high = parseInt(value.match(/(\d+)\s*kHz/i)?.[1] || '0');
                                                            if (low <= 45 || high >= 25) status = 'GOOD';
                                                        }

                                                        const allVals = comparisonItems.map(c => analysisResults[c.id]?.technicalHighlights?.[i]?.split(':::')[0]);
                                                        const bestIdx = getBestSpecIndex(allVals, label.toLowerCase().includes('hz') ? 'LOW' : 'HIGH');
                                                        const isWinner = bestIdx === colIndex && comparisonItems.length > 1;

                                                        // Override status if winner
                                                        const finalStatus = isWinner ? 'GOOD' : status;

                                                        return (
                                                            <li key={i} className={`mb-4 last:mb-0 transition-all ${isWinner ? 'scale-[1.02] origin-left' : ''}`}>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-[10px] text-textDim uppercase tracking-widest font-mono">
                                                                        {label}
                                                                    </span>
                                                                    {isWinner && <span className="text-[8px] font-mono text-custom-gold border border-custom-gold/30 px-1 rounded bg-custom-gold/5 whitespace-nowrap">LEADER</span>}
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]
                                                                        ${finalStatus === 'GOOD' ? 'bg-custom-gold animate-pulse' :
                                                                            finalStatus === 'BAD' ? 'bg-red-500' : 'bg-cyan/50'}`}>
                                                                    </span>
                                                                    <span className={`font-display font-medium text-sm ${finalStatus === 'GOOD' ? 'text-custom-gold text-shadow-glow' :
                                                                        finalStatus === 'BAD' ? 'text-textDim opacity-70' : 'text-white'
                                                                        }`}>
                                                                        {value || label /* Fallback if no value */}
                                                                    </span>
                                                                </div>

                                                                {finalStatus === 'BAD' && !isWinner && (
                                                                    <div className="mt-1 ml-3.5 text-[9px] text-[#ff4444] font-mono tracking-tight flex items-center gap-1">
                                                                        <ArrowRight className="w-2 h-2" /> LIMITATION DETECTED
                                                                    </div>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <span className="text-textDim/30 text-xs italic">Awaiting Deep Dive...</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </CollapsibleSection>

                            {/* Frequency Intel Row (Deep Dive) - Collapsible */}
                            <CollapsibleSection
                                id="frequency"
                                title="Frequency Intel"
                                icon={Waves}
                                hasData={Object.keys(analysisResults).length > 0}
                                isAnalyzing={analyzing}
                            >
                                {comparisonItems.map(item => {
                                    const result = analysisResults[item.id];
                                    return (
                                        <div key={item.id} className="p-6 border-l border-white/5">
                                            {result?.frequencyAnalysis ? (
                                                <p className="text-xs text-textDim leading-relaxed">
                                                    {result.frequencyAnalysis}
                                                </p>
                                            ) : (
                                                <span className="text-textDim/30 text-xs italic">-</span>
                                            )}
                                        </div>
                                    );
                                })}


                            </CollapsibleSection>

                            {/* Engineering Analysis Row (Deep Dive) - Collapsible */}
                            <CollapsibleSection
                                id="engineering"
                                title="Engineering Analysis"
                                icon={Settings2}
                                hasData={Object.keys(analysisResults).length > 0}
                                isAnalyzing={analyzing}
                            >
                                {comparisonItems.map(item => {
                                    const result = analysisResults[item.id];
                                    return (
                                        <div key={item.id} className="p-6 border-l border-white/5">
                                            {result?.engineeringInsights ? (
                                                <div className="text-xs text-textDim leading-relaxed italic border-l border-cyan/30 pl-3 bg-white/5 p-2 rounded-sm">
                                                    {result.engineeringInsights}
                                                </div>
                                            ) : (
                                                <span className="text-textDim/30 text-xs italic">-</span>
                                            )}
                                        </div>
                                    );
                                })}


                            </CollapsibleSection>

                            {/* SIGNAL SYNC MAP - Collapsible */}
                            <CollapsibleSection
                                id="signal"
                                title="Signal Sync Map"
                                icon={Database}
                                hasData={Object.keys(analysisResults).length > 0}
                                isAnalyzing={analyzing}
                            >
                                {comparisonItems.map(item => {
                                    const result = analysisResults[item.id];
                                    return (
                                        <div key={item.id} className="p-6 border-l border-white/5 bg-black/20">
                                            {result?.signalMatch ? (
                                                <SonicSignalSync signals={result.signalMatch} compact={true} />
                                            ) : (
                                                <div className="h-24 flex items-center justify-center border border-white/5 rounded bg-white/5">
                                                    <span className="text-[10px] text-textDim/30 font-mono tracking-widest animate-pulse">AWAITING AI SCAN</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </CollapsibleSection>

                            {/* Tags Row (Scanning Effect Target) - Collapsible */}
                            <CollapsibleSection
                                id="tags"
                                title="Signature Tags"
                                icon={Tag}
                                hasData={Object.keys(analysisResults).length > 0}
                                isAnalyzing={analyzing}
                            >
                                {comparisonItems.map(item => (
                                    <div key={item.id} className="p-6 border-l border-white/5 flex flex-wrap gap-1.5 content-start">
                                        {item.tags && item.tags.length > 0 ? (
                                            item.tags.map(tag => (
                                                <span key={tag} className="px-1.5 py-0.5 rounded-sm bg-[#111] text-[9px] font-mono text-textDim/80 border border-white/5 uppercase tracking-wide hover:border-custom-gold/30 hover:text-custom-gold transition-colors">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-textDim/20 text-xs">-</span>
                                        )}
                                    </div>
                                ))}
                            </CollapsibleSection>
                        </div>
                    </div>

                    {Object.keys(analysisResults).length > 0 && !analyzing && comparisonItems.length > 1 && (
                        <div className="mt-8 border border-custom-gold/30 bg-gradient-to-b from-custom-gold/5 to-transparent rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Header */}
                            <div className="p-6 bg-custom-gold/10 border-b border-custom-gold/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-custom-gold/20 rounded-full border border-custom-gold/30">
                                        <BrainCircuit className="w-6 h-6 text-custom-gold" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-display font-bold text-custom-gold tracking-wide">FINAL ANALYSIS VERDICT</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] text-custom-gold/60 font-mono tracking-widest uppercase">
                                                AI COMPARATIVE ANALYSIS • {getPreferenceLabel(listenerPreference)} PROTOCOL
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Winner Determination */}
                            {(() => {
                                // Find the winner (highest match score)
                                type WinnerType = SearchModel & {
                                    match: number;
                                    verdict: string;
                                    strengthsForProtocol?: string[];
                                    recommendedFor?: string;
                                };
                                let winner: WinnerType | null = null;
                                let maxScore = 0;

                                comparisonItems.forEach(item => {
                                    const result = analysisResults[item.id];
                                    if (result && result.match > maxScore) {
                                        maxScore = result.match;
                                        winner = {
                                            ...item,
                                            match: result.match,
                                            verdict: result.verdict,
                                            strengthsForProtocol: result.strengthsForProtocol,
                                            recommendedFor: result.recommendedFor
                                        };
                                    }
                                });

                                if (!winner) return null;

                                // Extract winner details before the find to avoid type narrowing issues
                                const winnerItem = winner as WinnerType;
                                const winnerId = winnerItem.id;
                                const runnerUp = comparisonItems.find(item => item.id !== winnerId);
                                const runnerUpResult = runnerUp ? analysisResults[runnerUp.id] : null;
                                const scoreDiff = runnerUpResult ? winnerItem.match - runnerUpResult.match : 0;

                                return (
                                    <div className="p-6 space-y-6">
                                        {/* Winner Card */}
                                        <div className="relative p-6 bg-[#0a0a0a] border-2 border-custom-gold/50 rounded-lg overflow-hidden">
                                            <div className="absolute top-0 right-0 px-4 py-2 bg-custom-gold text-bg text-xs font-bold font-mono tracking-wider">
                                                RECOMMENDED
                                            </div>

                                            <div className="flex items-start gap-8">
                                                <div className="flex-shrink-0 relative">
                                                    <div className="w-24 h-24 rounded border-2 border-custom-gold/30 flex flex-col items-center justify-center bg-black/40 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                                                        <span className="text-3xl font-display font-bold text-custom-gold leading-none">
                                                            {(winnerItem.match <= 10 ? winnerItem.match : winnerItem.match / 10).toFixed(1)}
                                                        </span>
                                                        <span className="text-[8px] font-mono text-custom-gold/60 uppercase tracking-tighter mt-1">LAB GRADE</span>
                                                    </div>
                                                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-custom-gold border border-black animate-pulse"></div>
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="text-xs text-custom-gold/60 font-mono uppercase tracking-widest mb-1">
                                                        {winnerItem.brandId.toUpperCase()}
                                                    </div>
                                                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                                                        {winnerItem.name}
                                                    </h3>
                                                    <p className="text-textDim text-sm leading-relaxed mb-4">
                                                        Based on your <span className="text-custom-gold">{listenerPreference}</span> listening preference,
                                                        the {winnerItem.name} emerges as the superior choice for your sonic requirements.
                                                    </p>

                                                    {/* Why This Unit */}
                                                    <div className="mt-4 p-4 bg-white/5 rounded border-l-2 border-custom-gold/50">
                                                        <h4 className="text-xs font-mono text-custom-gold uppercase tracking-widest mb-2">Why This Unit?</h4>
                                                        <p className="text-text text-sm leading-relaxed">
                                                            {winnerItem.verdict}
                                                            {scoreDiff > 0 && ` Outperforms alternatives by ${scoreDiff} percentage points on the ${getPreferenceLabel(listenerPreference)} scale.`}
                                                        </p>
                                                    </div>

                                                    {/* Strengths for Protocol */}
                                                    {winnerItem.strengthsForProtocol && winnerItem.strengthsForProtocol.length > 0 && (
                                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {winnerItem.strengthsForProtocol.map((s, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-xs text-green-400/80 bg-green-500/5 px-2 py-1.5 rounded border border-green-500/10">
                                                                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> {s}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Recommended For */}
                                                    {winnerItem.recommendedFor && (
                                                        <div className="mt-4 border-t border-white/5 pt-3">
                                                            <span className="text-[10px] font-mono text-textDim uppercase tracking-wider block mb-1">Ideal For:</span>
                                                            <p className="text-sm text-custom-gold/80 italic font-display">{winnerItem.recommendedFor}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Comparative Analysis */}
                                        {runnerUp && runnerUpResult && (
                                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                <h4 className="text-xs font-mono text-textDim uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Scale className="w-4 h-4" /> Comparative Analysis
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                    {comparisonItems.map(item => {
                                                        const result = analysisResults[item.id];
                                                        if (!result) return null;
                                                        const isWinner = item.id === winnerItem.id;
                                                        return (
                                                            <div key={item.id} className="space-y-2">
                                                                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                                                                    <span className={isWinner ? 'text-custom-gold font-bold' : 'text-textDim'}>{item.name}</span>
                                                                    <span className={isWinner ? 'text-custom-gold' : 'text-textDim'}>{result.match}%</span>
                                                                </div>
                                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${result.match}%` }}
                                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                                        className={`h-full ${isWinner ? 'bg-custom-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'bg-white/20'}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Detailed Comparison */}
                                                <div className="mt-4 text-sm text-textDim leading-relaxed">
                                                    <p>
                                                        While the <span className="text-white">{runnerUp.name}</span> scores {runnerUpResult.match}%
                                                        ({runnerUpResult.verdict}), the <span className="text-custom-gold">{winnerItem.name}</span> provides
                                                        a {scoreDiff > 10 ? 'significantly' : 'marginally'} better match for your
                                                        <span className="text-custom-gold"> {listenerPreference?.toLowerCase()}</span> listening style.
                                                        {listenerPreference === 'MUSICAL' && ' The tonal warmth and organic presentation will provide fatigue-free listening sessions.'}
                                                        {listenerPreference === 'ANALYTICAL' && ' The precision and detail retrieval will satisfy critical listening demands.'}
                                                        {listenerPreference === 'BALANCED' && ' The neutral presentation offers versatility across all genres.'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Final Note */}
                                        <div className="text-center py-4 border-t border-white/5">
                                            <p className="text-xs text-textDim/50 font-mono">
                                                Analysis based on specifications, materials, and psychoacoustic profiling • Results may vary based on room acoustics and source equipment
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    <div className="flex justify-end mt-12 mb-8">
                        <Link to="/archive" className="flex items-center gap-2 text-[10px] font-mono text-custom-gold hover:text-white transition-colors tracking-[0.3em] group uppercase">
                            <Zap className="w-3 h-3 group-hover:animate-pulse fill-custom-gold/20" />
                            ACQUIRE ADDITIONAL UNITS
                        </Link>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ComparePage;
