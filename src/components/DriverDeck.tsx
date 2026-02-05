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

            let content = normalizedText.slice(startIndex, endIndex).trim();

            // Fix for "NetworkIn" style concatenation artifacts
            if (content.toLowerCase().startsWith(title.toLowerCase())) {
                content = content.slice(title.length).trim();
            }

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
                            ? 'bg-custom-gold/10 border-custom-gold/50 shadow-[inset_0_1px_3px_rgba(255,215,0,0.2),0_10px_30px_-10px_rgba(255,215,0,0.1)]'
                            : 'bg-surface/80 border-white/5 hover:border-custom-gold/30 hover:bg-surfaceHighlight shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                            }`}
                    >
                        {/* Background Scanline (Hover) */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-custom-gold/40 transition-colors"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-custom-gold/40 transition-colors"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-start justify-between mb-4">
                                <section.icon className={`w-5 h-5 stroke-[1.5] ${activeSection === section.id ? 'text-custom-gold' : 'text-textDim group-hover:text-custom-gold/80'
                                    } transition-colors`} />
                                <div className={`text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 border ${activeSection === section.id ? 'border-custom-gold/40 text-custom-gold bg-custom-gold/5' : 'border-white/5 text-textDim group-hover:border-custom-gold/20'
                                    } transition-colors`}>
                                    SYS_MOD_0{parsedSections.indexOf(section) + 1}
                                </div>
                            </div>

                            <div>
                                <h4 className={`text-xs font-bold font-mono uppercase tracking-widest mb-1 ${activeSection === section.id ? 'text-custom-gold' : 'text-textDim group-hover:text-white'
                                    } transition-colors`}>
                                    {section.title}
                                </h4>
                                <div className={`h-px w-6 transition-all duration-500 rounded-full ${activeSection === section.id ? 'bg-custom-gold w-full' : 'bg-white/10 group-hover:bg-custom-gold/50 group-hover:w-12'}`}></div>
                                {/* Preview Text (First Sentence-ish) */}
                                <p className="mt-3 text-[9px] text-textDim/50 font-mono line-clamp-2 leading-relaxed uppercase tracking-tight">
                                    {section.content.match(/^[^.]+(?:\.[^.]+)*?\./)?.[0] || section.content.slice(0, 50) + '...'}
                                </p>
                            </div>
                        </div>

                        {/* Top Indicator Line */}
                        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-custom-gold transition-transform duration-500 origin-left ${activeSection === section.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                            }`}></div>
                    </button>
                ))}
            </div>

            {/* Detailed View Panel */}
            <div className={`overflow-hidden transition-all duration-500 ease-out border-x border-b border-white/10 bg-[#050505] shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] ${activeSection ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                {activeSection && (
                    <div className="p-10 relative">
                        {/* Industrial Decorators */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <div className="text-[10px] font-mono text-right leading-tight">
                                SYS_LINK_ESTABLISHED<br />
                                BYTES_EXTRACTED: 2048<br />
                                STATUS: NOMINAL
                            </div>
                        </div>

                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] animate-scan-y"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-px bg-custom-gold/30"></div>
                                <div className="flex items-center gap-2 text-custom-gold font-mono text-[10px] uppercase tracking-[0.3em]">
                                    <ChevronRight className="w-3 h-3 animate-pulse" />
                                    DEEP_ANALYSIS // {parsedSections.find(s => s.id === activeSection)?.title}
                                </div>
                                <div className="flex-1 h-px bg-white/5"></div>
                            </div>

                            <div className="md:pl-11">
                                <p className="text-sm md:text-base text-textDim/90 leading-relaxed font-sans border-l border-custom-gold/20 pl-8 relative">
                                    {/* Quote Mark Decorator */}
                                    <span className="absolute -left-1 top-0 bottom-0 w-px bg-gradient-to-b from-custom-gold to-transparent opacity-20"></span>
                                    {parsedSections.find(s => s.id === activeSection)?.content}
                                </p>

                                <div className="mt-8 flex items-center gap-4 text-[9px] font-mono text-textDim/30 uppercase tracking-[0.2em]">
                                    <span>CRC_OK</span>
                                    <span className="w-1 h-1 rounded-full bg-custom-gold/20"></span>
                                    <span>TIMESTAMP: {new Date().toLocaleTimeString()}</span>
                                    <span className="flex-1"></span>
                                    <span className="text-custom-gold/40 animate-pulse">READING...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
