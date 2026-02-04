import { useState } from 'react';
import {
    X, Search, ChevronDown, ChevronUp,
    Award, Grid3X3, Clock, Tag,
    Zap, Activity, Settings, Power
} from 'lucide-react';

interface FilterState {
    search: string;
    performanceClass: string[];
    categories: string[];
    decades: string[];
    primaryIntent: string[];
    tags: string[];
    activeSignals: string[];
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    availableCategories: string[];
    availableTags?: string[];
    totalResults: number;
    filteredResults: number;
    healthStats?: {
        gold: number;
        silver: number;
        bronze: number;
        images: number;
        total: number;
    };
}

const PERFORMANCE_CLASSES = [
    { id: 'CLASS_S', label: 'CLASS S', color: 'text-purple bg-purple/10 border-purple/30', dot: 'bg-purple' },
    { id: 'CLASS_A', label: 'CLASS A', color: 'text-cyan bg-cyan/10 border-cyan/30', dot: 'bg-cyan' },
    { id: 'CLASS_B', label: 'CLASS B', color: 'text-green-400 bg-green-400/10 border-green-400/30', dot: 'bg-green-400' },
    { id: 'CLASS_LEGEND', label: 'LEGEND', color: 'text-custom-gold bg-custom-gold/10 border-custom-gold/30', dot: 'bg-custom-gold' },
    { id: 'NOT_DOCUMENTED', label: 'UNDOCUMENTED', color: 'text-textDim bg-white/5 border-white/10', dot: 'bg-textDim' },
];

const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s'];

const PRIMARY_INTENTS = [
    { id: 'MUSICAL', label: 'Musical' },
    { id: 'ANALYTICAL', label: 'Analytical' },
    { id: 'BALANCED', label: 'Balanced' },
    { id: 'CONSUMER', label: 'Consumer' },
];

const SIGNALS = [
    { id: 'M', label: 'Musicality', color: 'bg-rose-500' },
    { id: 'A', label: 'Analytical', color: 'bg-cyan' },
    { id: 'S', label: 'Stability', color: 'bg-emerald-500' },
    { id: 'R', label: 'Reference', color: 'bg-purple-500' },
    { id: 'V', label: 'Volume', color: 'bg-orange-500' },
    { id: 'C', label: 'Consumer', color: 'bg-yellow-500' },
    { id: 'F', label: 'Fatigue', color: 'bg-slate-500' },
];

