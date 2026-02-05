import { GRADING_FRAMEWORKS_FULL } from '../data/lore/grading_frameworks';
import { GRADING_SYSTEM_LORE } from '../data/lore/grading_system';
import type { DiagnosticResult } from '../data/sonicDiagnosticPool';

export interface ProductData {
    id: string;
    name: string;
    description?: string;
    category: string;
    sub_category?: string;
    specifications?: string;
    engineering_notes?: string;
    technical_intel?: any;
    tags?: string[];
    serio_taxonomy?: any;
}

export interface AnalysisResult {
    match: number;
    verdict: string;
    keywords: string[];
    // Deep Dive Fields
    listenerProfile?: {
        type: string;
        citation: string;
    };
    technicalHighlights?: string[];
    frequencyAnalysis?: string;
    engineeringInsights?: string;
    strengthsForProtocol?: string[];
    weaknessesForProtocol?: string[];
    recommendedFor?: string;
    inherentIdentity?: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED';
    targetMarket?: 'CONSUMER' | 'AUDIOPHILE' | 'PROFESSIONAL';
    classAssignment?: string;
    signalMatch?: Record<string, number>; // Mapping: M, A, S, R, V, C, F to 0-100 scores
    // Persona Fields
    role?: string;
    designIntent?: string;
    corporateKPI?: string;
    whereItShines?: string[];
    whereItCanFail?: string[];
    // Lab-Grade Scoring (10-point scale)
    labGrades?: {
        musical: {
            score: number;
            pillars: Record<string, number>;
            justification: string;
        };
        analytical: {
            score: number;
            pillars: Record<string, number>;
            justification: string;
        };
        balanced: {
            score: number;
            pillars: Record<string, number>;
            justification: string;
        };
    };
}

