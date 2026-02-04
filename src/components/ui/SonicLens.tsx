import { useState } from 'react';
import { Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';

interface SonicLensProps {
    src: string;
    alt: string;
    className?: string;
}

export const SonicLens = ({ src, alt, className = '' }: SonicLensProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const toggleModal = () => {
        setIsOpen(!isOpen);
        setZoom(1); // Reset zoom on close/open
    };

    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom(prev => Math.max(prev - 0.5, 1));
    };

    return (
        <>
            {/* Thumbnail Trigger */}
            <div
                className={`relative group cursor-zoom-in ${className}`}
                onClick={toggleModal}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* Overlay Hint */}
                <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                        <span className="px-3 py-1.5 bg-black/80 border border-custom-gold/30 text-custom-gold text-[10px] font-mono tracking-widest uppercase backdrop-blur-sm flex items-center gap-2">
                            <Maximize2 className="w-3 h-3" />
                            Expand View
                        </span>
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/10 group-hover:border-custom-gold/50 transition-colors"></div>
                <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/10 group-hover:border-custom-gold/50 transition-colors"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/10 group-hover:border-custom-gold/50 transition-colors"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/10 group-hover:border-custom-gold/50 transition-colors"></div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 flex items-center justify-center overflow-hidden"
                    onClick={toggleModal}
                >
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                    {/* Toolbar */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
                        <button
                            onClick={handleZoomOut}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-custom-gold transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleZoomIn}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-custom-gold transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-2"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleModal(); }}
                            className="p-2 bg-white/5 hover:bg-red-500/20 rounded-full text-white/70 hover:text-red-400 transition-colors"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-8 transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <img
                            src={src}
                            alt={alt}
                            className="max-h-full max-w-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                        />
                    </div>

                    {/* Caption / Footer */}
                    <div className="absolute bottom-8 left-8 p-4 bg-black/80 border-l-2 border-custom-gold backdrop-blur z-50">
                        <p className="text-white font-mono text-sm tracking-widest uppercase mb-1">{alt}</p>
                        <p className="text-custom-gold/60 text-[10px] font-mono">HIGH FIDELITY VISUAL ARCHIVE</p>
                    </div>
                </div>
            )}
        </>
    );
};
