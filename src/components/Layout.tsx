import React from 'react';
import { motion } from 'framer-motion';
import InteractiveBackground from './ui/InteractiveBackground';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`min-h-screen relative flex flex-col ${className}`}
        >
            {/* Background ambient effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <InteractiveBackground />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan/5 blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple/10 blur-[120px] mix-blend-screen animate-pulse-slow" />
            </div>

            <div className="relative z-10 flex-grow flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};

export default Layout;
