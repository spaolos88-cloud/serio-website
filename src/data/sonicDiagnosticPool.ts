export interface DiagnosticQuestion {
    id: string;
    text: string;
    cluster: string;
    type: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED';
}

export interface DiagnosticResult {
    primaryIdentity: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED';
    signals: {
        musical: number;    // M+
        analytical: number;  // A+
        consumer: number;    // C+ (Consumer / Stimulation)
        stability: number;   // S+ (Stability / Discipline)
        fatigue: number;     // F+ (Fatigue / Stress)
        volume: number;      // V+ (Volume Dependency)
        reference: number;   // R+ (Reference / Discipline)
    };
    report: string;
}

import { MUSICALITY_QUESTIONS, ANALYTICAL_QUESTIONS, BALANCED_QUESTIONS } from './gradingQuestions';

// Selection logic: Pick a balanced sample from the NEW high-fidelity pools
export function getSampledDiagnostic(count: number = 24): DiagnosticQuestion[] {
    const sampled: DiagnosticQuestion[] = [];
    // We want a mix of Musical, Analytical, and Balanced
    const perCategory = Math.floor(count / 3);

    const getQuestions = (pool: any[], prefix: string, type: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED') => {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, perCategory).map(q => ({
            id: `${prefix}_q${q.id}`, // Format: m_q1, a_q5 for derivedIdentity compatibility
            text: q.text,
            cluster: q.cluster,
            type: type
        }));
    };

    sampled.push(...getQuestions(MUSICALITY_QUESTIONS, 'm', 'MUSICAL'));
    sampled.push(...getQuestions(ANALYTICAL_QUESTIONS, 'a', 'ANALYTICAL'));
    sampled.push(...getQuestions(BALANCED_QUESTIONS, 'b', 'BALANCED'));

    return sampled.sort(() => 0.5 - Math.random());
}

export function deriveIdentity(answers: Record<string, boolean>): DiagnosticResult {
    const signals = {
        musical: 0,
        analytical: 0,
        consumer: 0,
        stability: 0,
        fatigue: 0,
        volume: 0,
        reference: 0
    };

    // Iterate through given answers and apply weights based on the INTERNAL SIGNAL MAP logic
    Object.entries(answers).forEach(([id, yes]) => {
        const prefix = id.split('_')[0];
        const numArr = id.split('_q');
        if (numArr.length < 2) return;
        const num = parseInt(numArr[1]);

        if (prefix === 'm') {
            // CLUSTER A: Endurance
            if (num >= 1 && num <= 20) {
                if (yes) {
                    if ([1, 4, 7, 9, 10, 13, 15, 19, 20].includes(num)) { signals.musical += 2; signals.stability += 1; }
                    else { signals.fatigue += 2; signals.analytical += 1; }
                }
            }
            // CLUSTER B: Attention
            else if (num >= 21 && num <= 35) {
                if (yes) {
                    if ([21, 23, 26, 28, 30, 32, 34].includes(num)) signals.musical += 2;
                    else { signals.analytical += 2; signals.consumer += 1; }
                }
            }
            // CLUSTER C: Decay
            else if (num >= 36 && num <= 50) {
                if (yes) {
                    if ([43, 46, 48, 49].includes(num)) signals.musical += 4; // Strong M+
                    else if ([40, 44].includes(num)) signals.analytical += 2;
                    else signals.musical += 2;
                }
            }
            // CLUSTER D: Wow
            else if (num >= 51 && num <= 65) {
                if (yes) { signals.consumer += 2; signals.analytical += 1; }
                else signals.musical += 1;
            }
            // CLUSTER E: Stability
            else if (num >= 66 && num <= 80) {
                if (yes) {
                    if ([68, 70, 72, 74, 77, 79, 80].includes(num)) signals.stability += 2;
                    else { signals.consumer += 2; signals.stability -= 1; }
                }
            }
            // CLUSTER F: Low Volume
            else if (num >= 81 && num <= 90) {
                if (yes) {
                    if ([81, 83, 85, 87, 89].includes(num)) signals.musical += 3;
                    else { signals.analytical += 2; signals.volume += 2; }
                }
            }
            // CLUSTER G: Acceptance
            else if (num >= 91 && num <= 100) {
                if (yes) { signals.musical += 2; signals.stability += 1; }
                else signals.consumer += 2;
            }
            // CLUSTER H: Identity
            else if (num >= 101 && num <= 110) {
                if (num === 106) { if (yes) signals.analytical += 2; }
                else if (yes) signals.musical += 4; // Strong M+
            }
        }
        else if (prefix === 'a') {
            // CLUSTER A-H for Analytical
            if (num <= 10) { if (yes) signals.analytical += 3; } // Precision
            else if (num <= 20) { if (yes) { signals.analytical += 3; signals.reference += 2; signals.musical -= 1; } } // Truth
            else if (num <= 30) { if (yes) signals.analytical += 3; } // Speed
            else if (num <= 40) { if (yes) { signals.analytical += 2; } } // Mode
            else if (num <= 50) { if (yes) { signals.analytical += 2; signals.reference += 2; } } // Neutrality
            else if (num <= 60) { if (yes) { signals.volume += 3; signals.analytical += 1; } } // Volume
            else if (num <= 70) { if (yes) { signals.reference += 3; signals.analytical += 1; } } // Reference
            else if (num <= 80) { if (yes) signals.analytical += 3; } // Validation
        }
        else if (prefix === 'b') {
            // CLUSTER A-H for Balanced
            if (num <= 10) { if (yes) { signals.stability += 2; } else { signals.consumer += 2; } } // Acceptance
            else if (num <= 20) { if (yes) { signals.stability += 2; if (num === 18) signals.stability += 4; } } // Context
            else if (num <= 30) { if (yes) { signals.stability += 2; if (num === 22) signals.analytical += 2; } } // Endurance
            else if (num <= 40) { if (yes) { signals.stability += 2; signals.musical += 1; } } // Realism
            else if (num <= 50) { if (yes) { signals.stability += 2; signals.reference += 2; } } // Integration
            else if (num <= 60) { if (yes) { signals.stability += 2; } } // Restraint
            else if (num <= 70) { if (yes) { signals.stability += 2; signals.reference += 2; } } // Philosophical
            else if (num <= 80) { if (yes) { signals.stability += 3; } } // Reliability
        }
    });

    // Guardrail Check: Balanced cannot be claimed if stability is low or consumer impulse is high
    let primary: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED' = 'BALANCED';

    const mScore = signals.musical - (signals.fatigue * 0.5) - (signals.consumer * 0.2);
    const aScore = signals.analytical + (signals.volume * 0.3) + (signals.reference * 0.5);
    const bScore = signals.stability + (Math.min(signals.musical, signals.analytical) * 0.3) - (signals.consumer * 0.5);

    if (mScore > aScore && mScore > bScore) primary = 'MUSICAL';
    else if (aScore > mScore && aScore > bScore) primary = 'ANALYTICAL';
    else primary = 'BALANCED';

    // Conflict Resolution
    if (primary === 'BALANCED' && signals.stability < 10) {
        primary = mScore > aScore ? 'MUSICAL' : 'ANALYTICAL';
    }

    let report = "";
    if (primary === 'MUSICAL') {
        report = "Diagnostic indicates 'The Naturalist' profile. High endurance for long sessions, sensitivity to harmonic decay, and preference for organic flow over surgical detail.";
    } else if (primary === 'ANALYTICAL') {
        report = "Diagnostic indicates 'The Truth-Seeker' profile. Priority is clarity and separation. You value accuracy over euphony and use volume to extract micro-detail.";
    } else {
        report = "Diagnostic indicates 'The Stabilizer' profile. High system-level awareness. You value long-term stability and reliability across all genres and volumes.";
    }

    return {
        primaryIdentity: primary,
        signals,
        report
    };
}

