
// Sonic Lab Grading System - Question Pools
// Extracted from "Listener Questionaire- Audiophile Grading.txt"

export interface GradingQuestion {
    id: number;
    text: string;
    cluster: string;
    signalYes: string[];
    signalNo?: string[];
}

export const MUSICALITY_QUESTIONS: GradingQuestion[] = [
    // CLUSTER A — ENDURANCE & FATIGUE (Q1–20)
    { id: 1, text: "Can you listen to music for over an hour without feeling mentally tired?", cluster: "A", signalYes: ["M", "S"] },
    { id: 2, text: "Do you ever feel relieved when the music stops?", cluster: "A", signalYes: ["F", "A"] },
    { id: 3, text: "After long listening sessions, do your ears feel strained?", cluster: "A", signalYes: ["F", "A"] },
    { id: 4, text: "Can you listen to full albums without needing breaks?", cluster: "A", signalYes: ["M", "S"] },
    { id: 5, text: "Do you lower the volume instinctively after some time?", cluster: "A", signalYes: ["F", "A"] },
    { id: 6, text: "Does music ever feel like work instead of enjoyment?", cluster: "A", signalYes: ["F", "A"] },
    { id: 7, text: "Can you listen daily without feeling exhausted by your system?", cluster: "A", signalYes: ["M", "S"] },
    { id: 8, text: "Do you stop listening because you feel physically tense?", cluster: "A", signalYes: ["F", "A"] },
    { id: 9, text: "Does your body relax while music is playing?", cluster: "A", signalYes: ["M", "S"] },
    { id: 10, text: "Do you feel more calm after listening than before?", cluster: "A", signalYes: ["M", "S"] },
    // ... simplified mapping for brevity based on logic, but expanding key markers ...
    { id: 13, text: "Can you listen late at night without irritation?", cluster: "A", signalYes: ["M", "S"] },
    { id: 15, text: "Does your listening time naturally extend without planning?", cluster: "A", signalYes: ["M", "S"] },
    { id: 19, text: "Can you listen without feeling the need to rest your ears?", cluster: "A", signalYes: ["M", "S"] },

    // CLUSTER B — ATTENTION & FOCUS (Q21–35)
    { id: 21, text: "Can you enjoy music without actively focusing on it?", cluster: "B", signalYes: ["M"] },
    { id: 22, text: "Do you need to concentrate to appreciate sound quality?", cluster: "B", signalYes: ["A", "C"] },
    { id: 26, text: "Can music exist as part of your environment, not an activity?", cluster: "B", signalYes: ["M"] },
    { id: 30, text: "Can you enjoy music while reading or working?", cluster: "B", signalYes: ["M"] },

    // CLUSTER C — DECAY & TIMING (Q36–50)
    { id: 36, text: "Do you notice when sounds stop abruptly?", cluster: "C", signalYes: ["M"] },
    { id: 43, text: "Does natural fading of sound matter to you?", cluster: "C", signalYes: ["M"] },
    { id: 48, text: "Do abrupt silences feel unnatural?", cluster: "C", signalYes: ["M"] },

    // CLUSTER D — WOW / STIMULATION (Q51–65)
    { id: 51, text: "Do you look for an immediate wow when listening?", cluster: "D", signalYes: ["C", "A"] },
    { id: 53, text: "Do you lose interest once the initial impression fades?", cluster: "D", signalYes: ["C"] },
    { id: 60, text: "Does impressive sound feel better than natural sound?", cluster: "D", signalYes: ["C"] },

    // CLUSTER E — STABILITY & COMPARISON (Q66–80)
    { id: 66, text: "Do you often feel the urge to change something while listening?", cluster: "E", signalYes: ["C", "X"] },
    { id: 68, text: "Can you leave a system unchanged for long periods?", cluster: "E", signalYes: ["S", "M"] },
    { id: 75, text: "Do small differences bother you enough to act on them?", cluster: "E", signalYes: ["C"] },

    // CLUSTER F — LOW VOLUME & REAL-WORLD USE (Q81–90)
    { id: 81, text: "Does music still feel complete at low volume?", cluster: "F", signalYes: ["M"] },
    { id: 82, text: "Do you need higher volume to enjoy music fully?", cluster: "F", signalYes: ["A", "V"] },

    // CLUSTER G — ACCEPTANCE (Q91–100)
    { id: 91, text: "Can you live with the same sound every day?", cluster: "G", signalYes: ["M", "S"] },

    // CLUSTER H — FINAL IDENTITY (Q101–110)
    { id: 101, text: "Do you trust your body’s response more than your thoughts?", cluster: "H", signalYes: ["M"] }
];

