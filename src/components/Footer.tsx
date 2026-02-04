import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Activity, ArrowUpRight, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-surfaceHighlight bg-surface/30 backdrop-blur-md relative z-10">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border border-custom-gold/30 bg-custom-gold/10 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-custom-gold" />
                            </div>
                            <span className="font-display font-bold text-xl text-white tracking-wider">THE SONIC LAB</span>
                        </div>
                        <p className="text-textDim text-sm leading-relaxed max-w-sm font-sans">
                            The definitive archive for proprietary audio analysis. We map the invisible landscape of sound through rigorous psychoacoustic auditing.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <SocialLink icon={Github} href="https://github.com" label="GitHub" />
                            <SocialLink icon={Twitter} href="https://twitter.com" label="Twitter" />
                            <SocialLink icon={Mail} href="mailto:contact@soniclab.io" label="Email" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Protocol</h4>
                        <ul className="space-y-2">
                            <FooterLink to="/" label="Overview" />
                            <FooterLink to="/archive" label="Archive" />
                            <FooterLink to="/compare" label="Comparison Engine" />
                            <FooterLink to="/assessment" label="Neural Diagnostic" />
                            <FooterLink to="/guides" label="Reference Manual" />
                        </ul>
                    </div>

                    {/* Legal / Status */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">System</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center justify-between text-xs text-textDim group cursor-default">
                                <span>Status</span>
                                <span className="text-green-400 font-mono bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">OPERATIONAL</span>
                            </li>
                            <li className="flex items-center justify-between text-xs text-textDim group cursor-default">
                                <span>Version</span>
                                <span className="font-mono text-white/50">v2.4.0-RC</span>
                            </li>
                            <li className="flex items-center justify-between text-xs text-textDim group cursor-default">
                                <span>Region</span>
                                <span className="font-mono text-white/50">Global (APAC)</span>
                            </li>
                        </ul>
                        <button className="mt-4 w-full py-2 border border-white/10 rounded-sm text-[10px] text-textDim uppercase tracking-widest hover:bg-white/5 transition-colors">
                            Initiate Diagnostics
                        </button>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-textDim font-mono">
                        © 2026 SERIO SONIC LAB. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-textDim">
                        <span>Crafted with</span>
                        <Heart className="w-3 h-3 text-red-500 fill-red-500/20" />
                        <span>for the Audiophile Community</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Helper Components
const SocialLink = ({ icon: Icon, href, label }: { icon: any, href: string, label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-white/5 rounded-full hover:bg-custom-gold hover:text-black text-textDim transition-all duration-300 group"
        aria-label={label}
    >
        <Icon className="w-4 h-4" />
    </a>
);

const FooterLink = ({ to, label }: { to: string, label: string }) => (
    <li>
        <Link
            to={to}
            className="text-xs text-textDim hover:text-custom-gold transition-colors flex items-center gap-1 group"
        >
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-custom-gold" />
            <span className="group-hover:translate-x-1 transition-transform">{label}</span>
        </Link>
    </li>
);

export default Footer;