/**
 * HEURISTIC SIGNAL MAPPING
 * Maps product metadata (tags, brands, nomenclature) to estimated psychoacoustic signals.
 */
export const HEURISTIC_SIGNAL_MAP = {
    M: { // Musicality
        tags: ['Natural Sound', 'Paper', 'Silk', 'Warm', 'Alnico', 'Soft Dome', 'Organic', 'Full Range'],
        brands: ['Yamaha', 'Diatone', 'Pioneer', 'Luxman'],
        nomenclature: ['NS', 'M', 'EX']
    },
    A: { // Analytical
        tags: ['Beryllium', 'Boron', 'Titanium', 'Monitor', 'Studio', 'High Resolution', 'Precision', 'Technical'],
        brands: ['Yamaha', 'Technics', 'Sony', 'Denon'],
        nomenclature: ['M', 'Pro', 'Studio', 'Reference']
    },
    S: { // Stability
        tags: ['Honeycomb', 'Anti-Resonant', 'Cast Frame', 'Stable', 'Robust', 'Linear'],
        brands: ['Technics', 'Diatone', 'Victor'],
        nomenclature: ['SB', 'DS', 'Zero']
    },
    R: { // Reference
        tags: ['Reference', 'Benchmark', 'Industry Standard', 'Heritage', 'Legend'],
        brands: ['Yamaha', 'Sony', 'Pioneer'],
        nomenclature: ['NS-1000', 'Exclusive', 'Model']
    },
    V: { // Volume
        tags: ['High Sensitivity', 'Horn Loaded', 'PA Grade', 'High Power', 'Large Format'],
        brands: ['Onkyo', 'JBL', 'Coral'],
        nomenclature: ['Scepter', 'Monitor', 'Large']
    },
    C: { // Consumer
        tags: ['Lifestyle', 'Exciting', 'Bass Boosted', 'Compact', 'Entry Level'],
        brands: ['Kenwood', 'Sansui'],
        nomenclature: ['LS', 'Compact']
    },
    F: { // Fatigue
        tags: ['Sharp', 'Bright', 'Unshielded', 'Legacy'],
        brands: [],
        nomenclature: []
    }
};

export function calculateModelSignals(model: any) {
    const signals = { M: 50, A: 50, S: 50, R: 50, V: 50, C: 50, F: 50 };
    const text = `${model.name} ${model.id} ${model.brandId} ${model.category} ${model.tags?.join(' ') || ''}`.toLowerCase();

    Object.entries(HEURISTIC_SIGNAL_MAP).forEach(([sig, rules]) => {
        let score = 50;

        // Tag Matches
        rules.tags.forEach(tag => {
            if (text.includes(tag.toLowerCase())) score += 15;
        });

        // Brand Matches
        if (rules.brands.some(b => model.brandId.toLowerCase().includes(b.toLowerCase()))) {
            score += 10;
        }

        // Nomenclature Matches
        rules.nomenclature.forEach(nom => {
            if (model.name.includes(nom)) score += 5;
        });

        (signals as any)[sig] = Math.min(Math.max(score, 0), 99);
    });

    return signals;
}
