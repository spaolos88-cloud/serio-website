import React from 'react';

interface SonicVisualizerProps {
    isAnalyzing: boolean;
    preference: string | null;
}

export const SonicVisualizer: React.FC<SonicVisualizerProps> = ({ isAnalyzing, preference }) => {
    // Generate random heights for the initial state
    const barCount = 12;
    const bars = Array.from({ length: barCount }).map((_, i) => i);

    const getColor = () => {
        if (preference === 'ANALYTICAL') return 'bg-cyan shadow-[0_0_10px_cyan]';
        if (preference === 'BALANCED') return 'bg-green-500 shadow-[0_0_10px_lime]';
        return 'bg-custom-gold shadow-[0_0_10px_gold]';
    };

    return (
        <div className="flex items-end justify-center gap-1 h-8 w-full opacity-80">
            {bars.map((i) => (
                <div
                    key={i}
                    className={`w-1 rounded-t-sm transition-all duration-300 ${getColor()} ${isAnalyzing ? 'animate-spectrum' : 'h-1 opacity-20'}`}
                    style={{
                        height: isAnalyzing ? `${Math.max(20, Math.random() * 100)}%` : '10%',
                        animationDelay: `${i * 0.05}s`
                    }}
                ></div>
            ))}
        </div>
    );
};
