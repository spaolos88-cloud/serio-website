
// Sonic Lab Lore & Signal Definitions
// Extracted from "Listener Questionaire- Audiophile Grading.txt"

export type SignalType = 'M' | 'A' | 'C' | 'S' | 'F' | 'R' | 'V' | 'B' | 'X';

export const SIGNAL_LEGEND: Record<string, string> = {
    'M': 'Musical Alignment',
    'A': 'Analytical Bias',
    'C': 'Consumer / Stimulation-Driven',
    'S': 'Stability / Discipline',
    'F': 'Fatigue / Stress Detected',
    'R': 'Reference / Verification',
    'V': 'Volume Dependency',
    'B': 'Balanced Alignment',
    'X': 'Imbalance / Misuse Flag'
};

export interface IdentityDefinition {
    id: string;
    name: string;
    description: string;
    primarySignals: SignalType[];
    traits: string[];
}

export const SONIC_IDENTITIES: Record<string, IdentityDefinition> = {
    MUSICAL: {
        id: 'MUSICAL',
        name: 'The Musical Listener',
        description: 'Prioritizes flow, tone, and emotional connection over technical dissection.',
        primarySignals: ['M', 'S'],
        traits: ['High Endurance', 'Low Fatigue', 'Tone > Detail', 'Acceptance of Imperfection']
    },
    ANALYTICAL: {
        id: 'ANALYTICAL',
        name: 'The Analytical Listener',
        description: 'Focuses on precision, transient speed, and error detection.',
        primarySignals: ['A', 'R', 'V'],
        traits: ['Detail Oriented', 'Truth over Comfort', 'Focus-Dependent', 'Short Sessions']
    },
    CONSUMER: {
        id: 'CONSUMER',
        name: 'The Consumer Audiophile',
        description: 'Driven by stimulation, novelty, and constant upgrades (The "Chaser").',
        primarySignals: ['C', 'V', 'X'],
        traits: ['Stimulation Seeking', 'High Comparison Urge', 'Low Satisfaction', 'Gear Centric']
    },
    BALANCED: {
        id: 'BALANCED',
        name: 'The Balanced Listener',
        description: 'The end-state audiophile. Possesses both discipline and enjoyment capacity.',
        primarySignals: ['B', 'S', 'M'],
        traits: ['High Stability', 'Emotional & Technical Appreciation', 'Long-term Satisfaction']
    }
};

export const CATEGORY_CONFLICT_RULES = [
    { rule: "High A+ + High M+", consequence: "Conflict Flag: Identity Mismatch" },
    { rule: "High A+ + Low Endurance", consequence: "Recommendation: Analytical-Only" },
    { rule: "High A+ + High C+", consequence: "Flag: Consumer Phase (Not Reference Qualified)" }
];

export const CLUSTER_INTERPRETATIONS = {
    MUSICAL: {
        CLUSTER_A: "Endurance & Fatigue: High YES = Musical, High NO = Stress/Analytical",
        CLUSTER_B: "Attention: Ability to disengage = Musical",
        CLUSTER_C: "Decay & Timing: Sensitivity to flow = Musical",
        CLUSTER_D: "Wow Factor: High YES = Consumer Bias",
        CLUSTER_E: "Stability: Constant tweaking = Unstable/Consumer",
        CLUSTER_F: "Low Volume: Integrity at low vol = Musical",
        CLUSTER_G: "Long Term: Acceptance = Musical",
        CLUSTER_H: "Final Identity: Body-led judgment = Musical"
    },
    ANALYTICAL: {
        CLUSTER_A: "Error Detection: High Density = Strong Analytical",
        CLUSTER_B: "Truth/Comfort: Intolerance to masking",
        CLUSTER_C: "Speed/Attack: Attack over decay",
        CLUSTER_D: "Analysis Mode: Listening as work",
        CLUSTER_E: "Neutrality: Predictability > Emotion",
        CLUSTER_F: "Volume Dependency: Loudness = Information",
        CLUSTER_G: "Reference: Structured evaluation",
        CLUSTER_H: "Validation: Data-led confidence"
    },
    BALANCED: {
        CLUSTER_A: "Non-Impressive Acceptance: Can accept calm sound",
        CLUSTER_B: "Context Consistency: Balance survives mood/genre",
        CLUSTER_C: "Endurance + Analysis: Can analyze without being trapped",
        CLUSTER_D: "Realism: Detects false gains",
        CLUSTER_E: "Life Integration: Sound fits life",
        CLUSTER_F: "Self Awareness: Waits before judgment",
        CLUSTER_G: "Social Stability: No ego/arguments",
        CLUSTER_H: "Time Reliability: Measured in months"
    }
};