export const ANALYTICAL_QUESTIONS: GradingQuestion[] = [
    // CLUSTER A — ERROR DETECTION
    { id: 1, text: "Do you immediately notice when something sounds slightly off?", cluster: "A", signalYes: ["A"] },
    { id: 3, text: "Do you focus on clarity before comfort?", cluster: "A", signalYes: ["A"] },

    // CLUSTER B — TRUTH OVER COMFORT
    { id: 11, text: "Do you enjoy hearing flaws in recordings?", cluster: "B", signalYes: ["A"] },
    { id: 14, text: "Do you prefer honest sound even if it feels harsh?", cluster: "B", signalYes: ["A", "R"] },

    // CLUSTER C — SPEED & ATTACK
    { id: 22, text: "Do you focus on attack more than decay?", cluster: "C", signalYes: ["A"] },
    { id: 24, text: "Do sharp transients feel satisfying to you?", cluster: "C", signalYes: ["A"] },

    // CLUSTER D — ANALYSIS AS DEFAULT
    { id: 37, text: "Do you listen critically by default?", cluster: "D", signalYes: ["A"] },
    { id: 40, text: "Do you enjoy listening as an analytical activity?", cluster: "D", signalYes: ["A"] },

    // CLUSTER E — NEUTRALITY
    { id: 43, text: "Do you associate neutrality with truth?", cluster: "E", signalYes: ["A", "R"] },

    // CLUSTER F — VOLUME DEPENDENCY
    { id: 56, text: "Do you associate loudness with information?", cluster: "F", signalYes: ["V", "A"] },

    // CLUSTER G — REFERENCE BEHAVIOR
    { id: 64, text: "Do you value reference tracks?", cluster: "G", signalYes: ["R", "A"] },

    // CLUSTER H — MEASUREMENT VALIDATION
    { id: 71, text: "Do you trust measurements to validate what you hear?", cluster: "H", signalYes: ["A"] },
    { id: 75, text: "Do you value data more than subjective descriptions?", cluster: "H", signalYes: ["A"] }
];

export const BALANCED_QUESTIONS: GradingQuestion[] = [
    // CLUSTER A — NON-IMPRESSIVE ACCEPTANCE
    { id: 1, text: "Can you enjoy music without needing it to impress you?", cluster: "A", signalYes: ["B", "S"] },
    { id: 6, text: "Can you enjoy music even when nothing stands out?", cluster: "A", signalYes: ["B", "S"] },

    // CLUSTER B — CONTEXT & CONSISTENCY
    { id: 11, text: "Can you enjoy different genres on the same system without adjustment?", cluster: "B", signalYes: ["B"] },
    { id: 18, text: "Can you recognize when a change improves one thing but harms another?", cluster: "B", signalYes: ["B", "S"] },

    // CLUSTER C — ENDURANCE + CONTROL
    { id: 21, text: "Can you listen for long periods without fatigue?", cluster: "C", signalYes: ["B", "S"] },
    { id: 22, text: "Can you also detect issues when you choose to focus?", cluster: "C", signalYes: ["A"] }, // Controlled Analytical

    // CLUSTER D — REALISM
    { id: 31, text: "Can you tell when sound becomes unnatural even if it is impressive?", cluster: "D", signalYes: ["B", "M"] },

    // CLUSTER E — LIFE INTEGRATION
    { id: 45, text: "Can you live with a system that does not flatter everything?", cluster: "E", signalYes: ["B"] },

    // CLUSTER F — SELF-AWARENESS
    { id: 54, text: "Can you wait before forming conclusions?", cluster: "F", signalYes: ["B", "S"] },

    // CLUSTER G — SOCIAL STABILITY
    { id: 64, text: "Can you respect different listening preferences?", cluster: "G", signalYes: ["B", "S"] },

    // CLUSTER H — TIME RELIABILITY
    { id: 76, text: "Can you trust sound across time, not moments?", cluster: "H", signalYes: ["B", "S"] }
];
