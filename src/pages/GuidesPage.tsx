import { useState } from 'react';
import { BookOpen, PenTool, History, Cpu, ArrowLeft, Clock, BrainCircuit, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { SONIC_TRIVIA } from '../data/audioTrivia';

interface Article {
    id: string;
    title: string;
    category: 'MAINTENANCE' | 'HISTORY' | 'THEORY';
    summary: string;
    readTime: string;
    content: React.ReactNode;
}

const ARTICLES: Article[] = [
    {
        id: 'cap-replacement',
        title: 'Capacitor Replacement Protocols',
        category: 'MAINTENANCE',
        summary: 'When and why to recap vintage amplifiers. Guidelines for selecting electrolytic vs. film capacitors for signal paths.',
        readTime: '8 min read',
        content: (
            <div className="space-y-4 text-text/80 leading-relaxed">
                <p>
                    <strong>The 30-Year Rule:</strong> Electrolytic capacitors are chemical devices. Most vintage gear from the 70s and 80s has exceeded its service life.
                    Dried-out electrolyte leads to drift in values, loss of bass response, and catastrophic failure if shorts occur.
                </p>
                <h3 className="text-custom-gold font-bold text-lg mt-6">Signal Path vs. Power Supply</h3>
                <p>
                    <strong>Power Supply:</strong> Use high-ripple, high-temp (105°C) modern electrolytics (e.g., Nichicon PW/HE). Go up in voltage rating, keep capacitance similar (max +20%).
                </p>
                <p>
                    <strong>Signal Path:</strong> This is where "voicing" happens. Replacing an Elna Silmic with a generic cap will ruin the warm signature.
                    Consider polypropylene film caps (WIMA, Panasonic ECW) for values under 4.7uF.
                </p>
            </div>
        )
    },
    {
        id: 'yamaha-beryllium',
        title: 'The Beryllium Legacy: Yamaha NS Series',
        category: 'HISTORY',
        summary: 'Deep dive into the vapor-deposition manufacturing process of the NS-1000M tweeter and its toxicity risks.',
        readTime: '12 min read',
        content: (
            <div className="space-y-4 text-text/80 leading-relaxed">
                <p>
                    In 1974, Yamaha achieved what was considered impossible: pure Beryllium domes.
                    Unlike stamped alloys, Yamaha used a vapor-deposition process where Be gas settled onto a copper mold in a vacuum.
                </p>
                <h3 className="text-custom-gold font-bold text-lg mt-6">Is it Dangerous?</h3>
                <p>
                    <strong>Solid Be is safe.</strong> The danger lies in dust (inhalation).
                    <strong>DO NOT</strong> disassemble or vacuum a cracked Be dome. If the dome is intact, it poses zero risk.
                </p>
                <p>
                    The <strong>Propagation Velocity</strong> (speed of sound <em>within</em> the material) of Beryllium is 12.8 km/s, compared to just 5 km/s for Titanium.
                </p>
                <div className="bg-custom-gold/10 border border-custom-gold/20 p-4 rounded text-xs font-mono my-4">
                    <strong>PHYSICS NOTE:</strong> Do not confuse this with the speed of sound in air (343 m/s).
                    Faster propagation in the metal means the dome is stiffer and reacts instantly.
                    This pushes "breakup modes" (distortion) to 50kHz—far beyond human hearing—eliminating the harshness found in other hard domes.
                </div>
            </div>
        )
    },
    {
        id: 'class-a-bias',
        title: 'Class A vs Class AB: Thermal Dynamics',
        category: 'THEORY',
        summary: 'Understanding bias current, crossover distortion, and why your Pioneer M-22 runs hot enough to fry an egg.',
        readTime: '6 min read',
        content: (
            <div className="space-y-4 text-text/80 leading-relaxed">
                <p>
                    <strong>Class A</strong> means the output transistors conduct 360 degrees of the input cycle.
                    They never switch off. This eliminates "crossover distortion" (the glitch when handing off the signal from one transistor to the other).
                </p>
                <h3 className="text-custom-gold font-bold text-lg mt-6">The Cost of Purity</h3>
                <p>
                    A 30W Class A amp consumes max power <em>all the time</em>, even at idle.
                    A Pioneer M-22 dissipates massive heat. Ensure at least 6 inches of clearance above any vintage Class A unit.
                    Thermal cycling is the enemy of solder joints.
                </p>
            </div>
        )
    }
];

const CategoryIcon = ({ cat }: { cat: string }) => {
    switch (cat) {
        case 'MAINTENANCE': return <PenTool className="w-4 h-4" />;
        case 'HISTORY': return <History className="w-4 h-4" />;
        case 'THEORY': return <Cpu className="w-4 h-4" />;
        default: return <BookOpen className="w-4 h-4" />;
    }
};

const TriviaWidget = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [score, setScore] = useState(0);

    // Randomize order on mount (simple shuffle for now)
    // const shuffledQuestions = useMemo(() => [...SONIC_TRIVIA].sort(() => Math.random() - 0.5), []);
    // Sticking to static order for demo stability
    const question = SONIC_TRIVIA[currentQuestionIndex];

    const handleAnswer = (index: number) => {
        if (isRevealed) return;
        setSelectedOption(index);
        setIsRevealed(true);
        if (index === question.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setIsRevealed(false);
        setCurrentQuestionIndex(prev => (prev + 1) % SONIC_TRIVIA.length);
    };

    return (
        <div className="border border-custom-gold/20 bg-[#0a0a0a] rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <BrainCircuit className="w-24 h-24 text-custom-gold" />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="bg-custom-gold/10 text-custom-gold px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest border border-custom-gold/20">
                    Knowledge Check
                </span>
                {question.mythLabel && (
                    <span className="text-red-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        {question.mythLabel}
                    </span>
                )}
            </div>

            <h3 className="text-lg font-bold text-white mb-6 leading-snug min-h-[3rem]">
                {question.question}
            </h3>

            <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isRevealed}
                        className={`w-full text-left p-3 rounded text-sm font-medium transition-all ${isRevealed
                            ? idx === question.correctIndex
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                : idx === selectedOption
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                                    : 'bg-surface/30 text-text/30 border border-transparent'
                            : 'bg-surface/50 text-text/80 hover:bg-custom-gold/10 hover:text-custom-gold border border-transparent hover:border-custom-gold/30'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs opacity-50">{String.fromCharCode(65 + idx)}.</span>
                            {option}
                            {isRevealed && idx === question.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 ml-auto" />
                            )}
                            {isRevealed && idx === selectedOption && idx !== question.correctIndex && (
                                <XCircle className="w-4 h-4 ml-auto" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {isRevealed && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white/5 border-l-2 border-custom-gold p-4 mb-4 text-sm text-textDim leading-relaxed">
                        <span className="text-custom-gold font-bold font-mono text-xs uppercase block mb-1">Sonic Lab Insight:</span>
                        {question.explanation}
                    </div>
                    <button
                        onClick={nextQuestion}
                        className="w-full py-3 bg-custom-gold text-bg font-bold text-xs uppercase tracking-widest rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                        Next Challenge <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            )}

            <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-text/20 uppercase tracking-widest">
                <span>Subject: {currentQuestionIndex + 1} / {SONIC_TRIVIA.length}</span>
                <span>Score: {score}</span>
            </div>
        </div>
    );
};

const GuidesPage = () => {
    const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

    const activeArticle = ARTICLES.find(a => a.id === activeArticleId);

    // Reading Mode
    if (activeArticle) {
        return (
            <div className="max-w-3xl mx-auto min-h-[60vh] animate-in slide-in-from-right-10 duration-500">
                <button
                    onClick={() => setActiveArticleId(null)}
                    className="flex items-center gap-2 text-text/60 hover:text-custom-gold mb-8 transition-colors text-sm font-mono"
                >
                    <ArrowLeft className="w-4 h-4" /> BACK TO MANUALS
                </button>

                <div className="border border-surface/50 bg-surface/10 rounded-xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-custom-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex items-center gap-3 font-mono text-xs text-custom-gold mb-4">
                        <span className="flex items-center gap-1 border border-custom-gold/20 px-2 py-1 rounded bg-bg">
                            <CategoryIcon cat={activeArticle.category} /> {activeArticle.category}
                        </span>
                        <span className="flex items-center gap-1 text-text/40">
                            <Clock className="w-3 h-3" /> {activeArticle.readTime}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">{activeArticle.title}</h1>

                    <div className="prose prose-invert prose-p:text-text/80 prose-headings:text-text max-w-none">
                        {activeArticle.content}
                    </div>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div className="space-y-8 animate-in fade-in duration-700 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-surface pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-text">
                        Lab Manuals
                    </h1>
                    <p className="text-text/60 max-w-xl font-mono text-sm">
                        Technical documentation, restoration protocols, and theory.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column (2/3) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ARTICLES.map(article => (
                        <div
                            key={article.id}
                            onClick={() => setActiveArticleId(article.id)}
                            className="group relative bg-surface/20 border border-surface hover:border-custom-gold/50 rounded-lg p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(255,215,0,0.15)]"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-custom-gold/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-custom-gold/80">
                                <CategoryIcon cat={article.category} />
                                {article.category}
                            </div>

                            <h3 className="text-xl font-bold text-text mb-3 group-hover:text-custom-gold transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-sm text-text/60 leading-relaxed mb-6">
                                {article.summary}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-mono text-text/30 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {article.readTime}
                                </span>
                                <span className="text-custom-gold text-xs font-bold font-mono opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    READ PROTOCOL &rarr;
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Coming Soon Card */}
                    <div className="border border-dashed border-surface rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-50 min-h-[200px]">
                        <BookOpen className="w-8 h-8 text-text/20 mb-3" />
                        <h3 className="text-sm font-bold text-text/40">More Guides Incoming</h3>
                        <p className="text-xs text-text/20 mt-1">Archive staff is digitizing microfiche.</p>
                    </div>
                </div>

                {/* Sidebar Column (1/3) - Trivia Widget */}
                <div className="lg:col-span-1 space-y-8">
                    <TriviaWidget />
                </div>
            </div>
        </div>
    );
};

export default GuidesPage;
