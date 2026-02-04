import { useState, useMemo } from 'react';
import { Speaker, Radio, Zap, ChevronRight, Disc } from 'lucide-react';

interface DriverDeckProps {
    description: string;
}

interface DriverSection {
    id: 'woofer' | 'midrange' | 'tweeter' | 'network' | 'enclosure' | 'other';
    title: string;
    content: string;
    icon: React.ElementType;
}

export const DriverDeck = ({ description }: DriverDeckProps) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const parsedSections = useMemo(() => {
        if (!description) return [];

        const sections: DriverSection[] = [];
        const normalizedText = description.replace(/\r\n/g, '\n');

        // Regex to find headers like "WOOFER", "MIDRANGE", "TWEETER", "NETWORK", "ENCLOSURE"
        // We look for Uppercase words on their own line
        const headerRegex = /(?:^|\n)([A-Z]{3,})(?:\n)/g;

        let lastIndex = 0;
        let match;

        // Known headers to icons/ids
        const config: Record<string, { id: DriverSection['id']; icon: React.ElementType }> = {
            'WOOFER': { id: 'woofer', icon: Disc },
            'MIDRANGE': { id: 'midrange', icon: Radio }, // Using Radio as a placeholder for squaker/mid
            'TWEETER': { id: 'tweeter', icon: Zap },     // Zap for high frequency
            'NETWORK': { id: 'network', icon: Speaker }, // Speaker generic for network/crossover
            'ENCLOSURE': { id: 'enclosure', icon: BoxIcon },
        };

        // Helper for default icon if not found
        function BoxIcon(props: any) {
            return (
                <svg
                    {...props}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
            );
        }

        // We need to capture content between headers.
        // A simple split strategy might be easier given the strict formatting guidelines.
        // Let's iterate through matches to find start/end indices.

        const matches = [...normalizedText.matchAll(headerRegex)];

        matches.forEach((m, index) => {
            const title = m[1];
            const startIndex = m.index! + m[0].length;
            const endIndex = matches[index + 1] ? matches[index + 1].index! : normalizedText.length;

            const content = normalizedText.slice(startIndex, endIndex).trim();
            const conf = config[title] || { id: 'other', icon: BoxIcon };

            if (content.length > 0 && conf.id !== 'other') { // Only add known sections for the Deck
                sections.push({
                    id: conf.id,
                    title: title,
                    content: content,
                    icon: conf.icon
                });
            }
        });

        // If no sections found (legacy format), return empty
        return sections;

    }, [description]);

    if (parsedSections.length === 0) return null;

    return (
        <div className="mb-16 animate-in fade-in duration-700">
            <h3 className="text-xs font-mono text-custom-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Speaker className="w-3 h-3" /> Acoustic Architecture
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-2">
                {parsedSections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className={`group relative p-6 text-left border transition-all duration-300 overflow-hidden ${activeSection === section.id
                            ? 'bg-custom-gold/10 border-custom-gold/50'
                            : 'bg-[#0a0a0a] border-white/5 hover:border-custom-gold/30 hover:bg-[#0f0f0f]'
                            }`}
                    >
                        {/* Background Scanline (Hover) */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-start justify-between mb-4">
                                <section.icon className={`w-6 h-6 stroke-[1.5] ${activeSection === section.id ? 'text-custom-gold' : 'text-textDim group-hover:text-custom-gold/80'
                                    } transition-colors`} />
                                <div className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border ${activeSection === section.id ? 'border-custom-gold text-custom-gold' : 'border-white/10 text-textDim group-hover:border-custom-gold/30'
                                    } transition-colors`}>
                                    UNIT-0{parsedSections.indexOf(section) + 1}
                                </div>
                            </div>

                            <div>
                                <h4 className={`text-sm font-bold font-mono uppercase tracking-wider mb-1 ${activeSection === section.id ? 'text-white' : 'text-white/80'
                                    }`}>
                                    {section.title}
                                </h4>
                                <div className="h-0.5 w-8 bg-current opacity-20 group-hover:w-full transition-all duration-500 rounded-full"></div>
                                {/* Preview Text (First Sentence-ish) */}
                                <p className="mt-3 text-[10px] text-textDim/70 line-clamp-2 leading-relaxed">
                                    {section.content.match(/^[^.]+(?:\.[^.]+)*?\./)?.[0] || section.content.slice(0, 50) + '...'}
                                </p>
                            </div>
                        </div>

                        {/* Expand Indicator */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-custom-gold transition-transform duration-300 origin-left ${activeSection === section.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                            }`}></div>
                    </button>
                ))}
            </div>

            {/* Detailed View Panel */}
            <div className={`overflow-hidden transition-all duration-500 ease-out border-x border-b border-white/10 bg-[#080808] ${activeSection ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                {activeSection && (
                    <div className="p-8 relative">
                        {/* CRT Effect Background */}
                        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>

                        <div className="relative z-10 flex gap-6">
                            <div className="hidden md:block w-px bg-white/10 shrink-0"></div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4 text-custom-gold/60 font-mono text-xs uppercase tracking-widest">
                                    <ChevronRight className="w-4 h-4" />
                                    System Analysis: {parsedSections.find(s => s.id === activeSection)?.title}
                                </div>
                                <p className="text-sm md:text-base text-textDim leading-8 font-sans border-l-2 border-custom-gold/20 pl-6">
                                    {parsedSections.find(s => s.id === activeSection)?.content}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
