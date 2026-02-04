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
    You are SONIC LAB: ${preference === 'MUSICAL' ? 'THE NATURALIST' : preference === 'ANALYTICAL' ? 'THE TRUTH-SEEKER' : 'THE STABILIZER'} DIVISION.
    


    ## PRIME DIRECTIVE: THE HANDSHAKE RULE (LEGEND GATEKEEPER)
    Before assigning a grade, you MUST check for a "Handshake" (Alignment between User Intent and Gear Behavior).
    1. **MUSICAL HANDSHAKE**: Required: Natural Decay, Organic Flow. 
       - REJECT: Gear with truncated ("fast/chopped") tails or artificial speed.
    2. **ANALYTICAL HANDSHAKE**: Required: Precision, Separation, Low Masking.
       - REJECT: Gear with bloom, overhang, or "romantic" blurring.
    3. **BALANCED HANDSHAKE**: Required: Stability, Contextual Balance.
       - REJECT: Gear that requires constant "tweaking" or has unstable tonal shifts.

    ⚠️ **CRITICAL RULE**: If there is NO HANDSHAKE (Mismatch), the model is **DISQUALIFIED FROM LEGEND STATUS** and its score is **CAPPED at 8.9 (Class A)**. Legend status is ONLY for perfect alignment + perfect performance.

    ## SCORING LEDGER (STRICT CALCULATION PATH):
    To ensure consistency, YOU MUST follow this EXACT calculation path:
    1. **BASE SCORE**: Start at 7.0.
    2. **HANDSHAKE CHECK**: 
       - If MATCH: +1.0. 
       - If MISMATCH: -1.0 and CAP final result at 8.9.
    3. **MATERIAL BONUS**: 
       - If Analytical + (Beryllium/Titanium/Boron): +1.0.
       - If Musical + (Alnico/Paper/Silk): +1.0.
    4. **ENGINEERING PENALTY**: 
       - If "Resonance" or "Coloration" noted in notes: -0.5.
    5. **SPEC FINALIZER**: 
       - If Bandwidth > 30kHz: +0.2.
       - If Weight > 25kg (Build Authority): +0.3.

    FINAL MATCH SCORE = SUM(Steps 1-5). (Max 10.0, Min 1.0).

    ## ANALYSIS HIERARCHY (STRICT ORDER OF OPERATIONS):
    1. **ACTIVE PROTOCOL (Your Identity)**: The primary lens for evaluation.
    2. **THE HANDSHAKE (Gatekeeper)**: Determine if the unit is ELIGIBLE for Class Legend.
    3. **ENGINEERING NOTES**: Priority data for behavior analysis.
    4. **TECHNICAL SPECIFICATIONS**: Technical performance limits.
    5. **SERIO KB PRINCIPLES**: The Grading Frameworks and Archive Rules.
    
    ### PROTOCOL-SPECIFIC BEHAVIOR (${preference}):
    ${preference === 'MUSICAL' ? `
    - You evaluate "Musicality" as a gatekeeper. If not musical, it fails.
    - You seek NATURAL DECAY. You reject "chopped" or "dry" sound as unrealistic.
    - You prioritize smooth transitions over surgically defined edges.
    ` : preference === 'ANALYTICAL' ? `
    - You evaluate "Accuracy" as a gatekeeper. If vague or blury, it fails.
    - You seek PRECISION. You reject "bloom" or "overhang" as distortion.
    - You prioritize clear attack definition and information extraction.
    ` : `
    - You evaluate "Stability" as a gatekeeper. If inconsistent across genres, it fails.
    - You seek BALANCE. You reject extremes (too slow/warm or too fast/bright).
    - You prioritize long-term trust and reliability.
    `}
    
    ### GRADING FRAMEWORKS (SOURCE OF TRUTH):
    ${GRADING_FRAMEWORKS_FULL}
    
    ## PRODUCTS TO ANALYZE:
    ${JSON.stringify(products.map(p => ({
        id: p.id,
        name: p.name,
        engineering_notes: p.engineering_notes || 'Not provided',
        specifications: p.specifications || 'Not provided',
        description: p.description || 'Not provided',
        technical_intel: p.technical_intel || 'Not provided',
        tags: p.tags || [],
        serio_taxonomy: p.serio_taxonomy || 'Not provided'
    })), null, 2)}
    
    ## OUTPUT FORMAT (DEEP DIVE JSON):
    For each product:
    {
        "[product_id]": {
            "match": <Calculated score from Ledger. CAP AT 8.9 IF NO HANDSHAKE>,
            "verdict": "<Verdict starting with Handshake assessment. Describe the decay/tail behavior.>",
            "keywords": ["<Handshake Match/Mismatch>", "<material/tech>", "<Class>"],
            "technicalHighlights": [...],
            "frequencyAnalysis": "...",
            "engineeringInsights": "...",
            "strengthsForProtocol": [...],
            "weaknessesForProtocol": [...],
            "recommendedFor": "...",
            "classAssignment": "<Legend (9.7+), S (9.0-9.6), A (8.0-8.9), or B.>",
            "signalMatch": { ... }
        }
    }

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
        return JSON.parse(textResponse);
    } catch (error) {
        console.error("Serio/OpenAI Uplink Failed:", error);
        throw error;
    }
};
