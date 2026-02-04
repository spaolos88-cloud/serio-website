import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-xs font-mono text-cyan uppercase tracking-[0.4em] mb-4">Transmission</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">INITIATE CONNECTION</h3>
                    <p className="text-textDim max-w-md mb-12">
                        Have a project that requires precision audio? Our engineers are ready to discuss your sonic requirements.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/5 rounded border border-white/10 text-cyan">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-textDim uppercase tracking-widest mb-1">Electronic Mail</p>
                                <p className="text-white">studio@soniclab.audio</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/5 rounded border border-white/10 text-cyan">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-textDim uppercase tracking-widest mb-1">Facility Location</p>
                                <p className="text-white">Suite 404, Frequency Tower, Cybercity</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/5 rounded border border-white/10 text-cyan">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-textDim uppercase tracking-widest mb-1">Direct Signal</p>
                                <p className="text-white">+1 (555) 010-FREQ</p>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-surface border border-cyan/10 p-10 rounded-2xl relative"
                >
                    <div className="absolute inset-0 bg-brushed-metal/20 pointer-events-none rounded-2xl"></div>

                    <form className="relative z-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-textDim uppercase tracking-widest">Operator Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-bg border border-white/5 p-4 rounded text-white focus:border-cyan/50 focus:outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-textDim uppercase tracking-widest">Return Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-bg border border-white/5 p-4 rounded text-white focus:border-cyan/50 focus:outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-textDim uppercase tracking-widest">Protocol Type</label>
                            <select className="w-full bg-bg border border-white/5 p-4 rounded text-white focus:border-cyan/50 focus:outline-none transition-all">
                                <option>Sound Design</option>
                                <option>Mixing & Mastering</option>
                                <option>Post-Production</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-textDim uppercase tracking-widest">Message Data</label>
                            <textarea
                                rows={4}
                                className="w-full bg-bg border border-white/5 p-4 rounded text-white focus:border-cyan/50 focus:outline-none transition-all"
                                placeholder="Describe your session requirement..."
                            ></textarea>
                        </div>

                        <button className="w-full py-4 bg-white/5 border border-cyan/20 rounded font-mono font-bold uppercase tracking-[0.3em] text-cyan hover:bg-cyan hover:text-bg transition-all flex items-center justify-center gap-3">
                            Transmit Signal <Send className="w-4 h-4" />
                        </button>
                    </form>
                </motion.div>
            </div>

            <footer className="mt-32 max-w-7xl mx-auto border-t border-white/5 pt-12 text-center">
                <p className="text-[10px] font-mono text-textDim uppercase tracking-[0.5em]">
                    The Sonic Lab © 2026 // TRUTH IN FREQUENCY
                </p>
            </footer>
        </section>
    );
};

export default Contact;
