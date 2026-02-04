import { motion } from 'framer-motion';
import { Menu, X, Headphones } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Services', href: '#services' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <div className="p-2 bg-cyan/10 rounded border border-cyan/20">
                    <Headphones className="w-5 h-5 text-cyan" />
                </div>
                <span className="text-xl font-display font-bold tracking-tighter text-white">
                    THE SONIC LAB<span className="text-cyan animate-pulse">.</span>
                </span>
            </motion.div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link, i) => (
                    <motion.a
                        key={link.name}
                        href={link.href}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-sm font-mono uppercase tracking-[0.2em] text-textDim hover:text-cyan transition-colors"
                    >
                        {link.name}
                    </motion.a>
                ))}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 bg-brushed-metal border border-cyan/30 rounded text-xs font-mono text-cyan uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                    Initialize Project
                </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 w-full bg-surface border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-mono uppercase tracking-widest text-textDim hover:text-cyan"
                        >
                            {link.name}
                        </a>
                    ))}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
