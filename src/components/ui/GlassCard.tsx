import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    hoverEffect = true,
    onClick
}) => {
    return (
        <motion.div
            className={`
        relative overflow-hidden
        bg-surface/40 backdrop-blur-md border border-white/5 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
            whileHover={hoverEffect ? {
                borderColor: 'rgba(0, 240, 255, 0.4)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)'
            } : {}}
            transition={{ duration: 0.3 }}
            onClick={onClick}
        >
            {/* Scanline/Grid overlay effect */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan/50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan/50" />

            {children}
        </motion.div>
    );
};

export default GlassCard;