export const generatePrompts = (products: ProductData[], _preference: string, _diagnostic?: DiagnosticResult | null) => {
    const identity = _diagnostic?.primaryIdentity || 'BALANCED';
    const personnelClassification = identity === 'MUSICAL' ? 'The Naturalist' :
        identity === 'ANALYTICAL' ? 'The Truth-Seeker' : 'The Stabilizer';

    const context = `
    You are the SONIC LAB BEHAVIORAL DIAGNOSTIC ENGINE. 
    Current Personnel Classification: [${personnelClassification} / ${identity} IDENTITY]
    
    ## OPERATIONAL LENS:
    Evaluate the following equipment through the lens of a [${identity}] personality.
    ${identity === 'MUSICAL' ? '- Focus on emotional fatigue, decay tail naturalness, and "listenability".' :
            identity === 'ANALYTICAL' ? '- Focus on transient precision, information density, and "unfiltered truth".' :
                '- Focus on the tension between resolution and fatigue - seeking the perfect stable anchor.'}

    Handle the evaluation according to the "10-POINT LAB GRADING SYSTEM".
    No poetry, no nostalgia tax, no brand worship. This is BEHAVIOR-BASED GRADING.

    ## PART 1: MUSICAL GRADING (Emotional Continuity)
    Goal: "Can I live with this sound for hours without stress?"
    PILLARS (2 pts each):
    1. Decay Behavior: Natural end/fade. (Truncated decay CAPS score at 7/10).
    2. Midrange Coherence: Vocal wholeness, absence of driver awareness.
    3. Dynamic Flow: Smooth crescendo behavior (not loudness).
    4. Fatigue Signature: Upper-mid/treble tension over time (Failure CAPS category at 6/10).
    5. Low-SPL Completeness: Tonal balance at low volume.

    ## PART 2: ANALYTICAL GRADING (Information Integrity)
    Goal: "Does this expose what is actually in the recording?"
    PILLARS (2 pts each):
    1. Resolution: Information density, texture retrieval.
    2. Transient Accuracy: Precise leading edges (not sharpness).
    3. Separation & Layering: Intelligibility of the mix.
    4. Tonal Accuracy: Timbre believability (not flat graphs).
    5. Consistency: Predictable behavior across tracks.

    ## PART 3: BALANCED GRADING (Stability)
    Goal: "Can Musicality and Analysis coexist without conflict?"
    PILLARS (2 pts each):
    1. Musicality under Scrutiny: Flow survives focused analysis.
    2. Detail without Fatigue: No cost for clarity.
    3. Stability across SPL: No personality changes at volume.
    4. Forgiveness without Masking: Tolerates bad recordings without lying.
    5. System Identity Stability: No constant tweaking needed.

    ## AUTOMATIC SCORING CAPS (MANDATORY):
    - Truncated Decay -> Musical Max 7
    - Fatigue Present -> Musical Max 6 / Balanced Max 6
    - Needs Loudness -> Musical Max 6 / Balanced Max 6
    - High Detail + Fatigue -> Analytical Max 6 / Balanced Max 6
    - Inconsistent -> Analytical Max 6 / Balanced Max 5

    ## DATA HIERARCHY (STRICT ENFORCEMENT):
    1. CURRENT LAB PROTOCOL (${identity} Archetype) - This is the PRIMARY LENS.
    2. Engineering Notes & Specifications (Physical Reality).
    3. User Preferences (${_preference}).

    ## ⚠️ SONIC LAB CRITICAL DIRECTIVE: IDENTITY CLASH PENALTY
    You MUST identify the speaker's INHERENT IDENTITY based on materials and nomenclature:
    - ANALYTICAL Identity: Beryllium, Boron, Titanium, Carbon, "Monitor", "Studio", "DS-", "M-", "Pro".
    - MUSICAL Identity: Paper, Pulp, Alnico, Silk/Soft Dome, "Natural Sound / NS", "L-", "Hi-Fi".

    STRICT PENALTY SYSTEM:
    - If Protocol is [MUSICAL] and Speaker is [ANALYTICAL]: Deduct 2.0 to 3.5 points. Rationale MUST mention "Fatigue Risk" and "Material Stiffness".
    - If Protocol is [ANALYTICAL] and Speaker is [MUSICAL]: Deduct 1.5 to 2.5 points. Rationale MUST mention "Resolution Blur" and "Transient Lag".
    - A perfect 9.5+ grade requires matching Identity and Protocol.

    ## OUTPUT FORMAT (MANDATORY SONIC LAB JSON):
    {
        "[product_id]": {
            "match": number (Critical Match score: 0.0 to 10.0 scale),
            "verdict": "A concise Philosophy-driven summary (e.g., 'Truth Monitor vs Truth Stabilizer').",
            "labGrades": {
                "musical": {
                    "score": number (0-10, REQUIRED: Sum of pillars, apply CAPS),
                    "pillars": { "decay_behavior": 0-2, "midrange_coherence": 0-2, "dynamic_flow": 0-2, "fatigue": 0-2, "low_spl_integrity": 0-2 },
                    "justification": "Behavioral explanation based on pillars."
                },
                "analytical": {
                    "score": number (0-10, REQUIRED: Sum of pillars, apply CAPS),
                    "pillars": { "resolution": 0-2, "transient_accuracy": 0-2, "separation": 0-2, "tonal_accuracy": 0-2, "consistency": 0-2 },
                    "justification": "Behavioral explanation based on pillars."
                },
                "balanced": {
                    "score": number (0-10, REQUIRED: Sum of pillars, apply CAPS),
                    "pillars": { "musical_under_scrutiny": 0-2, "detail_without_fatigue": 0-2, "spl_stability": 0-2, "forgiveness_without_masking": 0-2, "system_identity_stability": 0-2 },
                    "justification": "Behavioral explanation based on pillars."
                }
            },

    ## 🛑 BEHAVIORAL SCORING CAPS (MANDATORY):
    Apply these caps to the final score if specific behaviors are detected:
    - FATIGUE DETECTED (Fatigue Pillar < 1.0) -> MAX SCORE: 6.0
    - SHORT DECAY (Decay Pillar < 1.0) -> MAX SCORE: 7.0 (Musical only)
    - INSTABILITY (Consistency/SPL Pillar < 1.0) -> MAX SCORE: 6.0
            "role": "Identify the primary role (e.g., Studio Reference, Home Realism Anchor)",
            "designIntent": "Explain the engineering goal",
            "corporateKPI": "Business translation (e.g., 'Compliance auditor', 'Operations management')",
            "whereItShines": ["Scenario 1", "Scenario 2"],
            "whereItCanFail": ["Pitfall 1", "Pitfall 2"],
            "inherentIdentity": "ANALYTICAL | MUSICAL | BALANCED",
            "targetMarket": "PROFESSIONAL | AUDIOPHILE | VINTAGE"
        }
    }

    ## KNOWLEDGE BASE:
    - User Preferences: "${_preference || 'Standard Archival Check'}"
    - Behavioral Signals: ${JSON.stringify(_diagnostic?.signals || { musical: 0, analytical: 0, stability: 0 })}
    ${GRADING_FRAMEWORKS_FULL}
    ${GRADING_SYSTEM_LORE}

    ## PRODUCTS TO ANALYZE:
    ${JSON.stringify(products, null, 2)}
    `;
    return context;
};

