import { useMemo } from 'react';
import { Activity, BarChart3 } from 'lucide-react';

interface SonicSpectrumProps {
    frequencyRange: string; // e.g. "35 Hz to 30 kHz"
    descriptions?: string[]; // Visual intel descriptions
}

export const SonicSpectrum = ({ frequencyRange, descriptions }: SonicSpectrumProps) => {

    // Parse range to get start/end points for labels
    // Format usually: "35 Hz to 30 kHz" or "35 Hz - 30 kHz"
    const rangeData = useMemo(() => {
        const parts = frequencyRange.split(/to|-/);
        if (parts.length < 2) return { start: '20 Hz', end: '20 kHz' };
        return {
            start: parts[0].trim(),
            end: parts[1].trim()
        };
    }, [frequencyRange]);

    return (
        <div className="mb-12 relative bg-[#080808] border border-white/10 p-6 md:p-8 overflow-hidden rounded-sm group">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            ></div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start mb-8">
                <h3 className="text-xs font-mono text-custom-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Sonic Spectrum Analysis
                </h3>
                <div className="text-[10px] font-mono text-textDim bg-white/5 px-2 py-1 rounded">
                    RANGE: {frequencyRange}
                </div>
            </div>

            {/* The Visualizer (SVG) */}
            <div className="relative h-48 w-full mb-6 border-b border-l border-white/10">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="spectrumGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Frequency Curve (Simulated "Flat" Response with roll-offs) */}
                    {/* We draw a Bezier curve that looks like a high-end speaker response */}
                    {/* Start low, rapid rise, flat middle, slight variations, high extension */}
                    <path
                        d="M0,150 C20,150 40,40 100,40 L300,40 C400,35 500,45 600,40 C800,30 900,20 1000,35 L1200,150"
                        fill="url(#spectrumGradient)"
                        className="opacity-60"
                        vectorEffect="non-scaling-stroke"
                    />
                    <path
                        d="M0,150 C20,150 40,40 100,40 L300,40 C400,35 500,45 600,40 C800,30 900,20 1000,35 L1200,150"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="2"
                        className="group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all duration-500"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Animated Scanning Line */}
                    <line x1="0" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 2">
                        <animate attributeName="x1" from="0%" to="100%" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="x2" from="0%" to="100%" dur="4s" repeatCount="indefinite" />
                    </line>
                </svg>

                {/* Axis Labels */}
                <div className="absolute -bottom-6 left-0 text-[9px] text-textDim font-mono">{rangeData.start}</div>
                <div className="absolute -bottom-6 left-1/4 text-[9px] text-textDim font-mono">100Hz</div>
                <div className="absolute -bottom-6 left-1/2 text-[9px] text-textDim font-mono">1kHz</div>
                <div className="absolute -bottom-6 left-3/4 text-[9px] text-textDim font-mono">10kHz</div>
                <div className="absolute -bottom-6 right-0 text-[9px] text-textDim font-mono">{rangeData.end}</div>
            </div>

            {/* Analysis Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {descriptions && descriptions.map((desc, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 bg-white/5 border border-white/5 rounded-sm hover:border-white/10 transition-colors">
                        <BarChart3 className="w-4 h-4 text-custom-gold/50 shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[9px] font-mono text-custom-gold/50 block mb-1">ANALYSIS POINT 0{i + 1}</span>
                            <p className="text-xs text-textDim/80 font-mono leading-relaxed">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
