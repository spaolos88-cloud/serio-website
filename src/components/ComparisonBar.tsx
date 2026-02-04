import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { BarChart3, Plus, X, ArrowRight } from 'lucide-react';

/**
 * Floating comparison bar that appears at the bottom of the screen
 * when products are added to comparison.
 */
export default function ComparisonBar() {
    const { selectedModels, clearModels } = useComparison();

    // Don't render if no models selected
    if (selectedModels.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
            <div className="flex justify-center p-4">
                <div className="pointer-events-auto flex items-center gap-4 px-6 py-4 bg-surface/95 backdrop-blur-xl border border-cyan/30 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.2)] animate-in slide-in-from-bottom-4 duration-300">
                    {/* Selection Info */}
                    <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                        <div className="relative">
                            <BarChart3 className="w-5 h-5 text-cyan" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan text-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                                {selectedModels.length}
                            </span>
                        </div>
                        <div className="text-white font-mono text-sm">
                            <span className="text-cyan font-bold">{selectedModels.length}</span>
                            <span className="text-textDim ml-1">
                                {selectedModels.length === 1 ? 'unit' : 'units'} selected
                            </span>
                        </div>
                    </div>

                    {/* Remaining Slots Indicator */}
                    <div className="flex items-center gap-1">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i < selectedModels.length
                                        ? 'bg-cyan shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                                        : 'bg-white/20'
                                    }`}
                            />
                        ))}
                        <span className="text-[10px] text-textDim font-mono ml-2">
                            {4 - selectedModels.length} slots left
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                        {/* Add More Button - Only show if under max */}
                        {selectedModels.length < 4 && (
                            <Link
                                to="/archive"
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-white/30 text-white font-mono text-xs rounded transition-all duration-200 hover:bg-white/10"
                            >
                                <Plus className="w-3 h-3" />
                                ADD MORE
                            </Link>
                        )}

                        {/* Compare Button */}
                        <Link
                            to="/compare"
                            className="group flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan/20 to-cyan/10 border border-cyan/50 hover:border-cyan text-cyan font-mono text-xs rounded transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        >
                            <BarChart3 className="w-4 h-4" />
                            COMPARE NOW
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Clear Button */}
                        <button
                            onClick={clearModels}
                            className="p-2 text-textDim hover:text-red-400 hover:bg-red-400/10 rounded transition-all duration-200"
                            title="Clear selection"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