export const fetchGeminiAnalysis = async (apiKey: string, products: ProductData[], preference: string, diagnostic?: DiagnosticResult | null): Promise<Record<string, AnalysisResult>> => {
    const prompt = generatePrompts(products, preference, diagnostic);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        // Advanced JSON extraction to handle conversational noise or markdown
        let jsonStr = textResponse.trim();
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Serio/Gemini Uplink Failed:", error);
        throw error;
    }
};

export const fetchOpenAIAnalysis = async (apiKey: string, products: ProductData[], preference: string, diagnostic?: DiagnosticResult | null): Promise<Record<string, AnalysisResult>> => {
    const prompt = generatePrompts(products, preference, diagnostic);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Cost-effective default
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const textResponse = data.choices?.[0]?.message?.content || "{}";

        // Advanced JSON extraction
        let jsonStr = textResponse.trim();
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Serio/OpenAI Uplink Failed:", error);
        throw error;
    }
}

// --- LOCAL SONIC LAB ENGINE ---
export const fetchLocalAnalysis = async (products: ProductData[], preference: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED', diagnostic: DiagnosticResult | null): Promise<Record<string, AnalysisResult>> => {
    const results: Record<string, AnalysisResult> = {};

    for (const p of products) {
        try {
            const identity = preference === 'MUSICAL' ? 'Musical' : 'Analytical';

            // Call Python API
            const response = await fetch('http://localhost:8000/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listener: { identity },
                    product: {
                        name: p.name,
                        description: p.description || "",
                        specs: p.specifications || ""
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Local Engine Error: ${response.statusText}`);
            }

            const data = await response.json();
            // data matches GradingResult from API

            results[p.id] = {
                match: Math.round(data.final_grade * 10),
                verdict: data.mismatch_risk === 'high' ? "PROTOCOL VIOLATION: FATIGUE IMMINENT" : "SONIC SYNERGY CONFIRMED",
                keywords: ["LOCAL_ENGINE", "BEHAVIORAL_API", ...data.predicted_behavior],
                inherentIdentity: data.system_scores.analytical > data.system_scores.musical ? 'ANALYTICAL' : 'MUSICAL',
                labGrades: {
                    musical: {
                        score: data.system_scores.musical,
                        pillars: { debay: 1.5, coherence: 1.5, flow: 1.5, fatigue: 1.5, lowSpl: 1.5 }, // Simulation
                        justification: `Local Engine Grade: ${data.system_scores.musical}`
                    },
                    analytical: {
                        score: data.system_scores.analytical,
                        pillars: { resolution: 1.5, transients: 1.5, separation: 1.5, tonality: 1.5, consistency: 1.5 },
                        justification: `Local Engine Grade: ${data.system_scores.analytical}`
                    },
                    balanced: {
                        score: data.system_scores.balanced,
                        pillars: { scrutiny: 1.5, detailTolerance: 1.5, splStability: 1.5, forgiveness: 1.5, identityStability: 1.5 },
                        justification: `Local Engine Grade: ${data.system_scores.balanced}`
                    }
                },
                signalMatch: {
                    "M": Math.round(data.system_scores.musical * 10),
                    "A": Math.round(data.system_scores.analytical * 10),
                    "S": 85, "R": 80, "V": 75, "C": 60, "F": 90
                }
            };

        } catch (err: any) {
            console.error("Local Engine Failed", err);
            throw err;
        }
    }

    return results;
};
