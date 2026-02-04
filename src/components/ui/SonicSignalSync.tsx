import React from 'react';

interface SonicSignalSyncProps {
    signals: Record<string, number>;
    compact?: boolean;
}

const SIGNAL_DEFS = [
    { key: 'M', label: 'Musical', color: 'bg-rose-400', glow: 'shadow-[0_0_10px_rgba(251,113,133,0.5)]' },
    { key: 'A', label: 'Analytical', color: 'bg-cyan-400', glow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]' },
    { key: 'S', label: 'Stability', color: 'bg-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.5)]' },
    { key: 'R', label: 'Reference', color: 'bg-purple-400', glow: 'shadow-[0_0_10px_rgba(192,132,252,0.5)]' },
    { key: 'V', label: 'Volume', color: 'bg-orange-400', glow: 'shadow-[0_0_10px_rgba(251,146,60,0.5)]' },
    { key: 'C', label: 'Consumer', color: 'bg-yellow-400', glow: 'shadow-[0_0_10px_rgba(250,204,21,0.5)]' },
    { key: 'F', label: 'Safety', color: 'bg-slate-200', glow: 'shadow-[0_0_10px_rgba(226,232,240,0.5)]' },
];

export const SonicSignalSync: React.FC<SonicSignalSyncProps> = ({ signals, compact = false }) => {
    return (
        <div className={`space-y-${compact ? '1' : '2'} w-full`}>
            {SIGNAL_DEFS.map((sig) => {
                const value = signals[sig.key] || 0;
                return (
                    <div key={sig.key} className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[8px] font-mono text-white/40 uppercase tracking-tighter">{sig.label}</span>
                            <span className={`text-[9px] font-mono ${value > 80 ? 'text-white' : 'text-textDim'} font-bold`}>{value}%</span>
                        </div>
                        <div className={`h-${compact ? '1' : '1.5'} w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative`}>
                            {/* Segmented Background Effect */}
                            <div className="absolute inset-0 flex justify-between px-0.5">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="w-px h-full bg-black/40" />
                                ))}
                            </div>

                            <div
                                className={`h-full ${sig.color} ${sig.glow} transition-all duration-1000 ease-out relative`}
                                style={{ width: `${value}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
