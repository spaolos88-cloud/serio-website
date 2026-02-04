import { Beaker } from 'lucide-react';

interface MaterialLabProps {
    description: string;
    tags: string[];
}

interface ElementDef {
    symbol: string;
    name: string;
    atomicNumber: number;
    color: string; // Tailwind class or hex
    keywords: string[];
}

const MATERIAL_DB: ElementDef[] = [
    { symbol: 'B', name: 'Boron', atomicNumber: 5, color: 'text-orange-400', keywords: ['boron', 'boronized'] },
    { symbol: 'Ti', name: 'Titanium', atomicNumber: 22, color: 'text-blue-400', keywords: ['titanium', 'omega-titanium', 'ω-titanium'] },
    { symbol: 'C', name: 'Carbon', atomicNumber: 6, color: 'text-gray-400', keywords: ['carbon', 'graphite', 'cloth'] },
    { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, color: 'text-emerald-400', keywords: ['beryllium'] },
    { symbol: 'Al', name: 'Alnico', atomicNumber: 13, color: 'text-red-400', keywords: ['alnico'] }, // Alnico is an alloy but often cited as a key material feature
    { symbol: 'Hc', name: 'Honeycomb', atomicNumber: 0, color: 'text-yellow-400', keywords: ['honeycomb'] }, // Structural "Element"
    { symbol: 'Ce', name: 'Ceramic', atomicNumber: 0, color: 'text-white', keywords: ['ceramic'] },
    { symbol: 'Pl', name: 'Plasma', atomicNumber: 0, color: 'text-purple-400', keywords: ['plasma'] },
    { symbol: 'Di', name: 'Diamond', atomicNumber: 6, color: 'text-cyan-200', keywords: ['diamond'] },
];

export const MaterialLab = ({ description, tags }: MaterialLabProps) => {
    // Scan content for materials
    const detectedMaterials = MATERIAL_DB.filter(elem => {
        const searchText = (description + ' ' + tags.join(' ')).toLowerCase();
        return elem.keywords.some(k => searchText.includes(k));
    });

    if (detectedMaterials.length === 0) return null;

    return (
        <div className="mb-12 border-l border-white/5 pl-6 md:pl-8 py-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
            <h3 className="text-[10px] font-mono text-textDim uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Beaker className="w-3 h-3" /> Material Composition
            </h3>

            <div className="flex flex-col gap-3">
                {detectedMaterials.map((mat) => (
                    <div key={mat.symbol} className="flex items-center gap-4 group">
                        {/* Element Box */}
                        <div className={`w-12 h-12 border border-white/10 bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden group-hover:border-custom-gold/30 transition-colors`}>
                            {/* Atomic Number */}
                            {mat.atomicNumber > 0 && (
                                <span className="absolute top-1 left-1.5 text-[7px] text-textDim font-mono">
                                    {mat.atomicNumber}
                                </span>
                            )}
                            {/* Symbol */}
                            <span className={`text-lg font-bold font-serif ${mat.color} group-hover:scale-110 transition-transform`}>
                                {mat.symbol}
                            </span>

                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none ${mat.color}`}></div>
                        </div>

                        {/* Name */}
                        <div>
                            <span className={`text-xs font-bold font-mono uppercase tracking-wider ${mat.color} opacity-80 group-hover:opacity-100`}>
                                {mat.name}
                            </span>
                            <div className="h-px bg-white/10 w-12 group-hover:w-full transition-all duration-500 mt-1"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
