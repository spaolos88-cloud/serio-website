import React from 'react';

interface FrequencyCurveProps {
    tags: string[];
    preference: string | null;
}

export const FrequencyCurve: React.FC<FrequencyCurveProps> = ({ tags = [], preference }) => {
    const getColor = () => {
        if (preference === 'ANALYTICAL') return 'stroke-cyan';
        if (preference === 'BALANCED') return 'stroke-green-500';
        return 'stroke-custom-gold';
    };

    // Determine curve type based on tags
    let curvePath = "M 0 50 Q 25 50 50 50 T 100 50"; // Default Flat
    let opacity = 0.3;

    if (tags.some(t => t.includes('Monitor') || t.includes('Reference'))) {
        // Flat Reference
        curvePath = "M 0 55 C 20 55, 40 50, 50 50 S 80 45, 100 48";
        opacity = 0.8;
    } else if (tags.some(t => t.includes('Warm') || t.includes('Natural') || t.includes('Paper'))) {
        // Warm (Bumped Mids/Lows, Rolled Highs)
        curvePath = "M 0 60 C 20 40, 40 35, 60 45 S 90 70, 100 80";
        opacity = 0.8;
    } else if (tags.some(t => t.includes('V-Shape') || t.includes('Dynamic') || t.includes('Rock'))) {
        // V-Shape (High Lows, Low Mids, High Highs)
        curvePath = "M 0 30 C 20 80, 40 80, 60 70 S 90 30, 100 20";
        opacity = 0.8;
    } else if (tags.some(t => t.includes('Bright') || t.includes('Detail'))) {
        // Bright (Rising Highs)
        curvePath = "M 0 70 C 30 70, 60 50, 80 30 S 100 10, 100 10";
        opacity = 0.8;
    }

    return (
        <div className="w-16 h-8 relative" title="Est. Frequency Response">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.1" strokeDasharray="2 2" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeOpacity="0.1" strokeDasharray="2 2" strokeWidth="0.5" />

                {/* Curve */}
                <path
                    d={curvePath}
                    fill="none"
                    className={`${getColor()} drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ opacity }}
                />
            </svg>
        </div>
    );
};