const ScrewHead = () => (
    <div className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-white/10 shadow-[inner_0_1px_2px_rgba(0,0,0,1)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-white/20 rotate-45 transform" />
    </div>
);

export default function FilterSidebar({
    filters,
    onFilterChange,
    availableCategories,
    availableTags = [],
    totalResults,
    filteredResults,
    healthStats
}: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        performanceClass: true,
        categories: true,
        decades: true,
        primaryIntent: true,
        signals: true,
        tags: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleFilter = (category: keyof FilterState, value: string) => {
        const current = filters[category] as string[];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        onFilterChange({ ...filters, [category]: updated });
    };

    const clearAllFilters = () => {
        onFilterChange({
            search: '',
            performanceClass: [],
            categories: [],
            decades: [],
            primaryIntent: [],
            tags: [],
            activeSignals: [],
        });
    };

    const activeFilterCount =
        filters.performanceClass.length +
        filters.categories.length +
        filters.decades.length +
        filters.primaryIntent.length +
        filters.tags.length +
        filters.activeSignals.length +
        (filters.search ? 1 : 0);

    return (
        <div className="w-80 flex-shrink-0 bg-[#080808] border-r border-[#222] h-full overflow-y-auto custom-scrollbar flex flex-col relative">
            {/* Rack Mount Rails */}
            <div className="absolute left-1 top-0 bottom-0 w-1 bg-[#151515] border-r border-[#222] z-20 hidden md:block" />
            <div className="absolute right-1 top-0 bottom-0 w-1 bg-[#151515] border-l border-[#222] z-20 hidden md:block" />

            {/* Header Control Panel */}
            <div className="sticky top-0 z-30 bg-[#0d0d0d] border-b-2 border-black shadow-lg p-4 relative">
                <div className="absolute top-2 left-2"><ScrewHead /></div>
                <div className="absolute top-2 right-2"><ScrewHead /></div>

                <div className="flex items-center justify-between mb-4 mt-2">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-textDim" />
                        <h2 className="text-xs font-mono font-bold text-textDim uppercase tracking-[0.2em]">Filter Array</h2>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 bg-black rounded text-[10px] font-mono border border-white/5">
                        <span className="text-textDim">MATCH:</span>
                        <span className={`font-bold ${filteredResults > 0 ? 'text-custom-gold' : 'text-red-500'}`}>
                            {filteredResults}
                        </span>
                    </div>
                </div>

                {/* Search Input (Display Screen Style) */}
                <div className="relative group mb-3">
                    <div className="absolute inset-0 bg-cyan/5 rounded opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-textDim group-focus-within:text-cyan transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH_REGISTRY_V2..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="w-full bg-[#050505] border border-[#333] rounded px-8 py-2 text-xs font-mono text-custom-gold placeholder:text-textDim/30 focus:outline-none focus:border-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all uppercase tracking-wider"
                    />
                    {filters.search && (
                        <button
                            onClick={() => onFilterChange({ ...filters, search: '' })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-textDim hover:text-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                <button
                    onClick={clearAllFilters}
                    disabled={activeFilterCount === 0}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border ${activeFilterCount > 0
                        ? 'bg-red-500/10 border-red-500/40 text-red-500 hover:bg-red-500/20'
                        : 'bg-transparent border-[#222] text-[#444] cursor-not-allowed'
                        }`}
                >
                    <Power className="w-3 h-3" />
                    Global Reset
                </button>
                {/* Health Module */}
                {healthStats && healthStats.total > 0 && (
                    <div className="mb-4 pt-4 border-t border-[#222]">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] font-mono font-bold text-custom-gold tracking-widest uppercase">
                                System Integrity
                            </span>
                            <span className="text-[9px] font-mono text-textDim">
                                {Math.round((healthStats.gold + healthStats.silver) / healthStats.total * 100)}% OPTIMAL
                            </span>
                        </div>

                        {/* Quality Spectrum Bar */}
                        <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden flex mb-2">
                            <div style={{ width: `${healthStats.gold / healthStats.total * 100}%` }} className="h-full bg-custom-gold shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                            <div style={{ width: `${healthStats.silver / healthStats.total * 100}%` }} className="h-full bg-cyan shadow-[0_0_5px_rgba(0,240,255,0.5)]" />
                            <div style={{ width: `${healthStats.bronze / healthStats.total * 100}%` }} className="h-full bg-[#333]" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 px-1">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-custom-gold" />
                                <span className="text-[9px] text-textDim font-mono">GOLD: {healthStats.gold}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                                <span className="text-[9px] text-textDim font-mono">SILVER: {healthStats.silver}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <span className="text-[9px] text-textDim font-mono">IMG: {Math.round(healthStats.images / healthStats.total * 100)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filter Modules */}
            <div className="flex-grow p-2 space-y-2">

                {/* Performance Class Module */}
                <FilterSection
                    title="Class Rating"
                    icon={Award}
                    isOpen={expandedSections.performanceClass}
                    onToggle={() => toggleSection('performanceClass')}
                >
                    <div className="space-y-1 p-2 bg-[#0a0a0a] rounded border border-[#222] shadow-inner">
                        {PERFORMANCE_CLASSES.map((cls) => (
                            <button
                                key={cls.id}
                                onClick={() => toggleFilter('performanceClass', cls.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-sm transition-all duration-150 relative overflow-hidden group ${filters.performanceClass.includes(cls.id)
                                    ? 'bg-[#151515] border-l-2 border-l-custom-gold'
                                    : 'hover:bg-white/5 border-l-2 border-l-transparent text-textDim'
                                    }`}
                            >
                                <span className={`text-[10px] font-mono tracking-wider ${filters.performanceClass.includes(cls.id) ? 'text-white font-bold' : ''}`}>
                                    {cls.label}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full transition-all ${filters.performanceClass.includes(cls.id) ? `${cls.dot} shadow-[0_0_5px_currentColor]` : 'bg-[#222]'}`} />
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Categories Module */}
                <FilterSection
                    title="Equipment Type"
                    icon={Grid3X3}
                    isOpen={expandedSections.categories}
                    onToggle={() => toggleSection('categories')}
                >
                    <div className="grid grid-cols-2 gap-1 p-2 bg-[#0a0a0a] rounded border border-[#222]">
                        <button
                            onClick={() => onFilterChange({ ...filters, categories: [] })}
                            className={`px-2 py-2 text-[9px] font-mono uppercase border transition-all ${filters.categories.length === 0
                                ? 'bg-cyan/20 border-cyan/40 text-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                                : 'bg-[#111] border-[#222] text-textDim hover:border-[#444]'}`}
                        >
                            ALL
                        </button>
                        {availableCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => toggleFilter('categories', cat)}
                                className={`px-2 py-2 text-[9px] font-mono uppercase border transition-all truncate ${filters.categories.includes(cat)
                                    ? 'bg-cyan/20 border-cyan/40 text-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                                    : 'bg-[#111] border-[#222] text-textDim hover:border-[#444]'}`}
                                title={cat}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Intent & Decades */}
                <div className="grid grid-cols-1 gap-2">
                    <FilterSection
                        title="Primary Intent"
                        icon={Zap}
                        isOpen={expandedSections.primaryIntent}
                        onToggle={() => toggleSection('primaryIntent')}
                    >
                        <div className="flex flex-col gap-1 p-1">
                            {PRIMARY_INTENTS.map(intent => (
                                <ModuleToggle
                                    key={intent.id}
                                    label={intent.label}
                                    active={filters.primaryIntent.includes(intent.id)}
                                    onClick={() => toggleFilter('primaryIntent', intent.id)}
                                    activeColor="text-green-400"
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection
                        title="Era / Decade"
                        icon={Clock}
                        isOpen={expandedSections.decades}
                        onToggle={() => toggleSection('decades')}
                    >
                        <div className="flex flex-wrap gap-1 p-1">
                            {DECADES.map(d => (
                                <button
                                    key={d}
                                    onClick={() => toggleFilter('decades', d)}
                                    className={`flex-grow px-2 py-1 text-[9px] font-mono border rounded-sm transition-all ${filters.decades.includes(d)
                                        ? 'bg-custom-gold/20 border-custom-gold/40 text-custom-gold'
                                        : 'bg-[#111] border-[#222] text-textDim'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                </div>

                {/* Signal Matrix */}
                <FilterSection
                    title="Signal Matrix"
                    icon={Activity}
                    isOpen={expandedSections.signals}
                    onToggle={() => toggleSection('signals')}
                >
                    <div className="p-2 bg-[#050505] border border-[#222] rounded grid grid-cols-4 gap-2">
                        {SIGNALS.map(sig => {
                            const active = filters.activeSignals.includes(sig.id);
                            return (
                                <button
                                    key={sig.id}
                                    onClick={() => toggleFilter('activeSignals', sig.id)}
                                    className="flex flex-col items-center gap-1 group"
                                    title={sig.label}
                                >
                                    <div className={`w-3 h-3 rounded-full border border-white/10 transition-all duration-300 ${active ? `${sig.color} shadow-[0_0_8px_currentColor]` : 'bg-[#111]'}`} />
                                    <span className={`text-[8px] font-mono ${active ? 'text-white' : 'text-[#444]'}`}>{sig.id}</span>
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* Registry Tags */}
                {availableTags.length > 0 && (
                    <FilterSection
                        title="Registry Tags"
                        icon={Tag}
                        isOpen={expandedSections.tags}
                        onToggle={() => toggleSection('tags')}
                    >
                        <div className="flex flex-wrap gap-1 p-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleFilter('tags', tag)}
                                    className={`px-2 py-1 text-[9px] font-mono border rounded-sm transition-all ${filters.tags.includes(tag)
                                        ? 'bg-purple/20 border-purple/40 text-purple'
                                        : 'bg-[#111] border-[#222] text-textDim hover:border-[#444]'}`}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                )}
            </div>

            {/* Bottom Plate */}
            <div className="mt-auto p-4 border-t-2 border-black bg-[#0d0d0d] flex justify-between items-center relative">
                <div className="absolute bottom-2 left-2"><ScrewHead /></div>
                <div className="absolute bottom-2 right-2"><ScrewHead /></div>
                <span className="text-[9px] font-mono text-[#333] tracking-[0.3em] mx-auto uppercase">Serio Filtering Module v2</span>
            </div>
        </div>
    );
}

// Sub-components
const FilterSection = ({ title, icon: Icon, children, isOpen, onToggle }: any) => (
    <div className="border border-[#222] bg-[#111] rounded shadow-sm overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#181818] to-[#121212] border-b border-[#222] hover:from-[#202020] hover:to-[#181818] transition-all group"
        >
            <div className="flex items-center gap-2">
                <Icon className="w-3 h-3 text-[#555] group-hover:text-custom-gold transition-colors" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888] group-hover:text-white transition-colors">{title}</span>
            </div>
            {isOpen ? <ChevronUp className="w-3 h-3 text-[#444]" /> : <ChevronDown className="w-3 h-3 text-[#444]" />}
        </button>
        {isOpen && <div className="p-1">{children}</div>}
    </div>
);

const ModuleToggle = ({ label, active, onClick, activeColor = 'text-cyan' }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-sm border transition-all ${active
            ? 'bg-[#1a1a1a] border-[#333]'
            : 'bg-transparent border-transparent hover:bg-white/5'}`}
    >
        <span className={`text-[10px] font-mono uppercase tracking-wide ${active ? 'text-white' : 'text-textDim'}`}>{label}</span>
        <div className={`w-8 h-3 rounded-full border border-[#333] bg-black relative flex items-center px-0.5`}>
            <div className={`w-2.5 h-2 rounded-full transition-all duration-300 ${active
                ? `translate-x-[18px] bg-current ${activeColor} shadow-[0_0_5px_currentColor]`
                : 'translate-x-0 bg-[#333]'}`}
            />
        </div>
    </button>
);
