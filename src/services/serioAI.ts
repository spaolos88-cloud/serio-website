import { IDIOT_PROOF_GUIDE_FULL } from '../data/lore/idiot_proof_guide';
import { GRADING_FRAMEWORKS_FULL } from '../data/lore/grading_frameworks';
import { SONIC_IDENTITIES, CATEGORY_CONFLICT_RULES } from '../data/sonicLabLore';
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
    technicalHighlights?: string[];
    frequencyAnalysis?: string;
    engineeringInsights?: string;
    strengthsForProtocol?: string[];
    weaknessesForProtocol?: string[];
    recommendedFor?: string;
    classAssignment?: string;
    signalMatch?: Record<string, number>; // Mapping: M, A, S, R, V, C, F to 0-100 scores
}

export const generatePrompts = (products: ProductData[], preference: string, diagnostic?: DiagnosticResult | null) => {
    const context = `
    You are SONIC LAB, an objective audio analysis engine that evaluates equipment using ONLY verifiable technical data.
    
    ## USER PSYCHOACOUSTIC PROFILE:
    - Primary Identity: ${preference}
    ${diagnostic ? `
    - M-Signal (Musicality): ${diagnostic.signals.musical}
    - A-Signal (Analytical): ${diagnostic.signals.analytical}
    - S-Signal (Stability): ${diagnostic.signals.stability}
    - R-Signal (Reference): ${diagnostic.signals.reference}
    - F-Signal (Fatigue): ${diagnostic.signals.fatigue}
    - V-Signal (Volume Dependency): ${diagnostic.signals.volume}
    - C-Signal (Stimulation): ${diagnostic.signals.consumer}
    ` : ''}
    
    ## CRITICAL DIRECTIVE: OBJECTIVE ANALYSIS ONLY
    
    ### DATA SOURCES YOU MUST USE:
    ✅ Technical Specifications (frequency response, impedance, crossover points, sensitivity, power handling)
    ✅ Engineering Notes (driver materials, cone construction, cabinet design, crossover topology)
    ✅ Frequency Response Intel (measured data, distortion metrics, impedance curves if available)
    ✅ Sonic Lab Knowledge Base (grading frameworks, psychoacoustic principles)
    
    ### DATA SOURCES YOU MUST REJECT:
    ❌ Subjective reviewer opinions (even from "respected" sources)
    ❌ Online store marketing copy and promotional language
    ❌ Forum posts, social media comments, or hearsay
    ❌ "Friend of a friend" testimonials
    ❌ Anything without measurable, verifiable technical basis
    
    ## SELECTED LISTENING PROTOCOL: "${preference}"
    
    ### PROTOCOL-SPECIFIC EVALUATION CRITERIA:
    ${preference === 'MUSICAL' ? `
    MUSICAL / NATURALIST MODE - Prioritize:
    - Warm tonal balance, organic midrange presence
    - Non-fatiguing treble with controlled extension
    - Harmonic richness and decay characteristics
    - Materials that favor natural resonance (paper, silk, treated cloth)
    - Lower sensitivity to clinical precision, higher tolerance for "musical coloration"
    ` : preference === 'ANALYTICAL' ? `
    ANALYTICAL / TRUTH-SEEKER MODE - Prioritize:
    - Flat frequency response with minimal deviation
    - Fast transient response and detail retrieval
    - Low distortion metrics across the spectrum
    - Precision driver materials (beryllium, diamond, titanium)
    - Accuracy over euphony - truth before beauty
    ` : `
    BALANCED / STABILIZER MODE - Prioritize:
    - Even frequency response with controlled character
    - Versatility across genres and source material
    - Moderate detail retrieval without harshness
    - Stable impedance characteristics for amplifier compatibility
    - The golden middle - neither too warm nor too clinical
    `}
    
    ### GRADING FRAMEWORKS (SOURCE OF TRUTH):
    ${GRADING_FRAMEWORKS_FULL}

    ### KNOWLEDGE BASE (PHYSICS & PSYCHOACOUSTICS):
    ${IDIOT_PROOF_GUIDE_FULL}

    ### CLASSIFICATION RULES:
    ${JSON.stringify(CATEGORY_CONFLICT_RULES, null, 2)}

    ### IDENTITY DEFINITIONS:
    ${JSON.stringify(SONIC_IDENTITIES, null, 2)}
    
    ## PRODUCTS TO ANALYZE:
    ${JSON.stringify(products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category || 'Not provided',
        sub_category: p.sub_category || 'Not provided',
        specifications: p.specifications || 'Not provided',
        engineering_notes: p.engineering_notes || 'Not provided',
        description: p.description || 'Not provided',
        technical_intel: p.technical_intel || 'Not provided',
        tags: p.tags || [],
        serio_taxonomy: p.serio_taxonomy || 'Not provided'
    })), null, 2)}
    
    ## OUTPUT FORMAT (DEEP DIVE JSON):
    For each product, return comprehensive analysis:
    {
        "[product_id]": {
            "match": <60-99 based on alignment with ${preference} protocol>,
            "verdict": "<2-3 sentence technical verdict. Reference SPECIFIC specs/materials>",
            "keywords": ["<material/tech tag>", "<performance tag>", "<class if applicable>"],
            "technicalHighlights": [
                "<Key spec #1 with value, e.g. '35Hz-30kHz frequency response'>",
                "<Key spec #2, e.g. '6Ω nominal impedance'>",
                "<Key spec #3, e.g. '91dB/W/m sensitivity'>"
            ],
            "frequencyAnalysis": "<1-2 sentences analyzing frequency response characteristics and what they mean for the ${preference} protocol>",
            "engineeringInsights": "<1-2 sentences about construction, materials, and design philosophy from engineering notes>",
            "strengthsForProtocol": [
                "<Strength #1 specific to ${preference} protocol>",
                "<Strength #2 specific to ${preference} protocol>"
            ],
            "weaknessesForProtocol": [
                "<Potential weakness or trade-off for ${preference} protocol>"
            ],
            "recommendedFor": "<Ideal use case, e.g. 'Jazz, Classical, Acoustic' or 'Studio Monitoring, Mixing'>",
            "classAssignment": "<B, A, S, or Legend based on Grading System rules>",
            "signalMatch": {
                "M": <0-100 alignment with Musicality preference>,
                "A": <0-100 alignment with Analytical preference>,
                "S": <0-100 alignment with Stability/Reliability specs>,
                "R": <0-100 alignment with Reference benchmarks>,
                "V": <0-100 alignment with Volume scaling/power handling>,
                "C": <0-100 alignment with Consumer engagement/fun factor>,
                "F": <0-100 safety score: 100 = non-fatiguing, 0 = high ear stress>
            }
        }
    }
    
    ## SIGNAL MATCH EVALUATION RULES:
    - **M (Musicality):** Score high if engineering notes mention warm voicing, paper/silk materials, or harmonic richness.
    - **A (Analytical):** Score high if specs show flat FR, use of beryllium/boron/titanium, or "monitor" designation.
    - **S (Stability):** Score high for robust impedance curves and high-quality cabinet/chassis construction.
    - **R (Reference):** Score high if the unit is a historical studio standard or benchmark performer.
    - **V (Volume):** Score high for high sensitivity and high power handling capacity.
    - **C (Consumer):** Score high for V-shaped signatures or "exciting" marketing/material traits.
    - **F (Fatigue):** Score high (safe) if treble is controlled/rolled off. Score low (stressful) if there are sharp breakup modes or ringing.
    
    ## DEEP DIVE INSTRUCTIONS:
    - **PRIORITY DIRECTIVE:** If 'serio_taxonomy' or 'tags' are provided, YOU MUST ALIGN WITH THEM.
      - If 'tags' contains "Reference" -> Score 'R' (Reference) > 90.
      - If 'serio_taxonomy.performance_class' is provided (e.g. "S", "A"), your 'classAssignment' MUST MATCH IT.
      - Do not hallucinate a lower class for a verified unit.
    - Extract ACTUAL numeric specs when available (Hz, dB, Ω, W)
    - Reference specific materials (Carbon Graphite, Boronated Titanium, etc.)
    - If 'technical_intel' is present, synthesize its 'visual_analysis' into your verdict.
    - Explain HOW each spec benefits or hinders the ${preference} protocol
    - Be honest about trade-offs - no product is perfect
    - If data is missing, state "Specifications not provided" rather than inventing
    
    Return ONLY valid JSON, no markdown code blocks.
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
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        // Clean markdown code blocks if present
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
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
                    { role: "system", content: "You are a specialized audio analysis engine that outputs only JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const textResponse = data.choices?.[0]?.message?.content || "{}";
        return JSON.parse(textResponse);
    } catch (error) {
        console.error("Serio/OpenAI Uplink Failed:", error);
        throw error;
    }
};
