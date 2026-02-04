import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EngineeringNotesProps {
    notes: string;
    defaultExpanded?: boolean;
}

export const EngineeringNotes = ({ notes, defaultExpanded = false }: EngineeringNotesProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const hasNotes = notes && notes.length > 0;
    const isLong = hasNotes && notes.length > 300; // Increased threshold slightly

    if (!hasNotes) {
        return (
            <div className="mb-10 border-t border-b border-white/5 py-8 opacity-50">
                <h3 className="text-xs font-mono text-textDim uppercase tracking-[0.2em] mb-2">Engineering Notes</h3>
                <p className="text-sm italic font-sans text-textDim/50">Data archival pending...</p>
            </div>
        );
    }

    // Function to render text with highlighted headers
    const renderContent = () => {
        const lines = notes.split('\n');
        return lines.map((line, i) => {
            const trimmed = line.trim();
            // Detect Uppercase Headers (e.g. "WOOFER", "TWEETER") - strictly letters and spaces, longer than 2 chars
            const isHeader = trimmed.length > 2 && /^[A-Z\s]+$/.test(trimmed) && /[A-Z]/.test(trimmed);

            if (isHeader) {
                return (
                    <span key={i} className="block text-white font-bold tracking-widest text-xs mt-6 mb-2 border-l-2 border-custom-gold/50 pl-3">
                        {line}
                    </span>
                );
            }
            return (
                <span key={i} className="block min-h-[1em] mb-1">
                    {line}
                </span>
            );
        });
    };

    return (
        <div className="mb-10 border-t border-b border-white/5 py-8 group animate-in slide-in-from-bottom-4 duration-700">
            <div
                className="flex justify-between items-center cursor-pointer mb-6"
                onClick={() => setExpanded(!expanded)}
            >
                <h3 className="text-xs font-mono text-custom-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-custom-gold rounded-full shadow-[0_0_5px_gold]"></span>
                    Engineering Notes
                </h3>
                <button className="text-textDim hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            <div className="relative">
                <div
                    className={`text-textDim/80 font-sans leading-relaxed text-sm md:text-base transition-all duration-500 ease-in-out overflow-hidden ${expanded ? 'max-h-[3000px] opacity-100' : 'max-h-[6em] opacity-80'}`}
                >
                    {renderContent()}
                </div>

                {!expanded && isLong && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg via-bg/90 to-transparent pointer-events-none flex items-end justify-center">
                    </div>
                )}
            </div>

            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 text-[10px] font-mono uppercase tracking-widest text-custom-gold/70 hover:text-custom-gold transition-colors border-b border-transparent hover:border-custom-gold/50 pb-0.5 flex items-center gap-2"
                >
                    {expanded ? (
                        <>Contract Brief <ChevronUp className="w-3 h-3" /></>
                    ) : (
                        <>Read Full Brief <ChevronDown className="w-3 h-3" /></>
                    )}
                </button>
            )}
        </div>
    );
};
