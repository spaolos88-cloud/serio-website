import { useEffect, useState, useMemo } from 'react';
import { Search, ChevronRight, Plus, Check, ArrowLeft, SlidersHorizontal, X, LayoutGrid, List, Image } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import BrandGrid from '../components/BrandGrid';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SignalLost from '../components/ui/SignalLost';
import { calculateModelSignals } from '../data/sonicDiagnosticPool';

interface SearchModel {
    id: string;
    name: string;
    brandId: string;
    category: string;
    sub_category?: string;
    score?: number;
    class?: string;
    tags?: string[];
    release_year?: string;
    tuning_profile?: string;
    image_url?: string;
    verified?: boolean;
}

interface FilterState {
    search: string;
    performanceClass: string[];
    categories: string[];
    decades: string[];
    primaryIntent: string[];
    tags: string[];
    activeSignals: string[];
}

const initialFilters: FilterState = {
    search: '',
    performanceClass: [],
    categories: [],
    decades: [],
    primaryIntent: [],
    tags: [],
    activeSignals: [],
};

const ArchivePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [db, setDb] = useState<SearchModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [displayStyle, setDisplayStyle] = useState<'GRID' | 'LIST'>('GRID');

    // Read brand from URL or state
    const brandParam = searchParams.get('brand');
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(brandParam);

    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});
    const { toggleModel, isInComparison } = useComparison();
    const [brands, setBrands] = useState<any[]>([]);

    // Sync search filter with main search
    const searchTerm = filters.search;

    // Sync URL when internal state changes
    useEffect(() => {
        if (selectedBrandId) {
            setSearchParams({ brand: selectedBrandId });
        } else {
            setSearchParams({});
        }
    }, [selectedBrandId, setSearchParams]);

    // Update internal state if URL changes (e.g. back button)
    useEffect(() => {
        setSelectedBrandId(brandParam);
    }, [brandParam]);

    // View Mode Logic (Derived)
    const viewMode = useMemo(() => {
        if (searchTerm) return 'LIST';
        if (selectedBrandId) return 'LIST';
        if (filters.performanceClass.length > 0 || filters.categories.length > 0 ||
            filters.decades.length > 0 || filters.primaryIntent.length > 0 ||
            filters.activeSignals.length > 0) return 'LIST';
        return 'DIRECTORY';
    }, [searchTerm, selectedBrandId, filters]);

    // Load Brands
    useEffect(() => {
        fetch('/data/brands.json')
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.error("Failed to load brands:", err));
    }, []);

    // Load the "Live Archive" index
    useEffect(() => {
        fetch('/data/model-index.json')
            .then(res => res.json())
            .then(data => {
                setDb(data);
                setLoading(false);
                setExpandedCategories({});
            })
            .catch(err => {
                console.error("Failed to load archive index:", err);
                setLoading(false);
            });
    }, []);

    // Extract available categories from data
    const availableCategories = useMemo(() => {
        const cats = new Set<string>();
        db.forEach(model => {
            if (model.category) cats.add(model.category);
        });
        return Array.from(cats).sort();
    }, [db]);

    // Extract available tags from data
    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        db.forEach(model => {
            if (model.tags) {
                model.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [db]);

    // Helper: get decade from year
    const getDecade = (year?: string): string => {
        if (!year) return '';
        const y = parseInt(year);
        if (isNaN(y)) return '';
        const decade = Math.floor(y / 10) * 10;
        return `${decade}s`;
    };

    // Filter Logic with advanced filters
    const filteredModels = useMemo(() => {
        if (viewMode === 'DIRECTORY' && !searchTerm) return [];

        return db.filter(model => {
            // Brand filter
            if (selectedBrandId && model.brandId !== selectedBrandId) return false;

            // Search filter
            const matchesSearch = filters.search === '' ||
                model.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                model.brandId.toLowerCase().includes(filters.search.toLowerCase());

            // Performance class filter
            const matchesClass = filters.performanceClass.length === 0 ||
                filters.performanceClass.includes(model.class || 'NOT_DOCUMENTED');

            // Category filter
            const matchesCategory = filters.categories.length === 0 ||
                filters.categories.includes(model.category);

            // Decade filter
            const modelDecade = getDecade(model.release_year);
            const matchesDecade = filters.decades.length === 0 ||
                filters.decades.includes(modelDecade);

            // Primary intent filter
            const matchesIntent = filters.primaryIntent.length === 0 ||
                filters.primaryIntent.includes(model.tuning_profile || '');

            // Tags filter
            const matchesTags = filters.tags.length === 0 ||
                (model.tags && filters.tags.some(tag => model.tags?.includes(tag)));

            // Signal filter
            const matchesSignals = filters.activeSignals.length === 0 ||
                filters.activeSignals.every(sig => {
                    const modelSignals = calculateModelSignals(model);
                    return (modelSignals as any)[sig] >= 65; // Threshold for significant alignment
                });

            return matchesSearch && matchesClass && matchesCategory && matchesDecade && matchesIntent && matchesTags && matchesSignals;
        });
    }, [db, filters, selectedBrandId, viewMode, searchTerm]);

    // Handle Brand Selection
    const handleBrandSelect = (brandId: string) => {
        setSearchParams({ brand: brandId });
        setSelectedBrandId(brandId);
        setFilters(prev => ({ ...prev, search: '' }));
    };

    const handleBackToDirectory = () => {
        setSearchParams({});
        setSelectedBrandId(null);
        setFilters(initialFilters);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [viewMode]);

    // Grouping Logic
    const groupedModels = useMemo(() => {
        const groups: Record<string, Record<string, SearchModel[]>> = {};

        // Helper to extract series
        const getSeries = (model: SearchModel): string => {
            const name = model.name.trim();

            // Pattern 1: Letter prefix with hyphen (e.g., DS-77EX -> DS Series)
            const prefixMatch = name.match(/^([A-Za-z]+)-/);
            if (prefixMatch) {
                return `${prefixMatch[1].toUpperCase()} Series`;
            }

            // Pattern 2: Series at end (e.g., "L100 Classic" -> L Series? No, usually first part matters)

            // Fallback: Use sub-category if available, otherwise General
            return model.sub_category || 'General';
        };

        filteredModels.forEach(model => {
            const cat = model.category || 'UNCATEGORIZED';
            const series = getSeries(model);

            if (!groups[cat]) groups[cat] = {};
            if (!groups[cat][series]) groups[cat][series] = [];

            groups[cat][series].push(model);
        });

        // Sort Groups and Sub-groups (Series)
        const sortedGroups: Record<string, Record<string, SearchModel[]>> = {};
        Object.keys(groups).sort().forEach(key => {
            const sortedSub: Record<string, SearchModel[]> = {};
            // Sort series alphabetically
            Object.keys(groups[key]).sort().forEach(subKey => {
                sortedSub[subKey] = groups[key][subKey];
            });
            sortedGroups[key] = sortedSub;
        });

        return sortedGroups;
    }, [filteredModels]);

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [cat]: !prev[cat]
        }));
    };

    const getPrimarySignal = (model: SearchModel) => {
        const signals = calculateModelSignals(model);
        let maxSig = 'M';
        let maxVal = 0;
        Object.entries(signals).forEach(([sig, val]) => {
            if (val > maxVal) {
                maxVal = val;
                maxSig = sig;
            }
        });

        const sigColors: Record<string, string> = {
            M: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
            A: 'text-cyan bg-cyan/10 border-cyan/20',
            S: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
            R: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
            V: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
            C: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            F: 'text-slate-400 bg-slate-400/10 border-slate-400/20'
        };

        return { sig: maxSig, val: maxVal, color: sigColors[maxSig] || 'text-textDim bg-white/5 border-white/10', signals };
    };

    const SignalSpectrum = ({ signals }: { signals: any }) => {
        const keys = ['M', 'A', 'S', 'R', 'V']; // Top 5 relevant for quick scan
        const sigColors: Record<string, string> = {
            M: 'bg-rose-400 shadow-[0_0_5px_rgba(251,113,133,0.5)]',
            A: 'bg-cyan shadow-[0_0_5px_rgba(34,211,238,0.5)]',
            S: 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]',
            R: 'bg-purple-400 shadow-[0_0_5px_rgba(192,132,252,0.5)]',
            V: 'bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.5)]',
        };

        return (
            <div className="flex items-end gap-1 h-4 w-full max-w-[80px]" title="Signal Profile: M-A-S-R-V">
                {keys.map(k => (
                    <div key={k} className="w-1.5 h-full bg-white/5 relative rounded-sm overflow-hidden">
                        <div
                            style={{ height: `${signals[k]}%` }}
                            className={`w-full absolute bottom-0 transition-all duration-500 ${sigColors[k]}`}
                        />
                    </div>
                ))}
            </div>
        );
    };

    const toggleSubCategory = (cat: string, sub: string) => {
        const key = `${cat}|${sub}`;
        setExpandedSubCategories(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Keyboard shortcut for ESC to clear search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && filters.search) {
                setFilters(prev => ({ ...prev, search: '' }));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filters.search]);

    // Pagination State
    const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

    const handleLoadMore = (key: string) => {
        setVisibleCounts(prev => ({
            ...prev,
            [key]: (prev[key] || 12) + 12
        }));
    };

    // Data Health Analysis for Current View
    const healthStats = useMemo(() => {
        const total = filteredModels.length;
        if (total === 0) return { gold: 0, silver: 0, bronze: 0, images: 0, total: 0 };

        let gold = 0, silver = 0, images = 0;
        filteredModels.forEach(m => {
            // Gold: Legend class or Score > 85
            if ((m.score && m.score >= 85) || m.class === 'LEGEND') gold++;
            // Silver: Class S, A or Score > 60
            else if ((m.score && m.score >= 60) || m.class === 'S' || m.class === 'A') silver++;

            if (m.image_url) images++;
        });

        // Bronze is remainder
        const bronze = total - gold - silver;

        return { gold, silver, bronze, images, total };
    }, [filteredModels]);

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Filter Sidebar */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden shrink-0`}>
                <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    availableCategories={availableCategories}
                    availableTags={availableTags}
                    totalResults={db.length}
                    filteredResults={filteredModels.length}
                    healthStats={healthStats}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg">
                <div className="p-6 space-y-8 animate-in fade-in duration-700 min-h-screen pb-20">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6 sticky top-0 bg-bg/95 backdrop-blur-xl z-20 -mx-6 px-6 pt-4">
                        <div className="flex items-center gap-4">
                            {/* Toggle Sidebar Button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`p-2 rounded-lg transition-all duration-200 ${sidebarOpen
                                    ? 'bg-custom-gold/10 border border-custom-gold/30 text-custom-gold'
                                    : 'bg-white/5 border border-white/10 text-textDim hover:text-white hover:border-white/20'
                                    }`}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                            </button>

                            <div>
                                <h1 className="text-3xl md:text-3xl font-bold font-display tracking-tight text-white uppercase flex items-center gap-3">
                                    THE SONIC LAB <span className="text-custom-gold text-glow text-lg translate-y-px">ARCHIVE</span>
                                </h1>
                                <div className="flex items-center gap-3 mt-1 font-mono text-[10px] tracking-[0.2em] text-custom-gold/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-custom-gold animate-pulse"></div>
                                    <span>{filteredModels.length.toLocaleString()} UNITS ACTIVE</span>
                                    {filters.search && <span className="text-white/40">// FILTERING: "{filters.search}"</span>}
                                </div>
                            </div>
                        </div>

                        {/* View Style Toggle */}
                        <div className="flex bg-black/40 p-1 rounded-md border border-white/10 ml-auto md:ml-0 backdrop-blur-md">
                            <button
                                onClick={() => setDisplayStyle('GRID')}
                                className={`p-1.5 rounded-sm transition-all duration-200 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${displayStyle === 'GRID'
                                    ? 'bg-custom-gold text-bg shadow-[0_0_15px_rgba(255,215,0,0.3)] font-bold'
                                    : 'text-textDim hover:text-white'
                                    }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setDisplayStyle('LIST')}
                                className={`p-1.5 rounded-md transition-all duration-200 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${displayStyle === 'LIST'
                                    ? 'bg-cyan text-bg shadow-[0_0_15px_rgba(0,240,255,0.3)] font-bold'
                                    : 'text-textDim hover:text-white'
                                    }`}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Results Groups */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-cyan/10 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="font-mono text-cyan text-xs animate-pulse tracking-[0.3em]">ESTABLISHING SECURE UPLINK...</div>
                        </div>
                    ) : viewMode === 'DIRECTORY' && !searchTerm ? (
                        <BrandGrid brands={brands} onSelectBrand={handleBrandSelect} />
                    ) : Object.keys(groupedModels).length === 0 ? (
                        <SignalLost onReset={handleBackToDirectory} />
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                            {Object.entries(groupedModels as any).map(([category, subGroups]: [string, any]) => {
                                const isExpanded = !!expandedCategories[category]; // Default to collapsed
                                const totalItemsInCategory = Object.values(subGroups as any).reduce((acc: number, curr: any) => acc + curr.length, 0);

                                return (
                                    <div key={category} className="border-l-2 border-white/5 pl-6 relative">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bg border-2 border-white/10"></div>

                                        <button
                                            onClick={() => toggleCategory(category)}
                                            className="flex items-center gap-4 group mb-6 hover:translate-x-1 transition-transform"
                                        >
                                            <h2 className="font-display font-bold text-4xl tracking-tighter uppercase text-white/90 group-hover:text-cyan transition-colors">
                                                {category}
                                            </h2>
                                            <span className="text-xs font-mono text-custom-gold/60 bg-custom-gold/5 px-2 py-1 rounded border border-custom-gold/10">
                                                [{totalItemsInCategory.toString().padStart(3, '0')}]
                                            </span>
                                        </button>

                                        {isExpanded && (
                                            <div className="space-y-4 pt-4">
                                                {Object.entries(subGroups as any).map((entry: any) => {
                                                    const [subCategory, models] = entry as [string, SearchModel[]];
                                                    const subKey = `${category}|${subCategory}`;
                                                    const isSubExpanded = !!expandedSubCategories[subKey]; // Default to collapsed
                                                    const visibleCount = visibleCounts[subKey] || 12;
                                                    const visibleModels = models.slice(0, visibleCount);
                                                    const hasMore = models.length > visibleCount;

                                                    return (
                                                        <div key={subCategory} className="space-y-4">
                                                            {/* Sub-Category/Series Header (Collapsible) */}
                                                            <button
                                                                onClick={() => toggleSubCategory(category, subCategory)}
                                                                className="flex items-center gap-3 w-full group/sub hover:bg-white/5 p-2 rounded transition-colors -ml-2"
                                                            >
                                                                <div className={`p-1 rounded bg-white/5 transition-transform duration-200 ${isSubExpanded ? 'rotate-90' : ''}`}>
                                                                    <ChevronRight className="w-4 h-4 text-cyan" />
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm font-mono text-cyan tracking-widest uppercase font-bold">
                                                                    // {subCategory}
                                                                    </span>
                                                                    <span className="text-[10px] text-textDim font-mono opacity-50 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                                                        {models.length} UNITS
                                                                    </span>
                                                                </div>
                                                                <div className="h-px flex-1 bg-white/5 group-hover/sub:bg-cyan/20 transition-colors"></div>
                                                            </button>

                                                            {isSubExpanded && (
                                                                <div className="animate-in slide-in-from-top-2 duration-300 pl-4 border-l border-white/5 ml-2">
                                                                    {displayStyle === 'GRID' ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                                                            {visibleModels.map((model: SearchModel) => (
                                                                                <Link
                                                                                    key={model.id}
                                                                                    to={`/product/${model.id}`}
                                                                                    className="block h-full transition-transform hover:-translate-y-1 duration-300"
                                                                                >
                                                                                    <ProductCard
                                                                                        product={model}
                                                                                        onCompare={(e) => {
                                                                                            e.preventDefault();
                                                                                            toggleModel(model.id);
                                                                                        }}
                                                                                    />
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-px overflow-hidden rounded-lg border border-white/5">
                                                                            {/* Table Header */}
                                                                            <div className="grid grid-cols-[1fr_80px_80px_100px_100px] gap-4 p-4 bg-white/5 border-b border-white/10 text-[10px] font-mono text-textDim uppercase tracking-widest font-bold items-center">
                                                                                <div>Model Identity</div>
                                                                                <div>Signal</div>
                                                                                <div className="text-center">Year</div>
                                                                                <div className="text-center">Class</div>
                                                                                <div className="text-right pr-4">Actions</div>
                                                                            </div>

                                                                            {visibleModels.map((model: SearchModel) => (
                                                                                <div
                                                                                    key={model.id}
                                                                                    className="grid grid-cols-[1fr_80px_80px_100px_100px] gap-4 p-3 bg-black/20 border-b border-white/5 hover:bg-white/5 transition-all items-center group/row"
                                                                                >
                                                                                    <Link
                                                                                        to={`/product/${model.id}`}
                                                                                        className="flex flex-col min-w-0"
                                                                                    >
                                                                                        <span className="text-[9px] font-mono text-custom-gold/60 uppercase tracking-tighter truncate opacity-70 group-hover/row:opacity-100 transition-opacity">
                                                                                            {model.brandId} // {model.category}
                                                                                        </span>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-sm font-bold text-white group-hover/row:text-custom-gold transition-colors truncate font-display tracking-wide">
                                                                                                {model.name}
                                                                                            </span>
                                                                                        </div>
                                                                                    </Link>

                                                                                    <div className="opacity-70 group-hover/row:opacity-100 transition-opacity bg-black/20 p-1 rounded">
                                                                                        {(() => {
                                                                                            const { signals } = getPrimarySignal(model);
                                                                                            return <SignalSpectrum signals={signals} />;
                                                                                        })()}
                                                                                    </div>

                                                                                    <div className="text-center font-mono text-xs text-textDim group-hover/row:text-white transition-colors">
                                                                                        {model.release_year || '----'}
                                                                                    </div>

                                                                                    <div className="flex justify-center">
                                                                                        {model.class ? (
                                                                                            <span className={`px-2.5 py-1 rounded-sm text-[10px] font-bold font-mono tracking-tighter shadow-sm border ${model.class === 'LEGEND' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                                                                                                model.class === 'S' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]' :
                                                                                                    model.class === 'A' ? 'bg-cyan/10 text-cyan border-cyan/20' :
                                                                                                        'bg-textDim/5 text-textDim border-white/10'
                                                                                                }`}>
                                                                                                {model.class}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span className="text-[10px] font-mono text-textDim/30">N/A</span>
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="flex justify-end pr-2 gap-2">
                                                                                        <Link
                                                                                            to={`/product/${model.id}`}
                                                                                            className="p-2 text-textDim hover:text-white transition-colors"
                                                                                            title="View Data"
                                                                                        >
                                                                                            <Image className="w-4 h-4" />
                                                                                        </Link>
                                                                                        <button
                                                                                            onClick={() => toggleModel(model.id)}
                                                                                            className={`p-2 rounded-md transition-all ${isInComparison(model.id)
                                                                                                ? 'text-custom-gold scale-110'
                                                                                                : 'text-textDim hover:text-white'
                                                                                                }`}
                                                                                            title={isInComparison(model.id) ? "In Comparison" : "Add to Comparison"}
                                                                                        >
                                                                                            {isInComparison(model.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {hasMore && (
                                                                        <button
                                                                            onClick={() => handleLoadMore(subKey)}
                                                                            className="w-full py-4 bg-white/5 border border-white/10 text-cyan hover:bg-cyan/10 hover:border-cyan/30 transition-all font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 group/btn"
                                                                        >
                                                                            <span>Initialize Sector {Math.floor(visibleCount / 12) + 1}</span>
                                                                            <div className="w-1.5 h-1.5 bg-cyan opacity-50 group-hover/btn:opacity-100 transition-opacity animate-pulse"></div>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArchivePage;
