export type AudioIdentity = 'PA' | 'Hi-Fi' | 'Audiophile';

export type GradeClass =
    | 'B'
    | 'A'
    | 'A+'
    | 'S'
    | 'S+'
    | 'S++'
    | 'Legend';

export interface SonicCriteria {
    tonality: number; // 1-10
    bass: {
        depth: number;
        control: number;
        texture: number;
    };
    midrange: number;
    treble: number;
    resolution: number;
    dynamics: {
        macro: number;
        micro: number;
    };
    space: {
        soundstage: number;
        imaging: number;
        separation: number;
        scale: number;
    };
    timbre_decay: number;
    musicality: number; // Gatekeeper
}

export const IDENTITY_CEILINGS: Record<AudioIdentity, GradeClass> = {
    'PA': 'A+',
    'Hi-Fi': 'S',
    'Audiophile': 'Legend'
};

export const GRADING_DOMAINS = [
    'Tonality & Balance',
    'Bass Performance',
    'Midrange Realism',
    'Treble Quality',
    'Resolution & Detail',
    'Dynamics & Timing',
    'Space & Realism',
    'Timbre & Decay',
    'Musicality'
] as const;

export interface GradingRecord {
    unitName: string;
    manufacturer: string;
    identity: AudioIdentity;
    condition: 'New' | 'Used' | 'Aged' | 'Restored' | 'Modified';
    numericScore: number;
    gradeClass: GradeClass;
    legendStatus?: 'Active' | 'Heritage' | 'Not Eligible';
    tags: string[];
    justification: string;
}
