import { useState, useMemo } from 'react';
import { ShieldCheck, Layers, ChevronRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface Brand {
    id: string;
    name: string;
    modelCount: number;
    verifiedCount: number;
    letter: string;
}

interface BrandGridProps {
    brands: Brand[];
    onSelectBrand: (brandId: string) => void;
}

const ALPHABET = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BrandGrid = ({ brands, onSelectBrand }: BrandGridProps) => {
    const [activeLetter, setActiveLetter] = useState('D'); // Start with D for Diatone focus? Or A. Let's stick to A or widely available. Defaulting to A is safe, but D shows more data usually. Let's keep A.
    // Changing default to 'A' to match previous behavior

    // Quick fix: User likely wants to see data. If A has nothing, might look empty. 
    // But adhering to standard first.

    const groupedBrands = useMemo(() => {
        const groups: Record<string, Brand[]> = {};
        ALPHABET.forEach(l => groups[l] = []);

        brands.forEach(b => {
            let first = b.letter.toUpperCase();
            if (!ALPHABET.includes(first)) first = "#";
            groups[first].push(b);
        });
        return groups;
    }, [brands]);

    // Auto-select first letter with brands if 'A' is empty? 
    // Leaving purely reactive for now.

    const activeBrands = groupedBrands[activeLetter] || [];

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Alphabet Nav */}
            <div className="flex flex-col items-center gap-4">
                <div className="text-xs font-mono text-cyan tracking-[0.2em]">DIRECTORY INDEX</div>
                <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
                    {ALPHABET.map(char => {
                        const count = groupedBrands[char].length;
                        const isActive = activeLetter === char;

                        return (
                            <button
                                key={char}
                                onClick={() => setActiveLetter(char)}
                                disabled={count === 0}
                                className={`
                                    relative w-10 h-10 flex items-center justify-center text-sm font-mono border
                                    transition-all duration-300 clip-path-polygon
                                    ${isActive
                                        ? 'bg-cyan/20 border-cyan text-cyan scale-110 z-10 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                                        : count === 0
                                            ? 'border-surfaceHighlight text-textDim/20 cursor-not-allowed'
                                            : 'border-surfaceHighlight text-textDim hover:border-cyan/50 hover:text-cyan hover:bg-surfaceHighlight'
                                    }
                                `}
                            >
                                {char}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan rounded-full box-shadow-neon" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Brand Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeBrands.map(brand => (
                    <GlassCard
                        key={brand.id}
                        onClick={() => onSelectBrand(brand.id)}
                        className="group h-full flex flex-col p-6 min-h-[160px]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-display font-bold text-white group-hover:text-cyan truncate transition-colors">
                                {brand.name}
                            </h3>
                            {brand.verifiedCount > 0 && (
                                <div className="bg-cyan/10 p-1 rounded border border-cyan/20">
                                    <ShieldCheck className="w-5 h-5 text-cyan" />
                                </div>
                            )}
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-textDim">Catalog</span>
                                <span className="text-xl font-mono text-white flex items-center gap-2">
                                    {brand.modelCount}
                                    <span className="text-xs text-textDim">ITERATIONS</span>
                                </span>
                            </div>

                            <div className="flex items-end justify-end">
                                <span className="flex items-center gap-1 text-cyan font-mono text-xs opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    ACCESS_DATA <ChevronRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-0 right-0 p-12 bg-cyan/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan/10 transition-colors" />
                    </GlassCard>
                ))}
            </div>

            {activeBrands.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-surfaceHighlight rounded-lg bg-surface/20">
                    <Layers className="w-12 h-12 text-textDim/20 map-brand-icon" />
                    <p className="mt-4 text-text/40 font-mono">NO SIGNALS DETECTED IN SECTOR '{activeLetter}'</p>
                </div>
            )}
        </div>
    );
};

export default BrandGrid;
