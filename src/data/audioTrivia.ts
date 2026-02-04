export interface TriviaQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number; // 0-based index
    explanation: string;
    mythLabel?: string;
}

export const SONIC_TRIVIA: TriviaQuestion[] = [
    {
        id: 'hearing-range',
        question: "What is the actual hearing limit for most healthy adults over 25?",
        options: [
            "20 Hz - 20,000 Hz",
            "15 Hz - 25,000 Hz",
            "20 Hz - 16,000 Hz",
            "20 Hz - 14,000 Hz"
        ],
        correctIndex: 2,
        explanation: "While textbooks say 20-20k, real-world biology degrades high-frequency sensitivity. Most adults lose sensitivity above 16kHz naturally. The 'standard' 20kHz is a marketing convention, not a biological guarantee for adults.",
        mythLabel: "The 20-20k Myth"
    },
    {
        id: 'speed-of-sound',
        question: "Does Bass travel slower than Treble?",
        options: [
            "Yes, that's why subwoofers need to be closer.",
            "No, speed of sound is constant in a medium.",
            "Yes, low waves are heavier.",
            "No, but it accelerates over distance."
        ],
        correctIndex: 1,
        explanation: "The speed of sound is fixed by the medium (air). 20Hz and 20kHz travel at the exact same speed (approx 343 m/s). 'Slow Bass' is usually a room mode issue or varying driver decay, not propagation speed.",
        mythLabel: "The Fast Bass Myth"
    },
    {
        id: 'beryllium-speed',
        question: "Why is Beryllium highly prized for tweeter domes?",
        options: [
            "It is the most expensive metal.",
            "It has a high Propagation Velocity (12.8 km/s).",
            "It adds a nice 'sparkle' to the sound.",
            "It is heavier than titanium."
        ],
        correctIndex: 1,
        explanation: "Beryllium's incredible stiffness-to-weight ratio allows sound to travel through it at 12.8 km/s (vs 5 km/s for Titanium). This pushes the breakup mode (distortion) to ~50kHz, far outside human hearing.",
        mythLabel: "Material Science"
    },
    {
        id: 'musicality-trap',
        question: "According to Serio Grading, what is 'False Musicality'?",
        options: [
            "A system that plays too fast.",
            "A system that is too detailed.",
            "Using warmth/roll-off to hide flaws.",
            "A system that only plays classical music."
        ],
        correctIndex: 2,
        explanation: "True Musicality is about flow and cohesion. 'False Musicality' is when a system is deliberately 'warm', muddy, or rolled-off to mask poor recordings or technical incompetence. It's a color, not a virtue.",
        mythLabel: "The Warmth Trap"
    },
    {
        id: 'analytical-trap',
        question: "What distinguishes 'True Analytical' from 'False Analytical'?",
        options: [
            "True Analytical uses silver cables.",
            "False Analytical boosts treble to fake detail.",
            "True Analytical sounds boring.",
            "False Analytical is too expensive."
        ],
        correctIndex: 1,
        explanation: "False Analytical gear simply boosts the treble (brightness) to make you think there is more detail. True Analytical achieves resolution through a lower noise floor and better transient speed, without artificial brightness.",
        mythLabel: "The Clarity Trap"
    },
    {
        id: 'class-a-heat',
        question: "Why do Class A amplifiers run so hot?",
        options: [
            "They use old tubes.",
            "They are broken.",
            "They effectively waste power to run at 100% capacity constantly.",
            "They are designed to heat the room."
        ],
        correctIndex: 2,
        explanation: "Class A transistors conduct 360° of the cycle, meaning they are fully 'on' all the time, even when playing silence. This eliminates crossover distortion but generates massive heat as a byproduct."
    },
    {
        id: 'ultrasonics',
        question: "If we can't hear above 20kHz, why do we need 50kHz bandwith?",
        options: [
            "We don't, it's a scam.",
            "To let dogs enjoy the music.",
            "Bandwidth acts as a 'Margin' to keep phase shift out of the audible band.",
            "To play High-Res Audio files."
        ],
        correctIndex: 2,
        explanation: "Ultrasonic bandwidth isn't about hearing dog whistles. It provides a safety margin. Electronic phase shift affects frequencies roughly 1/10th of the limit. A 50kHz ceiling ensures the phase remains linear down to 5kHz (where we are very sensitive)."
    }
];
