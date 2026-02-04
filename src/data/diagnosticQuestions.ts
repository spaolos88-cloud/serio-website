// Psychoacoustic Diagnostic Question Pool
// Questions are randomly selected each diagnostic run

export interface DiagnosticQuestion {
    id: string;
    question: string;
    options: {
        text: string;
        weight: { musical: number; analytical: number; balanced: number };
    }[];
}

export const QUESTION_POOL: DiagnosticQuestion[] = [
    {
        id: 'listening_environment',
        question: 'Where do you primarily listen to music?',
        options: [
            { text: 'Dedicated listening room with acoustic treatment', weight: { musical: 2, analytical: 3, balanced: 1 } },
            { text: 'Living room or casual space', weight: { musical: 1, analytical: 0, balanced: 3 } },
            { text: 'Studio or workspace', weight: { musical: 0, analytical: 3, balanced: 2 } },
            { text: 'Varies greatly', weight: { musical: 1, analytical: 1, balanced: 2 } }
        ]
    },
    {
        id: 'music_focus',
        question: 'What captures your attention most when listening?',
        options: [
            { text: 'The emotional impact and musical flow', weight: { musical: 4, analytical: 0, balanced: 1 } },
            { text: 'Individual instrument placement and detail', weight: { musical: 0, analytical: 4, balanced: 1 } },
            { text: 'Overall cohesiveness of the performance', weight: { musical: 2, analytical: 1, balanced: 3 } },
            { text: 'Technical accuracy of reproduction', weight: { musical: 0, analytical: 3, balanced: 2 } }
        ]
    },
    {
        id: 'listening_duration',
        question: 'How long are your typical listening sessions?',
        options: [
            { text: 'Under 30 minutes', weight: { musical: 0, analytical: 2, balanced: 1 } },
            { text: '30 minutes to 2 hours', weight: { musical: 2, analytical: 1, balanced: 3 } },
            { text: 'Over 2 hours regularly', weight: { musical: 3, analytical: 0, balanced: 2 } },
            { text: 'Varies significantly', weight: { musical: 1, analytical: 1, balanced: 2 } }
        ]
    },
    {
        id: 'music_genre',
        question: 'Which genre dominates your listening?',
        options: [
            { text: 'Classical, jazz, or acoustic', weight: { musical: 3, analytical: 2, balanced: 1 } },
            { text: 'Electronic, hip-hop, or bass-heavy', weight: { musical: 1, analytical: 3, balanced: 2 } },
            { text: 'Rock, pop, or mixed genres', weight: { musical: 2, analytical: 1, balanced: 3 } },
            { text: 'Extremely diverse catalog', weight: { musical: 1, analytical: 1, balanced: 4 } }
        ]
    },
    {
        id: 'fatigue_tolerance',
        question: 'How do you feel after long listening sessions?',
        options: [
            { text: 'Energized and engaged', weight: { musical: 1, analytical: 3, balanced: 1 } },
            { text: 'Relaxed and satisfied', weight: { musical: 4, analytical: 0, balanced: 2 } },
            { text: 'Sometimes fatigued', weight: { musical: 2, analytical: 0, balanced: 3 } },
            { text: 'Often need breaks', weight: { musical: 3, analytical: 1, balanced: 2 } }
        ]
    },
    {
        id: 'sound_preference',
        question: 'Which sound characteristic appeals to you most?',
        options: [
            { text: 'Warmth and smoothness', weight: { musical: 4, analytical: 0, balanced: 1 } },
            { text: 'Clarity and transparency', weight: { musical: 0, analytical: 4, balanced: 2 } },
            { text: 'Natural and neutral presentation', weight: { musical: 1, analytical: 2, balanced: 4 } },
            { text: 'Dynamic impact and presence', weight: { musical: 2, analytical: 3, balanced: 1 } }
        ]
    },
    {
        id: 'bass_response',
        question: 'How important is bass response accuracy?',
        options: [
            { text: 'Critical - I analyze low-end extension', weight: { musical: 0, analytical: 4, balanced: 1 } },
            { text: 'Important - Should be present but musical', weight: { musical: 3, analytical: 1, balanced: 2 } },
            { text: 'Moderate - As long as it sounds good', weight: { musical: 2, analytical: 0, balanced: 3 } },
            { text: 'Variable - Depends on the recording', weight: { musical: 1, analytical: 2, balanced: 3 } }
        ]
    },
    {
        id: 'detail_retrieval',
        question: 'How much micro-detail do you want to hear?',
        options: [
            { text: 'Everything - breath, fingers, room ambience', weight: { musical: 0, analytical: 4, balanced: 1 } },
            { text: 'Enough to appreciate the performance', weight: { musical: 3, analytical: 1, balanced: 3 } },
            { text: 'Just the music, not the mechanics', weight: { musical: 4, analytical: 0, balanced: 2 } },
            { text: 'Depends on my mood', weight: { musical: 2, analytical: 1, balanced: 3 } }
        ]
    },
    {
        id: 'volume_level',
        question: 'What volume levels do you typically prefer?',
        options: [
            { text: 'Low to moderate', weight: { musical: 3, analytical: 1, balanced: 2 } },
            { text: 'Moderate to loud', weight: { musical: 1, analytical: 3, balanced: 2 } },
            { text: 'Near concert levels', weight: { musical: 0, analytical: 2, balanced: 1 } },
            { text: 'Varies by content', weight: { musical: 2, analytical: 2, balanced: 4 } }
        ]
    },
    {
        id: 'upgrade_priority',
        question: 'When upgrading gear, what drives your decision?',
        options: [
            { text: 'Measurable performance improvements', weight: { musical: 0, analytical: 4, balanced: 2 } },
            { text: 'Emotional connection to the sound', weight: { musical: 4, analytical: 0, balanced: 1 } },
            { text: 'Versatility across different music', weight: { musical: 1, analytical: 1, balanced: 4 } },
            { text: 'Value and long-term satisfaction', weight: { musical: 2, analytical: 2, balanced: 3 } }
        ]
    },
    {
        id: 'soundstage_importance',
        question: 'How important is soundstage imaging?',
        options: [
            { text: 'Essential - I want precise positioning', weight: { musical: 1, analytical: 4, balanced: 2 } },
            { text: 'Important - But not at the cost of tone', weight: { musical: 3, analytical: 1, balanced: 3 } },
            { text: 'Nice to have, not critical', weight: { musical: 2, analytical: 0, balanced: 2 } },
            { text: 'Depends on the recording', weight: { musical: 1, analytical: 2, balanced: 3 } }
        ]
    },
    {
        id: 'tonality_vs_resolution',
        question: 'Given a choice, which would you prioritize?',
        options: [
            { text: 'Perfect tonal balance', weight: { musical: 4, analytical: 0, balanced: 2 } },
            { text: 'Maximum resolution', weight: { musical: 0, analytical: 4, balanced: 1 } },
            { text: 'Equal balance of both', weight: { musical: 1, analytical: 1, balanced: 4 } },
            { text: 'Context-dependent', weight: { musical: 2, analytical: 2, balanced: 3 } }
        ]
    }
];

// Randomly select N questions from the pool
export function getRandomQuestions(count: number = 5): DiagnosticQuestion[] {
    const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Calculate preference based on weighted answers
export function calculatePreference(answers: Record<number, string>, questions: DiagnosticQuestion[]): 'MUSICAL' | 'ANALYTICAL' | 'BALANCED' {
    const scores = { musical: 0, analytical: 0, balanced: 0 };

    Object.entries(answers).forEach(([index, optionText]) => {
        const question = questions[parseInt(index)];
        const option = question.options.find(opt => opt.text === optionText);

        if (option) {
            scores.musical += option.weight.musical;
            scores.analytical += option.weight.analytical;
            scores.balanced += option.weight.balanced;
        }
    });

    // Determine winner
    const max = Math.max(scores.musical, scores.analytical, scores.balanced);

    if (scores.musical === max) return 'MUSICAL';
    if (scores.analytical === max) return 'ANALYTICAL';
    return 'BALANCED';
}
