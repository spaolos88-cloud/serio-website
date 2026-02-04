
import type { QuizQuestion, AudioUnit } from './types';
import { AudioGrade, PerformanceClass } from './types';

export const QUESTIONS: QuizQuestion[] = [
  { id: 1, text: "Can you listen to music for over an hour without feeling mentally tired?", cluster: "Endurance", impact: "M+" },
  { id: 2, text: "Do you ever feel relieved when the music stops?", cluster: "Endurance", impact: "F+" },
  { id: 3, text: "After long listening sessions, do your ears feel strained?", cluster: "Endurance", impact: "F+" },
  { id: 21, text: "Can you enjoy music without actively focusing on it?", cluster: "Attention", impact: "M+" },
  { id: 22, text: "Do you need to concentrate to appreciate sound quality?", cluster: "Attention", impact: "A+" },
  { id: 36, text: "Do you notice when sounds stop abruptly?", cluster: "Decay", impact: "M+" },
  { id: 43, text: "Does natural fading of sound matter to you?", cluster: "Decay", impact: "M+" },
  { id: 51, text: "Do you look for an immediate 'wow' when listening?", cluster: "Stimulation", impact: "C+" },
  { id: 55, text: "Does subtle sound feel boring to you?", cluster: "Stimulation", impact: "C+" },
  { id: 66, text: "Do you often feel the urge to change something while listening?", cluster: "Stability", impact: "C+" },
  { id: 68, text: "Can you leave a system unchanged for long periods?", cluster: "Stability", impact: "S+" },
  { id: 81, text: "Does music still feel complete at low volume?", cluster: "Real-World", impact: "M+" },
  { id: 86, text: "Do you increase volume to feel more detail?", cluster: "Real-World", impact: "A+" },
  { id: 101, text: "Do you value comfort over precision?", cluster: "Final", impact: "M+" },
  { id: 106, text: "Do you care more about how sound feels than how it measures?", cluster: "Final", impact: "M+" }
];

export const INITIAL_ARCHIVE: AudioUnit[] = [
  {
    id: "1",
    name: "NS-1000M",
    brand: "Yamaha",
    category: "Speakers",
    // Fix: Changed 'identity' to 'grade' to match AudioUnit interface
    grade: AudioGrade.AUDIOPHILE,
    performance: PerformanceClass.LEGEND,
    score: 9.8,
    specs: { "Type": "3-way", "Woofer": "30cm Carbon", "Mid": "8.8cm Beryllium", "Tweeter": "3cm Beryllium", "Weight": "31kg" },
    description: "The definitive Beryllium monitor; world-renowned for its unmatched midrange transparency and transient speed.",
    heritage: true
  },
  {
    id: "2",
    name: "AU-alpha907KX",
    brand: "Sansui",
    category: "Amplifiers",
    // Fix: Changed 'identity' to 'grade' to match AudioUnit interface
    grade: AudioGrade.AUDIOPHILE,
    performance: PerformanceClass.S,
    score: 9.5,
    specs: { "Power": "160W+160W", "Weight": "33kg", "Circuit": "alpha-X Balanced" },
    description: "The definitive reference of the Alpha-series; known for extreme bass control and a massive, holographic soundstage.",
    heritage: true
  },
  {
    id: "3",
    name: "901 Series VI",
    brand: "Bose",
    category: "Speakers",
    // Fix: Changed 'identity' to 'grade' to match AudioUnit interface
    grade: AudioGrade.HIFI,
    performance: PerformanceClass.A,
    score: 8.2,
    specs: { "Type": "Direct/Reflecting", "Drivers": "9 Full-range", "EQ": "Active required" },
    description: "Flagship Direct/Reflecting speaker, famous for its massive soundstage and room filling capability."
  },
  {
    id: "4",
    name: "DC-300A",
    brand: "Amcron (Crown)",
    category: "Amplifiers",
    // Fix: Changed 'identity' to 'grade' to match AudioUnit interface
    grade: AudioGrade.PA,
    performance: PerformanceClass.A,
    score: 8.8,
    specs: { "Power": "150W (8ohm)", "THD": "0.05%", "Damping": "700" },
    description: "Virtually indestructible professional amplifier used in every major studio. Defined solid state power."
  },
  {
    id: "5",
    name: "LS3/5a",
    brand: "Rogers",
    category: "Speakers",
    // Fix: Changed 'identity' to 'grade' to match AudioUnit interface
    grade: AudioGrade.AUDIOPHILE,
    performance: PerformanceClass.LEGEND,
    score: 9.4,
    specs: { "Impedance": "15 ohm", "Sensitivity": "82.5dB", "Standard": "BBC Licensed" },
    description: "The 15-ohm gold standard monitor for vocals and small-room acoustics.",
    heritage: true
  },
  {
    id: "6",
    name: "PMA-2000",
    brand: "Denon",
    category: "Amplifiers",
    // Fix: Changed 'identity' to 'grade' to match AudioUnit interface
    grade: AudioGrade.HIFI,
    performance: PerformanceClass.A,
    score: 8.7,
    specs: { "Power": "80W+80W", "Current": "UHC-MOS", "Weight": "20kg" },
    description: "The legendary 'Workhorse' series; known for high-current capability and incredible reliability."
  }
];
