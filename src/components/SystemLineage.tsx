import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

interface RelatedModel {
    id: string;
    name: string;
    original_price?: string;
    release_year?: string;
    image_url?: string;
    category?: string;
    sub_category?: string;
}

interface SystemLineageProps {
    brandId: string;
    currentId: string;
    subCategory?: string;
    category: string;
}

export const SystemLineage = ({ brandId, currentId, subCategory, category }: SystemLineageProps) => {
    const navigate = useNavigate();
    const [relatedModels, setRelatedModels] = useState<RelatedModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/data/catalog/${brandId}.json`)
            .then(res => {
                if (!res.ok) throw new Error("Catalog fetch failed");
                return res.json();
            })
            .then((data: RelatedModel[]) => {
                // Filter logic:
                // 1. Exclude current model
                // 2. Match sub_category if available (e.g. "DS Series")
                // 3. Fallback to same category if no sub_category match or too few results

                let matches = data.filter(m => m.id !== currentId);

                if (subCategory) {
                    const seriesMatches = matches.filter(m => m.sub_category === subCategory);
                    if (seriesMatches.length > 0) {
                        matches = seriesMatches;
                    } else {
                        // Fallback to category
                        matches = matches.filter(m => m.category === category);
                    }
                } else {
                    matches = matches.filter(m => m.category === category);
                }

                // Sort by year (descending) or name if year unavailable
                matches.sort((a, b) => {
                    if (a.release_year && b.release_year) {
                        return parseInt(b.release_year) - parseInt(a.release_year);
                    }
                    return a.name.localeCompare(b.name);
                });

                setRelatedModels(matches.slice(0, 10)); // Limit to 10 items
                setLoading(false);
            })
            .catch(err => {
                console.error("Lineage Fetch Error:", err);
                setRelatedModels([]);
                setLoading(false);
            });
    }, [brandId, currentId, subCategory, category]);

    if (loading || relatedModels.length === 0) return null;

    return (
        <div className="mb-20 border-t border-white/5 pt-12 animate-in fade-in duration-700 delay-300">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-mono text-custom-gold uppercase tracking-[0.2em] flex items-center gap-2">
                        <Layers className="w-3 h-3" />
                        {subCategory ? `Cognate Systems // ${subCategory}` : 'Related Lineage'}
                    </h3>
                    <p className="text-[10px] text-textDim font-mono">
                        DETECTED {relatedModels.length} RELATED ARCHIVE ENTRIES
                    </p>
                </div>

                {/* Scroll Indicators (Visual only for now, could be interactive) */}
                <div className="flex gap-1">
                    <div className="w-12 h-px bg-custom-gold/50"></div>
                    <div className="w-2 h-px bg-custom-gold/20"></div>
                    <div className="w-2 h-px bg-custom-gold/20"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedModels.map((model) => (
                    <div
                        key={model.id}
                        onClick={() => navigate(`/product/${model.id}`)}
                        className="group relative bg-[#0a0a0a] border border-white/5 hover:border-custom-gold/30 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(0,0,0,0.5)]"
                    >
                        {/* Image Thumb */}
                        <div className="aspect-square bg-[#0c0c0c] relative p-4 flex items-center justify-center overflow-hidden">
                            {model.image_url ? (
                                <img
                                    src={model.image_url}
                                    alt={model.name}
                                    className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
                                />
                            ) : (
                                <div className="text-custom-gold/10 font-mono text-xs uppercase">No Visual</div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-custom-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="px-2 py-1 bg-black/80 border border-custom-gold/30 text-[9px] font-mono text-custom-gold uppercase tracking-widest backdrop-blur-sm">
                                    Access Data
                                </span>
                            </div>
                        </div>

                        {/* Info Block */}
                        <div className="p-4 border-t border-white/5 group-hover:border-custom-gold/10 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xs font-bold font-mono text-white/80 group-hover:text-custom-gold transition-colors truncate w-full">
                                    {model.name}
                                </h4>
                            </div>

                            <div className="flex justify-between items-center text-[9px] font-mono text-textDim/70">
                                <span>{model.release_year || 'N/A'}</span>
                                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                                    <span>VIEW</span>
                                    <ArrowRight className="w-2 h-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
