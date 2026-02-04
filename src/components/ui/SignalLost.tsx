import { AlertTriangle, WifiOff } from 'lucide-react';

const SignalLost = ({ onReset }: { onReset?: () => void }) => {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center overflow-hidden relative">
            {/* Glitch Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay">
                <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_3px)] bg-[length:100%_4px] animate-scanline" />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative z-10 w-20 h-20 border-2 border-rose-500/50 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <WifiOff className="w-10 h-10 text-rose-500 animate-[pulse_2s_ease-in-out_infinite]" />
                    </div>
                    {/* Orbiting Glitch */}
                    <div className="absolute inset-0 border border-transparent border-t-rose-500/60 rounded-full animate-spin-slow w-24 h-24" />
                    <div className="absolute inset-0 border border-transparent border-b-rose-500/30 rounded-full animate-spin-reverse-slower w-28 h-28 -m-2 opacity-50" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-display text-white tracking-widest uppercase animate-glitch" data-text="SIGNAL LOST">
                        SIGNAL LOST
                    </h2>
                    <p className="font-mono text-xs text-rose-400/80 tracking-wide">
                        Target signature not found in current sector.
                    </p>
                </div>

                {onReset && (
                    <button
                        onClick={onReset}
                        className="group relative px-6 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 group-hover:animate-bounce" />
                            Re-Initialize Scan
                        </span>
                        <div className="absolute inset-0 bg-rose-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform" />
                    </button>
                )}
            </div>

            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100%); }
                }
                .animate-scanline {
                    animation: scanline 8s linear infinite;
                }
                @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                @keyframes spin-reverse-slower {
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-reverse-slower {
                    animation: spin-reverse-slower 12s linear infinite;
                }
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .animate-glitch {
                    animation: glitch 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default SignalLost;
